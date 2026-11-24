import fs from 'fs';
import path from 'path';

const distDir = path.resolve('./dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const files = [
  'index.html',
  'styles.css',
  'app.js',
  'keyboard-layouts.js',
  'lessons-data.js',
  'sound-effects.js',
  '.nojekyll'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(distDir, file));
    console.log(`Copied ${file} -> dist/${file}`);
  }
});

console.log('Build completed successfully!');
