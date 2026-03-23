import sharp from 'sharp';

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#111827;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fde047;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect x="100" y="290" width="400" height="4" rx="2" fill="url(#accent)" />
  <text x="100" y="270" font-family="sans-serif" font-size="64" font-weight="bold" fill="#f3f4f6">Tyler Grant</text>
  <text x="100" y="340" font-family="sans-serif" font-size="32" fill="#fde047">Software Engineer</text>
  <text x="100" y="400" font-family="sans-serif" font-size="22" fill="#9ca3af">tyler-grant.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('Created public/og-image.png (1200x630)');
