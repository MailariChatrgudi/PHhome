import type { Metadata } from "next";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: {
    default: "PH Home Nursing Services | Bengaluru",
    template: "%s | PH Home Nursing Services",
  },
  description:
    "Professional home nursing, elderly care, post-hospital care and caregiver services in Bengaluru. Call +91 93539 97698.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://homenursingservice.in"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--ink)] antialiased">
        {/* Skip-to-content for keyboard users (design.md §11) */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* Site-wide LocalBusiness / MedicalBusiness JSON-LD (features.md §1.3) */}
        <JsonLd data={localBusinessSchema()} />
        {children}
      </body>
    </html>
  );
}
