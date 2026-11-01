import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyContactBar from '@/components/StickyContactBar';
import AnnouncementBar from '@/components/AnnouncementBar';

/**
 * Layout for all public-facing pages (the (site) route group).
 * The route group name "(site)" is invisible in URLs — it just groups routes.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*
        Announcement bar above header — scrolls away with page.
      */}
      <AnnouncementBar />

      {/*
        Header and StickyContactBar use usePathname() which is a runtime-only value.
        Wrapping in Suspense allows dynamic routes to prerender — the shell
        streams in after prerender. The fallback is a minimal placeholder
        that prevents layout shift. (Next.js 16 requirement)
      */}
      <Suspense fallback={
        <div style={{ height: 64, backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--line)' }} />
      }>
        <Header />
      </Suspense>
      <main id="main-content" style={{ flexGrow: 1 }}>
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <StickyContactBar />
      </Suspense>
    </>
  );
}
