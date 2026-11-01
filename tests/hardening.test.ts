import test, { describe } from 'node:test';
import assert from 'node:assert';
import nextConfig from '@/next.config';
import { redirects } from '@/redirects';

describe('Phase 9: Security Headers & CSP (next.config.ts)', () => {
  test('1. Security headers are configured for all routes (/:path*)', async () => {
    assert.ok(typeof nextConfig.headers === 'function', 'nextConfig must define async headers()');
    const headerConfigs = await nextConfig.headers();
    assert.ok(Array.isArray(headerConfigs), 'headers must return an array');

    const globalHeaders = headerConfigs.find((h) => h.source === '/:path*');
    assert.ok(globalHeaders, 'Global headers for /:path* must be defined');

    const headersMap = new Map(globalHeaders.headers.map((h: { key: string; value: string }) => [h.key, h.value]));

    // Check mandatory security headers
    assert.strictEqual(headersMap.get('X-Frame-Options'), 'DENY', 'X-Frame-Options must be DENY');
    assert.strictEqual(headersMap.get('X-Content-Type-Options'), 'nosniff', 'X-Content-Type-Options must be nosniff');
    assert.strictEqual(
      headersMap.get('Referrer-Policy'),
      'strict-origin-when-cross-origin',
      'Referrer-Policy must be strict-origin-when-cross-origin'
    );
    assert.ok(headersMap.has('Strict-Transport-Security'), 'HSTS header must be present');
    assert.ok(headersMap.has('Permissions-Policy'), 'Permissions-Policy header must be present');
  });

  test('2. Content Security Policy (CSP) restricts origins appropriately', async () => {
    const headerConfigs = await nextConfig.headers!();
    const globalHeaders = headerConfigs.find((h) => h.source === '/:path*');
    const headersMap = new Map(globalHeaders!.headers.map((h: { key: string; value: string }) => [h.key, h.value]));

    const csp = headersMap.get('Content-Security-Policy');
    assert.ok(typeof csp === 'string' && csp.length > 50, 'CSP header must be configured');

    // Cloudinary images
    assert.ok(csp.includes('res.cloudinary.com'), 'CSP must whitelist res.cloudinary.com');

    // Google Maps embed
    assert.ok(csp.includes('maps.google.com') || csp.includes('www.google.com'), 'CSP must whitelist Google Maps iframe');

    // Cloudflare Turnstile
    assert.ok(csp.includes('challenges.cloudflare.com'), 'CSP must whitelist challenges.cloudflare.com');

    // Anti-clickjacking
    assert.ok(csp.includes("frame-ancestors 'none'"), 'CSP must include frame-ancestors none');
    assert.ok(csp.includes("object-src 'none'"), 'CSP must include object-src none');
  });

  test('3. Cloudinary remote patterns configured for next/image', () => {
    const remotePatterns = nextConfig.images?.remotePatterns;
    assert.ok(Array.isArray(remotePatterns), 'remotePatterns must be configured');
    const hasCloudinary = remotePatterns.some((p: { hostname: string }) => p.hostname === 'res.cloudinary.com');
    assert.ok(hasCloudinary, 'Cloudinary hostname must be allowed for next/image');
  });
});

describe('Phase 9: 301 Legacy Redirects (redirects.ts)', () => {
  test('4. All required Boost-360 legacy URL patterns are covered and permanent', () => {
    assert.ok(Array.isArray(redirects), 'redirects must be an array');
    assert.ok(redirects.length >= 18, `Expected at least 18 redirect rules, found ${redirects.length}`);

    // Verify all redirects are permanent (HTTP 301)
    for (const r of redirects) {
      assert.strictEqual(r.permanent, true, `Redirect from ${r.source} must be permanent (301)`);
    }
  });

  test('5. Service page redirects map to correct new paths', () => {
    const serviceMap: Record<string, string> = {
      '/page/nursing-care-services/:id': '/services/home-nursing',
      '/page/elderly-care-services/:id': '/services/elderly-care',
      '/page/patient-care-services/:id': '/services',
      '/page/ambulance-services/:id': '/services/patient-transport',
      '/page/patient-transport-vehicle/:id': '/services/patient-transport',
      '/page/surgical-instruments-purchased-and-rented/:id': '/services',
      '/page/home-attendants/:id': '/services/bedside-attendants',
      '/page/hospital-special-nursing-care/:id': '/services/hospital-nursing',
      '/page/dementia-care/:id': '/services/dementia-care',
      '/page/mother-and-baby-care/:id': '/services/mother-and-baby-care',
      '/page/patient-care-male-female-24-7/:id': '/services/live-in-caretaker',
    };

    for (const [source, destination] of Object.entries(serviceMap)) {
      const match = redirects.find((r) => r.source === source);
      assert.ok(match, `Redirect source ${source} should exist`);
      assert.strictEqual(match?.destination, destination, `Destination for ${source} should be ${destination}`);
    }
  });

  test('6. Products, careers, updates, and map redirects map correctly', () => {
    const miscMap: Record<string, string> = {
      '/products/patient-care-jobs/:id': '/careers',
      '/products/home-nursing-services-jobs-health-care-services-at-home/:id': '/careers',
      '/products/ph-home-nursing-services/:id': '/careers',
      '/products/category/home-nursing-services-jobs/:path*': '/careers',
      '/products/:path*': '/services',
      '/all-products/:path*': '/services',
      '/latest-updates/:path*': '/updates',
      '/latest-update/:path*': '/updates',
      '/mapview/:path*': '/contact',
      '/testimonials/:path*': '/',
      '/image-gallery/:path*': '/',
      '/pages/:path*': '/',
    };

    for (const [source, destination] of Object.entries(miscMap)) {
      const match = redirects.find((r) => r.source === source);
      assert.ok(match, `Redirect source ${source} should exist`);
      assert.strictEqual(match?.destination, destination, `Destination for ${source} should be ${destination}`);
    }
  });
});

