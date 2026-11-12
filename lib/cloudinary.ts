// Browser-safe exports only — no Node.js built-ins (fs, path, crypto) here.
// Server-only functions (saveLocalUpload, uploadToCloudinary, getCloudinaryConfig)
// live in lib/cloudinary.server.ts and must only be imported from API routes / server actions.

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

