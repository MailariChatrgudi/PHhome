import { NextResponse } from 'next/server';
import { isCloudinaryConfigured, uploadToCloudinary, saveLocalUpload } from '@/lib/cloudinary';

/**
 * POST /api/admin/uploads
 * Upload an image server-side.
 * Expects multipart/form-data with a "file" field.
 * Protected by middleware.ts (admin only).
 *
 * Attempts Cloudinary first; if Cloudinary fails (e.g. permission error, network block)
 * or is unconfigured, gracefully falls back to local storage in public/uploads/updates/
 * so administrators are never blocked from creating updates with cover photos.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'NO_FILE', message: 'No valid image file provided in "file" field' },
        { status: 400 }
      );
    }

    const folder = (formData.get('folder') as string) || 'updates';
    const originalName = file instanceof File ? file.name : 'cover.jpg';

    // 1. Try Cloudinary if configured
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(file, folder);
        return NextResponse.json({
          success: true,
          url: result.url,
          publicId: result.publicId,
          storage: 'cloudinary',
        });
      } catch (cloudErr: unknown) {
        const cloudMsg = cloudErr instanceof Error ? cloudErr.message : 'Cloudinary upload failed';
        console.warn('Cloudinary upload failed, gracefully falling back to local public storage:', cloudMsg);

        // Fall back to local file storage
        const local = await saveLocalUpload(file, originalName, folder);
        return NextResponse.json({
          success: true,
          url: local.url,
          publicId: local.publicId,
          storage: 'local',
          warning: cloudMsg,
        });
      }
    }

    // 2. If Cloudinary is not configured at all, save locally
    const local = await saveLocalUpload(file, originalName, folder);
    return NextResponse.json({
      success: true,
      url: local.url,
      publicId: local.publicId,
      storage: 'local',
      message: 'Cloudinary is not configured; file saved to local public storage.',
    });
  } catch (err: unknown) {
    console.error('Server image upload fatal error:', err);
    return NextResponse.json(
      {
        error: 'UPLOAD_FAILED',
        message: err instanceof Error ? err.message : 'Failed to process image upload',
      },
      { status: 500 }
    );
  }
}
