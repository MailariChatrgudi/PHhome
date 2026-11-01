/**
 * components/JsonLd.tsx
 *
 * Renders JSON-LD structured data as a <script> tag in the <head>.
 *
 * Usage:
 *   import JsonLd from '@/components/JsonLd';
 *   <JsonLd data={schemaObject} />
 *
 * Security: data is serialized with JSON.stringify. Never pass user-supplied
 * input directly — always build the object from trusted server-side constants.
 *
 * Phase 5 — features.md §1.3, requirements.md FR-S5
 */

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Array<Record<string, any>>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Safe: data is constructed entirely from server-side typed constants.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

