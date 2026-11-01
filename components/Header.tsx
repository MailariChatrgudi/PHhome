'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { site } from '@/content/site';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/updates', label: 'Updates' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close menu on route change — use ref to avoid setState-in-effect lint error
  useEffect(() => {
    const id = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  // Add shadow after scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--line)',
          boxShadow: scrolled ? 'var(--shadow-rest)' : 'none',
          transition: 'box-shadow 200ms ease-out',
        }}
      >
        <div className="container-content" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>
          {/* ── Logo + brand name ── */}
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
          >
            <Image
              src={site.logo.path}
              alt={site.logo.alt}
              width={40}
              height={40}
              priority
              style={{ borderRadius: '50%', width: 40, height: 40, objectFit: 'cover' }}
            />
            <span
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: 'var(--ink)',
                lineHeight: 1.2,
                maxWidth: 160,
              }}
            >
              PH Home Nursing
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Main navigation"
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}
            className="hidden-mobile"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname.startsWith(href) ? 'page' : undefined}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: pathname.startsWith(href) ? 'var(--plum)' : 'var(--ink)',
                  backgroundColor: pathname.startsWith(href) ? 'var(--plum-tint)' : 'transparent',
                  transition: 'background-color 150ms ease-out, color 150ms ease-out',
                }}
              >
                {label}
              </Link>
            ))}

            {/* Call now pill */}
            <a
              href={`tel:${site.phone}`}
              className="btn-primary"
              style={{ marginLeft: 8, height: 40, paddingInline: 20, fontSize: 15 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Call now</span>
            </a>
          </nav>

          {/* ── Mobile: call + hamburger ── */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }} className="show-mobile">
            <a
              href={`tel:${site.phone}`}
              aria-label="Call now"
              className="btn-primary"
              style={{ height: 40, paddingInline: 16, fontSize: 14 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Call</span>
            </a>
            <button
              type="button"
              suppressHydrationWarning
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--line)',
                borderRadius: 8,
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--ink)',
              }}
            >
              {menuOpen ? (
                /* X icon */
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu sheet ── */}
      {/* Backdrop */}
      {menuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            backgroundColor: 'rgba(31, 26, 29, 0.4)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}
      <nav
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        hidden={!menuOpen}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: 'min(320px, 90vw)',
          backgroundColor: 'var(--surface)',
          boxShadow: 'var(--shadow-lift)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          overflowY: 'auto',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 250ms ease-out',
        }}
      >
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          style={{
            alignSelf: 'flex-end',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--line)',
            borderRadius: 8,
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--ink)',
            marginBottom: 24,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1 }}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? 'page' : undefined}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                fontSize: 17,
                fontWeight: 500,
                textDecoration: 'none',
                color: pathname.startsWith(href) ? 'var(--plum)' : 'var(--ink)',
                backgroundColor: pathname.startsWith(href) ? 'var(--plum-tint)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
          <a href={`tel:${site.phone}`} className="btn-primary" style={{ textAlign: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{site.phoneDisplay}</span>
          </a>
          <a
            href={site.social.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textAlign: 'center', borderColor: 'var(--whatsapp)', color: 'var(--whatsapp)' }}
          >
            <span>WhatsApp Us</span>
          </a>
        </div>
      </nav>

      {/* Responsive visibility helpers */}
      <style>{`
        @media (min-width: 1024px) { .show-mobile { display: none !important; } }
        @media (max-width: 1023px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </>
  );
}
