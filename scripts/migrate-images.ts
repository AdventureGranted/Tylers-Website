import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Load environment variables
import 'dotenv/config';

// Create Prisma client with pg adapter (matching app/lib/prisma.ts)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const s3Client = new S3Client({
  region: 'garage',
  endpoint: process.env.S3_ENDPOINT || 'http://192.168.1.251:3900',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.S3_BUCKET || 'tylers-website';
const S3_PUBLIC_URL =
  process.env.S3_PUBLIC_URL || 'http://192.168.1.251:3902/tylers-website';

// Where existing images are stored (the NAS mount)
// Use Windows path since Node runs in Windows context
const OLD_UPLOADS_DIR = process.env.OLD_UPLOADS_DIR || 'U:\\';

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  return types[ext || ''] || 'application/octet-stream';
}

async function migrateImages() {
  console.log('Starting image migration to Garage...\n');

  // Get all project images from database
  const images = await prisma.projectImage.findMany({
    include: { project: { select: { title: true } } },
  });

  console.log(`Found ${images.length} images to migrate\n`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const image of images) {
    const oldUrl = image.url;

    // Skip if already migrated (full URL)
    if (oldUrl.startsWith('http')) {
      console.log(`SKIP: ${oldUrl} (already migrated)`);
      skipped++;
      continue;
    }

    // Convert /uploads/projects/file.jpg to local path
    const relativePath = oldUrl.replace(/^\/uploads\//, '');
    const localPath = path.join(OLD_UPLOADS_DIR, relativePath);

    // Check if file exists
    if (!fs.existsSync(localPath)) {
      console.error(`FAIL: ${oldUrl} - File not found at ${localPath}`);
      failed++;
      continue;
    }

    try {
      // Read file
      const fileBuffer = fs.readFileSync(localPath);
      const filename = path.basename(localPath);
      const s3Key = `projects/${filename}`;

      // Upload to Garage
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: getContentType(filename),
        })
      );

      // Update database with new URL
      const newUrl = `${S3_PUBLIC_URL}/${s3Key}`;
      await prisma.projectImage.update({
        where: { id: image.id },
        data: { url: newUrl },
      });

      console.log(`OK: ${oldUrl} -> ${newUrl}`);
      migrated++;
    } catch (error) {
      console.error(`FAIL: ${oldUrl} - ${error}`);
      failed++;
    }
  }

  console.log('\n--- Migration Summary ---');
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Failed:   ${failed}`);
  console.log(`Total:    ${images.length}`);

  await prisma.$disconnect();
  await pool.end();
}

migrateImages().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
