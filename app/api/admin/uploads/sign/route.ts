import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/admin/uploads/sign (spec: api.md §4)
 * Returns a signed Cloudinary upload payload so the browser can upload directly
 * without exposing the Cloudinary API secret.
 */
export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        configured: false,
        message: 'Cloudinary credentials are not configured in environment variables.',
      },
      { status: 200 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'updates';

  // Cloudinary signature is SHA-1 of sorted params + api_secret
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  return NextResponse.json({
    configured: true,
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
  });
}

