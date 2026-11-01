import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * models/Update.ts
 *
 * Mongoose model for public and admin updates (care guides, news).
 * Spec: api.md §6
 *
 * Schema:
 * - title: string, required (3-120 chars)
 * - slug: string, required, unique, lowercase
 * - previousSlugs: string[] (for 301 redirects when slug is renamed)
 * - excerpt: string
 * - content: string (Markdown)
 * - coverImage: { url: string, publicId: string, alt: string }
 * - seo: { title: string, description: string }
 * - status: 'draft' | 'published'
 * - publishedAt: Date | null
 * - createdAt: Date
 * - updatedAt: Date
 *
 * Indexes:
 * - { slug: 1 } unique
 * - { status: 1, publishedAt: -1 }
 */

export interface ICoverImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface ISEO {
  title?: string;
  description?: string;
}

export interface IUpdate extends Document {
  title: string;
  slug: string;
  previousSlugs: string[];
  excerpt: string;
  content: string;
  coverImage?: ICoverImage;
  seo?: ISEO;
  status: 'draft' | 'published';
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CoverImageSchema = new Schema<ICoverImage>(
  {
    url: { type: String, trim: true, default: '' },
    publicId: { type: String, trim: true, default: '' },
    alt: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const SEOSchema = new Schema<ISEO>(
  {
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const UpdateSchema = new Schema<IUpdate>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    previousSlugs: {
      type: [String],
      default: [],
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    coverImage: {
      type: CoverImageSchema,
      default: () => ({ url: '', publicId: '', alt: '' }),
    },
    seo: {
      type: SEOSchema,
      default: () => ({ title: '', description: '' }),
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient public queries: newest published first
UpdateSchema.index({ status: 1, publishedAt: -1 });

export const Update: Model<IUpdate> =
  mongoose.models.Update || mongoose.model<IUpdate>('Update', UpdateSchema);

export default Update;

