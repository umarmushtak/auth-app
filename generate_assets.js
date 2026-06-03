// Run this script once: node generate_assets.js
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Valid 1x1 transparent PNG
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const buffer = Buffer.from(pngBase64, 'base64');

['icon.png', 'splash-icon.png', 'adaptive-icon.png', 'favicon.png'].forEach(file => {
  const filePath = path.join(assetsDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, buffer);
    console.log('Created:', file);
  } else {
    console.log('Exists:', file);
  }
});
console.log('Done! All assets ready.');
