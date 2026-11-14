import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const standaloneDir = path.resolve(rootDir, '.next/standalone');
const staticSrc = path.resolve(rootDir, '.next/static');
const staticDest = path.resolve(standaloneDir, '.next/static');
const publicSrc = path.resolve(rootDir, 'public');
const publicDest = path.resolve(standaloneDir, 'public');

if (!fs.existsSync(standaloneDir)) {
  console.error('Error: .next/standalone does not exist. Please run "npm run build" first.');
  process.exit(1);
}

console.log('📦 Preparing Hostinger deployment package...');

// 1. Copy .next/static to .next/standalone/.next/static
console.log('-> Copying static assets (.next/static)...');
fs.cpSync(staticSrc, staticDest, { recursive: true });

// 2. Copy public directory to .next/standalone/public
console.log('-> Copying public assets (public/)...');
fs.cpSync(publicSrc, publicDest, { recursive: true });

console.log('\n✅ Deployment files ready in: .next/standalone/');
console.log('---------------------------------------------------------');
console.log('To deploy to Hostinger Web App Plan:');
console.log('1. Zip all contents INSIDE the ".next/standalone" folder.');
console.log('2. Upload and extract into Hostinger public_html.');
console.log('3. Set "Application startup file" to "server.js" in hPanel.');
console.log('---------------------------------------------------------\n');

