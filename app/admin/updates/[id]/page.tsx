import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/mongodb';
import { Update } from '@/models/Update';
import UpdateEditor from '@/components/admin/UpdateEditor';

export const instant = false;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditUpdatePage({ params }: Props) {
  const { id } = await params;

  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectToDatabase();
  const doc = await Update.findById(id).lean();

  if (!doc) {
    notFound();
  }

  const initialData = {
    _id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt || '',
    content: doc.content || '',
    coverImage: doc.coverImage
      ? {
          url: doc.coverImage.url || '',
          publicId: doc.coverImage.publicId || '',
          alt: doc.coverImage.alt || '',
        }
      : undefined,
    seo: doc.seo
      ? {
          title: doc.seo.title || '',
          description: doc.seo.description || '',
        }
      : undefined,
    status: (doc.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : undefined,
  };

  return <UpdateEditor initialData={initialData} isNew={false} />;
}

