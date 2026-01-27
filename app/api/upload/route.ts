import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import convert from 'heic-convert';

const s3Client = new S3Client({
  region: 'garage',
  endpoint: process.env.S3_ENDPOINT || 'http://192.168.1.251:3900',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for Garage/MinIO
});

const BUCKET_NAME = process.env.S3_BUCKET || 'tylers-website';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if HEIC/HEIF
    const isHeic =
      file.type === 'image/heic' ||
      file.type === 'image/heif' ||
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif');

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/heic',
      'image/heif',
    ];
    if (!allowedTypes.includes(file.type) && !isHeic) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: jpg, png, webp, gif, heic' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max for HEIC, 5MB for others)
    const maxSize = isHeic ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size: ${isHeic ? '10MB' : '5MB'}` },
        { status: 400 }
      );
    }

    let buffer = Buffer.from(await file.arrayBuffer());
    let ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    let contentType = file.type;

    // Convert HEIC to JPEG
    if (isHeic) {
      buffer = Buffer.from(
        await convert({
          buffer,
          format: 'JPEG',
          quality: 0.9,
        })
      );
      ext = 'jpg';
      contentType = 'image/jpeg';
    }

    // Generate unique filename
    const filename = `projects/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // Upload to S3/Garage
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      })
    );

    // Return the URL - can be served via Garage's web endpoint or a proxy
    const baseUrl =
      process.env.S3_PUBLIC_URL ||
      `${process.env.S3_ENDPOINT || 'http://192.168.1.251:3900'}/${BUCKET_NAME}`;
    const url = `${baseUrl}/${filename}`;

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
