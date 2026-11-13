// SERVER-ONLY — do NOT import this from Client Components or pages that bundle for the browser.
// Use lib/cloudinary.ts for browser-safe utilities (extractCloudinaryPublicId, isCloudinaryConfigured).
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import type { CloudinaryUploadResult } from './cloudinary';

/** Returns the Cloudinary env vars as a typed config object */
export function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || '',
  };
}

/**
 * Saves an uploaded file to public/uploads/<folder>/ so it's served
 * as a static asset at /uploads/<folder>/<filename>.
 * Returns a CloudinaryUploadResult-shaped object for API compatibility.
 */
export async function saveLocalUpload(
  file: Blob | Buffer | string,
  originalName: string,
  folder = 'updates'
): Promise<CloudinaryUploadResult> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
  fs.mkdirSync(uploadsDir, { recursive: true });

  const ext = path.extname(originalName) || '.jpg';
  const baseName = path.basename(originalName, ext).replace(/[^a-z0-9_-]/gi, '_');
  const fileName = `${baseName}_${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  let buffer: Buffer;
  if (typeof file === 'string') {
    if (file.startsWith('data:')) {
      const base64Data = file.split(',')[1] || '';
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      buffer = Buffer.from(file, 'base64');
    }
  } else if (Buffer.isBuffer(file)) {
    buffer = file;
  } else if (file && typeof (file as Blob).arrayBuffer === 'function') {
    buffer = Buffer.from(await (file as Blob).arrayBuffer());
  } else {
    throw new Error('Unsupported file format provided to saveLocalUpload');
  }

  fs.writeFileSync(filePath, buffer);

  const publicId = `${folder}/${path.basename(fileName, ext)}`;
  const url = `/uploads/${folder}/${fileName}`;

  return { url, publicId };
}

/**
 * Uploads an image (as base64 or Buffer/Blob) to Cloudinary from server-side.
 */
export async function uploadToCloudinary(
  fileData: string | Blob,
  folder = 'updates'
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials are not configured in environment variables.');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  const formData = new FormData();
  formData.append('file', fileData);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
  }

  return {
    url: data.secure_url,
    publicId: data.public_id || '',
  };
}

