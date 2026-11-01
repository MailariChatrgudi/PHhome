/**
 * lib/validators.ts
 *
 * Zod validation schemas for customer enquiries and job applications.
 * Spec: api.md §1.1, §1.2 & features.md §2.1, §2.2
 */

import { z } from 'zod';
import { ROLES, type RoleValue } from '@/content/roles';

/** Normalizes Indian phone numbers: strips whitespace, hyphens, parentheses, and leading '+91' */
export function normalizeIndianPhone(input: string): string {
  const digitsOnly = input.replace(/[\s\-\(\)\+]/g, '');
  if (digitsOnly.startsWith('91') && digitsOnly.length === 12) {
    return digitsOnly.slice(2);
  }
  return digitsOnly;
}

const indianPhoneSchema = z
  .string({ message: 'Phone number is required' })
  .trim()
  .transform(normalizeIndianPhone)
  .refine((val) => /^[6-9]\d{9}$/.test(val), {
    message: 'Enter a valid 10-digit Indian mobile number',
  });

const nameSchema = z
  .string({ message: 'Name is required' })
  .trim()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(80, { message: 'Name cannot exceed 80 characters' });

const emailOptionalSchema = z
  .string()
  .trim()
  .max(120, { message: 'Email cannot exceed 120 characters' })
  .optional()
  .or(z.literal(''))
  .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Enter a valid email address',
  })
  .transform((val) => (val && val.length > 0 ? val : undefined));

const emailRequiredSchema = z
  .string({ message: 'Email is required' })
  .trim()
  .min(1, { message: 'Email address is required' })
  .max(120, { message: 'Email cannot exceed 120 characters' })
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Enter a valid email address',
  });

const sourcePageSchema = z
  .string()
  .max(200)
  .optional()
  .transform((val) => {
    if (!val) return '/';
    // If it does not match standard relative path pattern, ignore it per api.md §1.1
    if (/^\/[a-z0-9\-/]*$/.test(val)) {
      return val;
    }
    return '/';
  });

/* ─── Customer Enquiry Schema ────────────────────────────────────────────── */

export const CustomerEnquirySchema = z.object({
  name: nameSchema,
  phone: indianPhoneSchema,
  email: emailOptionalSchema,
  message: z
    .string({ message: 'Message is required' })
    .trim()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message cannot exceed 1000 characters' }),
  sourcePage: sourcePageSchema,
  website: z.string().optional().default(''), // Honeypot
  turnstileToken: z.string().optional(),
});

export type CustomerEnquiryInput = z.infer<typeof CustomerEnquirySchema>;

/* ─── Job Applicant Schema ───────────────────────────────────────────────── */

// Build tuple of role values from the single source of truth in content/roles.ts
const roleValues = ROLES.map((r) => r.value) as [RoleValue, ...RoleValue[]];

export const ApplicantApplicationSchema = z.object({
  name: nameSchema,
  phone: indianPhoneSchema,
  email: emailRequiredSchema,
  role: z.enum(roleValues, {
    message: 'Please select a valid role',
  }),
  website: z.string().optional().default(''), // Honeypot
  turnstileToken: z.string().optional(),
});

export type ApplicantApplicationInput = z.infer<typeof ApplicantApplicationSchema>;

/* ─── Error Formatter ────────────────────────────────────────────────────── */

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path[0];
    if (typeof path === 'string' && !fields[path]) {
      fields[path] = issue.message;
    }
  }
  return fields;
}
