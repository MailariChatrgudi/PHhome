import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/content/site';
import { PiPhoneCallFill } from "react-icons/pi";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const quickLinks = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/updates', label: 'Updates' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/careers', label: 'Careers' }, // Careers in footer, not header (design.md §5)
];

export default function Footer() {
  // Hardcoded year — update at each year's first redeploy
  const year = 2026;


  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: 'var(--plum-deep)',
        color: 'var(--surface)',
        paddingBlock: '64px 32px',
      }}
    >
      <div className="container-content">
        {/* ── Top row ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 48,
            paddingBottom: 48,
            borderBottom: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {/* Brand column */}
          <div>
            {/* Logo on white circle (design.md §5) — ring disappears on plum-deep otherwise */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Image
                src={site.logo.path}
                alt={site.logo.alt}
                width={56}
                height={56}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>
              {site.name}
            </div>
            <address
              style={{
                fontStyle: 'normal',
                fontSize: 14,
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <div>{site.address.streetAddress},</div>
              <div>{site.address.addressLocality} {site.address.postalCode}</div>
            </address>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a
                href={`tel:${site.phone}`}
                style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14, display:'flex', alignItems:"center",gap:10}}
              >
                <PiPhoneCallFill size={20} /> {site.phoneDisplay}
              </a>
              <a
                href={`mailto:${site.email}`}
                style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14,  display:'flex', alignItems:"center",gap:10}}
              >
                <MdMarkEmailUnread size={20} /> {site.email}
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, color: 'rgba(255,255,255,0.5)' }}>
              Navigation
            </div>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quickLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        fontSize: 15,
                        transition: 'color 150ms ease-out',
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact CTA */}
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, color: 'rgba(255,255,255,0.5)' }}>
              Get in touch
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 16 }}>
              Need care for a loved one? Call or send a request and we&apos;ll get back to you promptly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={`tel:${site.phone}`} className="btn-primary btn-hero-primary" style={{ textAlign: 'center', fontSize: 15, height: 44 }}>
                <PiPhoneCallFill size={24} /> Call now
              </a>
              <a
                href={site.social.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-hero-secondary"
                style={{ textAlign: 'center', fontSize: 15, height: 44 }}
              >
              <FaWhatsapp color='#25D366' size={24}/>  WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 24,
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <span>© {year} {site.name}. All rights reserved.</span>
          <span>Bengaluru, Karnataka, India</span>
        </div>
      </div>
    </footer>
  );
}
