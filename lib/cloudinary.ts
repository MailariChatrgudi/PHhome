import crypto from 'crypto';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/** Check if all required Cloudinary environment variables are present */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Extracts the Cloudinary public_id from a Cloudinary image URL.
 * Works with URLs with or without version strings, transforms, or query parameters.
 * E.g.
 * "https://res.cloudinary.com/cloud/image/upload/v12345/updates/sample.jpg" -> "updates/sample"
 * "https://res.cloudinary.com/cloud/image/upload/updates/sample.png" -> "updates/sample"
 */
export function extractCloudinaryPublicId(url?: string): string {
  if (!url || !url.includes('cloudinary.com')) return '';
  try {
    const cleanUrl = url.split('?')[0];
    const match = cleanUrl.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    return match ? decodeURIComponent(match[1]) : '';
  } catch {
    return '';
  }
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

