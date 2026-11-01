import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';

import { Update } from '@/models/Update';
import { setMongooseConnectionForTesting } from '@/lib/mongodb';
import { GET as getUpdatesHandler } from '@/app/api/updates/route';
import { GET as getUpdateBySlugHandler } from '@/app/api/updates/[slug]/route';

describe('Phase 7: Update Model Schema & Indexes', () => {
  test('1. Schema defines required fields, enums, defaults, and indexes', () => {
    const schema = Update.schema;

    // Title validation
    const titlePath = schema.path('title');
    assert.ok(titlePath.isRequired, 'Title must be required');

    // Slug validation
    const slugPath = schema.path('slug');
    assert.ok(slugPath.isRequired, 'Slug must be required');

    // Status enum and default
    const statusPath = schema.path('status') as unknown as {
      enumValues: string[];
      defaultValue: string;
    };
    assert.deepStrictEqual(statusPath.enumValues, ['draft', 'published']);
    assert.strictEqual(statusPath.defaultValue, 'draft');

    // Compound index for efficient public sorting
    const indexes = schema.indexes();
    const hasCompoundIndex = indexes.some(([indexSpec]) => {
      const keys = Object.keys(indexSpec);
      return keys.includes('status') && keys.includes('publishedAt');
    });
    assert.ok(
      hasCompoundIndex,
      'Must have compound index on { status: 1, publishedAt: -1 }'
    );
  });
});

describe('Phase 7: Public Updates API (GET /api/updates)', () => {
  const originalFind = Update.find;
  const originalCount = Update.countDocuments;
  let envBackup: string | undefined;

  beforeEach(() => {
    envBackup = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
    // Stub the cached connection so no real network TCP connection is attempted
    setMongooseConnectionForTesting({} as unknown);
  });

  afterEach(() => {
    Update.find = originalFind;
    Update.countDocuments = originalCount;
    process.env.MONGODB_URI = envBackup;
    setMongooseConnectionForTesting(null);
  });

  test('2. Filters strictly by status: "published" and sorts by publishedAt: -1', async () => {
    let capturedFilter: unknown = null;
    let capturedSort: unknown = null;

    const mockItems = [
      {
        slug: 'post-1',
        title: 'Post 1',
        excerpt: 'Excerpt 1',
        publishedAt: new Date('2026-10-20T00:00:00.000Z'),
        updatedAt: new Date('2026-10-21T00:00:00.000Z'),
        coverImage: { url: 'https://img.com/1.jpg', alt: 'Alt 1' },
      },
    ];

    Update.find = ((filter: unknown) => {
      capturedFilter = filter;
      return {
        sort: (sortSpec: unknown) => {
          capturedSort = sortSpec;
          return {
            skip: () => ({
              limit: () => ({
                select: () => ({
                  lean: async () => mockItems,
                }),
              }),
            }),
          };
        },
      };
    }) as unknown as typeof Update.find;

    Update.countDocuments = (async (filter: unknown) => {
      assert.deepStrictEqual(filter, { status: 'published' });
      return 1;
    }) as unknown as typeof Update.countDocuments;

    const req = new Request('http://localhost/api/updates?page=1&limit=9');
    const res = await getUpdatesHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(capturedFilter, { status: 'published' });
    assert.deepStrictEqual(capturedSort, { publishedAt: -1 });
    assert.strictEqual(json.items.length, 1);
    assert.strictEqual(json.items[0].slug, 'post-1');
    assert.strictEqual(json.total, 1);
    assert.strictEqual(json.totalPages, 1);
  });

  test('3. Pagination calculations for multiple pages', async () => {
    Update.find = (() => ({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            select: () => ({
              lean: async () => [],
            }),
          }),
        }),
      }),
    })) as unknown as typeof Update.find;

    Update.countDocuments = (async () => 25) as unknown as typeof Update.countDocuments;

    const req = new Request('http://localhost/api/updates?page=2&limit=9');
    const res = await getUpdatesHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.page, 2);
    assert.strictEqual(json.limit, 9);
    assert.strictEqual(json.total, 25);
    assert.strictEqual(json.totalPages, 3);
  });
});

