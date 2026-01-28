import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import convert from 'heic-convert';

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
const PUBLIC_URL = process.env.S3_PUBLIC_URL || `${process.env.S3_ENDPOINT || 'http://192.168.1.251:3900'}/${BUCKET_NAME}`;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
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

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Max size: 10MB' },
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

    // Get current user to delete old image if exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { profileImage: true },
    });

    // Delete old profile image from S3 if exists
    if (user?.profileImage) {
      try {
        const oldKey = user.profileImage.replace(`${PUBLIC_URL}/`, '');
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: oldKey,
          })
        );
      } catch (e) {
        console.error('Failed to delete old profile image:', e);
      }
    }

    // Generate unique filename
    const filename = `profiles/${session.user.id}-${Date.now()}.${ext}`;

    // Upload to S3/Garage
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const url = `${PUBLIC_URL}/${filename}`;

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: { profileImage: url },
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { profileImage: true },
    });

    if (user?.profileImage) {
      // Delete from S3
      try {
        const key = user.profileImage.replace(`${PUBLIC_URL}/`, '');
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          })
        );
      } catch (e) {
        console.error('Failed to delete profile image from S3:', e);
      }

      // Update user
      await prisma.user.update({
        where: { id: session.user.id },
        data: { profileImage: null },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile image delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
