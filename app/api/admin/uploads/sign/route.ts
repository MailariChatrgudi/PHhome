import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCloudinaryConfig, isCloudinaryConfigured } from '@/lib/cloudinary';

/**
 * POST /api/admin/uploads/sign (spec: api.md §4)
 * Returns a signed Cloudinary upload payload (and uploadPreset if configured)
 * so the browser can upload directly without exposing the Cloudinary API secret.
 */
export async function POST() {
  const { cloudName, apiKey, apiSecret, uploadPreset } = getCloudinaryConfig();

  if (!isCloudinaryConfigured()) {
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

  let signature = '';
  if (apiSecret) {
    // Cloudinary signature is SHA-1 of sorted params + api_secret
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    signature = crypto.createHash('sha1').update(stringToSign).digest('hex');
  }

  return NextResponse.json({
    configured: true,
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    uploadPreset: uploadPreset || undefined,
  });
}
