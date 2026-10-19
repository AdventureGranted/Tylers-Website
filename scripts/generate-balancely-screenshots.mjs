// Generates web-sized Balancely screenshots for /projects/balancely.
//
// Usage: node scripts/generate-balancely-screenshots.mjs <source-dir>
//
// <source-dir> must contain dark/ and light/ folders of full-resolution PNGs.
// The originals stay outside this repo; only the resized AVIF/WebP copies are
// written to public/balancely/, so the deployed bundle never ships them.
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';

const OUT_DIR = 'public/balancely';
const THEMES = ['dark', 'light'];
const WIDTHS = [480, 960];
const AVIF_QUALITY = 60;
const WEBP_QUALITY = 80;

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error(
    'Usage: node scripts/generate-balancely-screenshots.mjs <source-dir>'
  );
  process.exit(1);
}

let total = 0;

for (const theme of THEMES) {
  const inDir = join(sourceDir, theme);
  const outDir = join(OUT_DIR, theme);
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(inDir))
    .filter((f) => extname(f).toLowerCase() === '.png')
    .sort();

  for (const file of files) {
    const name = basename(file, extname(file));
    for (const width of WIDTHS) {
      const resized = sharp(join(inDir, file)).resize({ width });
      const avifPath = join(outDir, `${name}-${width}.avif`);
      const webpPath = join(outDir, `${name}-${width}.webp`);
      await resized.clone().avif({ quality: AVIF_QUALITY }).toFile(avifPath);
      await resized.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath);
      for (const p of [avifPath, webpPath]) {
        total += (await stat(p)).size;
      }
    }
    console.log(`${theme}/${name}`);
  }
}

console.log(`Wrote ${(total / 1024 / 1024).toFixed(2)}MB to ${OUT_DIR}`);
