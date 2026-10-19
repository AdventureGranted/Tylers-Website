// Generates web-sized Back Up screenshots and gameplay clips for
// /projects/backup.
//
// Usage: node scripts/generate-backup-media.mjs <source-dir>
//
// <source-dir> holds the full-resolution PNG screenshots and a gifs/ folder of
// gameplay recordings. The originals stay outside this repo; only the resized
// copies are written to public/backup/, so the deployed bundle never ships them.
import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import { join } from 'path';

const OUT_DIR = 'public/backup';
const WIDTHS = [480, 960];
const AVIF_QUALITY = 60;
const WEBP_QUALITY = 80;

// Output name -> source PNG per theme. Screens captured in only one theme reuse
// that capture for the other, so ThemedScreenshot always finds both.
const SCREENS = {
  '01-gameplay': {
    light: '03-gameplay-light-mode.png',
    dark: '04-gameplay-dark-mode.png',
  },
  '02-main-menu': { light: '01-main-menu.png', dark: '05-main-menu-dark.png' },
  '03-setup': {
    light: '02-setup-classic.png',
    dark: '07-setup-rules-dark.png',
  },
  '04-tutorial': {
    light: '06-tutorial-back-up-rule.png',
    dark: '06-tutorial-back-up-rule.png',
  },
  '05-results': { light: '08-results.png', dark: '08-results.png' },
};

// Clip name -> first frame to keep. Two recordings open on a fading debug menu.
const CLIPS = {
  'backed-up': 5,
  'jack-swap': 0,
  knockout: 0,
  'leave-home': 0,
  'team-win': 4,
};

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error('Usage: node scripts/generate-backup-media.mjs <source-dir>');
  process.exit(1);
}

let total = 0;
const track = async (p) => {
  total += (await stat(p)).size;
};

for (const [name, themes] of Object.entries(SCREENS)) {
  for (const [theme, file] of Object.entries(themes)) {
    const outDir = join(OUT_DIR, theme);
    await mkdir(outDir, { recursive: true });
    for (const width of WIDTHS) {
      const resized = sharp(join(sourceDir, file)).resize({ width });
      const avifPath = join(outDir, `${name}-${width}.avif`);
      const webpPath = join(outDir, `${name}-${width}.webp`);
      await resized.clone().avif({ quality: AVIF_QUALITY }).toFile(avifPath);
      await resized.clone().webp({ quality: WEBP_QUALITY }).toFile(webpPath);
      await track(avifPath);
      await track(webpPath);
    }
    console.log(`${theme}/${name}`);
  }
}

// Clips become animated WebP (smaller than the GIFs, with full color) plus a
// still frame shown to visitors who prefer reduced motion.
const clipDir = join(OUT_DIR, 'clips');
await mkdir(clipDir, { recursive: true });
for (const [name, firstFrame] of Object.entries(CLIPS)) {
  const gif = join(sourceDir, 'gifs', `${name}.gif`);
  const { pages } = await sharp(gif).metadata();
  const animatedPath = join(clipDir, `${name}.webp`);
  const stillPath = join(clipDir, `${name}-still.webp`);
  await sharp(gif, { page: firstFrame, pages: -1 })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(animatedPath);
  await sharp(gif, { page: Math.floor((firstFrame + pages) / 2) })
    .webp({ quality: WEBP_QUALITY })
    .toFile(stillPath);
  await track(animatedPath);
  await track(stillPath);
  console.log(`clips/${name}`);
}

console.log(`Wrote ${(total / 1024 / 1024).toFixed(2)}MB to ${OUT_DIR}`);