describe('Phase 7: Public Single Update API (GET /api/updates/[slug])', () => {
  const originalFindOne = Update.findOne;
  let envBackup: string | undefined;

  beforeEach(() => {
    envBackup = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test_db';
    setMongooseConnectionForTesting({} as unknown);
  });

  afterEach(() => {
    Update.findOne = originalFindOne;
    process.env.MONGODB_URI = envBackup;
    setMongooseConnectionForTesting(null);
  });

  test('4. Published post returns 200 with full content', async () => {
    Update.findOne = ((query: { slug?: string }) => ({
      lean: async () => {
        if (query.slug === 'active-care-post') {
          return {
            slug: 'active-care-post',
            title: 'Active Care Post',
            excerpt: 'Excerpt text',
            content: '## Markdown Content Here',
            status: 'published',
            publishedAt: new Date('2026-10-15T00:00:00.000Z'),
            updatedAt: new Date('2026-10-16T00:00:00.000Z'),
            coverImage: { url: 'https://img.com/hero.jpg', alt: 'Hero' },
            seo: { title: 'Custom SEO Title', description: 'Custom Description' },
          };
        }
        return null;
      },
    })) as unknown as typeof Update.findOne;

    const req = new Request('http://localhost/api/updates/active-care-post');
    const res = await getUpdateBySlugHandler(req, {
      params: Promise.resolve({ slug: 'active-care-post' }),
    });
    const json = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.slug, 'active-care-post');
    assert.strictEqual(json.title, 'Active Care Post');
    assert.strictEqual(json.content, '## Markdown Content Here');
  });

  test('5. Draft post returns 404 NOT_FOUND (drafts strictly invisible publicly)', async () => {
    Update.findOne = ((query: { slug?: string }) => ({
      lean: async () => {
        if (query.slug === 'secret-draft') {
          return {
            slug: 'secret-draft',
            title: 'Secret Draft',
            status: 'draft', // DRAFT
            content: 'Private content',
          };
        }
        return null;
      },
    })) as unknown as typeof Update.findOne;

    const req = new Request('http://localhost/api/updates/secret-draft');
    const res = await getUpdateBySlugHandler(req, {
      params: Promise.resolve({ slug: 'secret-draft' }),
    });
    const json = await res.json();

    assert.strictEqual(res.status, 404);
    assert.strictEqual(json.error.code, 'NOT_FOUND');
  });

  test('6. Non-existent slug returns 404 NOT_FOUND', async () => {
    Update.findOne = (() => ({
      lean: async () => null,
    })) as unknown as typeof Update.findOne;

    const req = new Request('http://localhost/api/updates/does-not-exist');
    const res = await getUpdateBySlugHandler(req, {
      params: Promise.resolve({ slug: 'does-not-exist' }),
    });
    const json = await res.json();

    assert.strictEqual(res.status, 404);
    assert.strictEqual(json.error.code, 'NOT_FOUND');
  });

  test('7. Old slug in previousSlugs returns redirect info for 301 redirection', async () => {
    Update.findOne = ((query: { slug?: string; previousSlugs?: string }) => ({
      lean: async () => {
        if (query.previousSlugs === 'old-slug-title') {
          return {
            slug: 'new-updated-slug-title',
            status: 'published',
          };
        }
        return null;
      },
    })) as unknown as typeof Update.findOne;

    const req = new Request('http://localhost/api/updates/old-slug-title');
    const res = await getUpdateBySlugHandler(req, {
      params: Promise.resolve({ slug: 'old-slug-title' }),
    });
    const json = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.redirect, true);
    assert.strictEqual(json.destination, '/updates/new-updated-slug-title');
  });
});
