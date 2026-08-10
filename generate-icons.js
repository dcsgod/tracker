import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUT_DIR = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const r = size * 0.22;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#0d1b2a');
  grad.addColorStop(0.5, '#112240');
  grad.addColorStop(1, '#1a3a5c');
  ctx.fillStyle = grad;

  // Rounded rect
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // Glow effect
  const glow = ctx.createRadialGradient(size*0.35, size*0.3, size*0.05, size*0.5, size*0.5, size*0.5);
  glow.addColorStop(0, 'rgba(79,172,254,0.25)');
  glow.addColorStop(0.6, 'rgba(167,139,250,0.1)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.5, 0, Math.PI*2);
  ctx.fill();

  // Target emoji
  ctx.font = `${Math.floor(size * 0.52)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎯', size / 2, size / 2 + size * 0.025);

  return canvas.toBuffer('image/png');
}

for (const size of SIZES) {
  const buf = drawIcon(size);
  const file = path.join(OUT_DIR, `icon-${size}.png`);
  fs.writeFileSync(file, buf);
  console.log(`✅ icon-${size}.png`);
}
console.log('Done! Icons written to public/icons/');
