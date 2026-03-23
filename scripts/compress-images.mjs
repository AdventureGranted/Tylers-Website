import sharp from 'sharp';
import { readdir, stat, rename, writeFile, unlink } from 'fs/promises';
import { join, extname } from 'path';

const PUBLIC_DIR = 'public';
const ABOUT_DIR = 'public/about';
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;

async function compressImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const info = await stat(filePath);
  const sizeMB = (info.size / 1024 / 1024).toFixed(2);

  if (info.size < 200 * 1024) {
    console.log(`SKIP ${filePath} (${sizeMB}MB - already small)`);
    return;
  }

  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = sharp(filePath);

  if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
    pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  }

  const buffer = await pipeline.toBuffer();
  const newSizeMB = (buffer.length / 1024 / 1024).toFixed(2);

  if (buffer.length < info.size) {
    const tmpPath = filePath + '.tmp';
    await writeFile(tmpPath, buffer);
    await unlink(filePath);
    await rename(tmpPath, filePath);
    console.log(`COMPRESSED ${filePath}: ${sizeMB}MB -> ${newSizeMB}MB`);
  } else {
    console.log(`SKIP ${filePath} (${sizeMB}MB - compression not smaller)`);
  }
}

async function processDirectory(dir, extensions = ['.jpg', '.jpeg', '.png']) {
  const entries = await readdir(dir);
  for (const entry of entries) {
    const filePath = join(dir, entry);
    const entryStat = await stat(filePath);
    if (entryStat.isFile() && extensions.includes(extname(entry).toLowerCase())) {
      await compressImage(filePath);
    }
  }
}

console.log('Compressing images in public/...');
await processDirectory(PUBLIC_DIR);
console.log('\nCompressing images in public/about/...');
await processDirectory(ABOUT_DIR);
console.log('\nDone!');
