import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import { POST as customerHandler } from '@/app/api/query/customer/route';
import { POST as applicantHandler } from '@/app/api/query/applicant/route';
import { rateLimiter } from '@/lib/rateLimit';
import { setResendClientForTesting } from '@/lib/mail';

interface MockSendCall {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

function createMockResend(options?: {
  errorReturn?: { message: string } | null;
  throwError?: Error | null;
}) {
  const calls: MockSendCall[] = [];

  const mockClient = {
    emails: {
      send: async (payload: MockSendCall) => {
        calls.push(payload);
        if (options?.throwError) {
          throw options.throwError;
        }
        if (options?.errorReturn) {
          return { data: null, error: options.errorReturn };
        }
        return { data: { id: 'msg_12345' }, error: null };
      },
    },
  };

  return { mockClient, calls };
}

describe('Phase 6: Customer Enquiry API (POST /api/query/customer)', () => {
  beforeEach(() => {
    rateLimiter.reset();
    process.env.QUERY_TO_EMAIL = 'owner@homenursingservice.in';
    process.env.QUERY_FROM_EMAIL = 'enquiries@homenursingservice.in';
  });

  test('1. Valid submit sends exactly 1 email to QUERY_TO_EMAIL with correct subject and returns 200', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.1',
      },
      body: JSON.stringify({
        name: 'Anita Rao',
        phone: '9876543210',
        email: 'anita@example.com',
        message: 'My father needs a night attendant after discharge from hospital.',
        sourcePage: '/services/elderly-care',
      }),
    });

    const res = await customerHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(json, { ok: true });
    assert.strictEqual(calls.length, 1);
    assert.strictEqual(calls[0].to[0], 'owner@homenursingservice.in');
    assert.strictEqual(calls[0].from, 'enquiries@homenursingservice.in');
    assert.strictEqual(calls[0].replyTo, 'anita@example.com');
    assert.strictEqual(calls[0].subject, 'New customer enquiry – Anita Rao');
    assert.ok(calls[0].text.includes('Anita Rao'));
    assert.ok(calls[0].text.includes('9876543210'));
    assert.ok(calls[0].text.includes('/services/elderly-care'));
  });

  test('2. Honeypot website field non-empty returns silent 200 and sends ZERO emails', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.2',
      },
      body: JSON.stringify({
        name: 'Bot Spammer',
        phone: '9876543210',
        email: 'spammer@bot.com',
        message: 'Buy cheap medicine here now',
        website: 'http://spam-link.example.com',
      }),
    });

    const res = await customerHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(json, { ok: true });
    assert.strictEqual(calls.length, 0, 'Zero emails must be sent on honeypot trigger');
  });

  test('3. Invalid phone number returns 400 with fields.phone', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.3',
      },
      body: JSON.stringify({
        name: 'Anita Rao',
        phone: '12345', // invalid: not a 10-digit Indian mobile number
        message: 'Looking for a reliable home nurse in Indiranagar.',
      }),
    });

    const res = await customerHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
    assert.ok(json.error.fields?.phone, 'Expected field error on phone');
    assert.strictEqual(calls.length, 0);
  });

  test('4. Missing message returns 400 with fields.message', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.4',
      },
      body: JSON.stringify({
        name: 'Anita Rao',
        phone: '9876543210',
        message: 'Too short', // < 10 characters
      }),
    });

    const res = await customerHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
    assert.ok(json.error.fields?.message, 'Expected field error on message');
    assert.strictEqual(calls.length, 0);
  });

  test('5. Rate limit exceeded (6th request within an hour) returns 429 RATE_LIMITED', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const ip = '192.168.1.100';

    // Submit 5 valid requests (allowed limit: 5/hour)
    for (let i = 1; i <= 5; i++) {
      const req = new Request('http://localhost/api/query/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': ip,
        },
        body: JSON.stringify({
          name: `Enquirer ${i}`,
          phone: '9876543210',
          message: `Need bedside attendant service enquiry number ${i}.`,
        }),
      });
      const res = await customerHandler(req);
      assert.strictEqual(res.status, 200, `Request ${i} should be allowed`);
    }

    assert.strictEqual(calls.length, 5);

    // 6th request from the same IP must be rejected with 429
    const req6 = new Request('http://localhost/api/query/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify({
        name: 'Enquirer 6',
        phone: '9876543210',
        message: 'Need bedside attendant service enquiry number 6.',
      }),
    });
    const res6 = await customerHandler(req6);
    const json6 = await res6.json();

    assert.strictEqual(res6.status, 429);
    assert.strictEqual(json6.error.code, 'RATE_LIMITED');
    assert.ok(res6.headers.get('Retry-After'), 'Expected Retry-After header');
    assert.strictEqual(calls.length, 5, '6th request must not send email');
  });

  test('6. Name containing \\r\\n has linebreaks stripped from the subject line', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.6',
      },
      body: JSON.stringify({
        name: 'Anita\r\nRao\nMaliciousHeader: injection',
        phone: '9876543210',
        message: 'Testing subject line carriage return sanitization.',
      }),
    });

    const res = await customerHandler(req);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(calls.length, 1);
    assert.ok(!calls[0].subject.includes('\r'), 'Subject must not contain \\r');
    assert.ok(!calls[0].subject.includes('\n'), 'Subject must not contain \\n');
    assert.strictEqual(
      calls[0].subject,
      'New customer enquiry – Anita Rao MaliciousHeader: injection'
    );
  });

  test('7. Resend returns { error } yields 502 MAIL_FAILED', async () => {
    const { mockClient } = createMockResend({
      errorReturn: { message: 'Domain unverified or quota exceeded' },
    });
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.7',
      },
      body: JSON.stringify({
        name: 'Anita Rao',
        phone: '9876543210',
        message: 'Looking for a home attendant for recovery.',
      }),
    });

    const res = await customerHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 502);
    assert.strictEqual(json.error.code, 'MAIL_FAILED');
  });

  test('8. Resend throws a network error yields 502 MAIL_FAILED', async () => {
    const { mockClient } = createMockResend({
      throwError: new Error('ETIMEDOUT: Connection to api.resend.com timed out'),
    });
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.8',
      },
      body: JSON.stringify({
        name: 'Anita Rao',
        phone: '9876543210',
        message: 'Looking for a home attendant for recovery.',
      }),
    });

    const res = await customerHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 502);
    assert.strictEqual(json.error.code, 'MAIL_FAILED');
  });

  test('9. Body size > 10 KB returns 413 PAYLOAD_TOO_LARGE', async () => {
    const req = new Request('http://localhost/api/query/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.9',
      },
      body: JSON.stringify({
        name: 'Anita Rao',
        phone: '9876543210',
        message: 'A'.repeat(12000), // > 10 KB
      }),
    });

    const res = await customerHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 413);
    assert.strictEqual(json.error.code, 'PAYLOAD_TOO_LARGE');
  });
});

describe('Phase 6: Job Applicant API (POST /api/query/applicant)', () => {
  beforeEach(() => {
    rateLimiter.reset();
    process.env.QUERY_TO_EMAIL = 'owner@homenursingservice.in';
    process.env.APPLICANT_TO_EMAIL = 'careers@homenursingservice.in';
    process.env.QUERY_FROM_EMAIL = 'enquiries@homenursingservice.in';
  });

  test('1. Valid applicant submit sends email to APPLICANT_TO_EMAIL with role label in subject and returns 200', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/applicant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '20.0.0.1',
      },
      body: JSON.stringify({
        name: 'Ravi Kumar',
        phone: '9123456780',
        email: 'ravi@example.com',
        role: 'bedside-attendant',
      }),
    });

    const res = await applicantHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(json, { ok: true });
    assert.strictEqual(calls.length, 1);
    assert.strictEqual(calls[0].to[0], 'careers@homenursingservice.in');
    assert.strictEqual(calls[0].from, 'enquiries@homenursingservice.in');
    assert.strictEqual(calls[0].replyTo, 'ravi@example.com');
    assert.strictEqual(
      calls[0].subject,
      'New job application – Bedside attendant – Ravi Kumar'
    );
    assert.ok(calls[0].text.includes('Bedside attendant'));
    assert.ok(calls[0].text.includes('Ravi Kumar'));
    assert.ok(calls[0].text.includes('9123456780'));
  });

  test('2. Honeypot website field returns silent 200 and sends ZERO emails', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/applicant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '20.0.0.2',
      },
      body: JSON.stringify({
        name: 'Bot Applicant',
        phone: '9123456780',
        email: 'bot@example.com',
        role: 'nurse',
        website: 'bot-site-url',
      }),
    });

    const res = await applicantHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(json, { ok: true });
    assert.strictEqual(calls.length, 0);
  });

  test('3. Invalid phone number returns 400 with fields.phone', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/applicant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '20.0.0.3',
      },
      body: JSON.stringify({
        name: 'Ravi Kumar',
        phone: '0000000000', // invalid Indian mobile prefix
        email: 'ravi@example.com',
        role: 'nurse',
      }),
    });

    const res = await applicantHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
    assert.ok(json.error.fields?.phone);
    assert.strictEqual(calls.length, 0);
  });

  test('4. Missing or invalid role returns 400 with fields.role', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/applicant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '20.0.0.4',
      },
      body: JSON.stringify({
        name: 'Ravi Kumar',
        phone: '9123456780',
        email: 'ravi@example.com',
        role: 'astronaut', // invalid role
      }),
    });

    const res = await applicantHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
    assert.ok(json.error.fields?.role);
    assert.strictEqual(calls.length, 0);
  });

  test('5. Rate limit exceeded (4th applicant from same IP within an hour) returns 429', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const ip = '192.168.1.200';

    // Submit 3 valid applications (allowed limit: 3/hour)
    for (let i = 1; i <= 3; i++) {
      const req = new Request('http://localhost/api/query/applicant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': ip,
        },
        body: JSON.stringify({
          name: `Applicant ${i}`,
          phone: '9123456780',
          email: `applicant${i}@example.com`,
          role: 'bedside-attendant',
        }),
      });
      const res = await applicantHandler(req);
      assert.strictEqual(res.status, 200, `Applicant ${i} should succeed`);
    }

    assert.strictEqual(calls.length, 3);

    // 4th submission from the same IP must be 429
    const req4 = new Request('http://localhost/api/query/applicant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify({
        name: 'Applicant 4',
        phone: '9123456780',
        email: 'applicant4@example.com',
        role: 'bedside-attendant',
      }),
    });
    const res4 = await applicantHandler(req4);
    const json4 = await res4.json();

    assert.strictEqual(res4.status, 429);
    assert.strictEqual(json4.error.code, 'RATE_LIMITED');
    assert.ok(res4.headers.get('Retry-After'));
    assert.strictEqual(calls.length, 3, '4th applicant must not send email');
  });

  test('6. Name containing \\r\\n has linebreaks stripped from the subject line', async () => {
    const { mockClient, calls } = createMockResend();
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/applicant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '20.0.0.6',
      },
      body: JSON.stringify({
        name: 'Ravi\r\nKumar\nCc: attacker@example.com',
        phone: '9123456780',
        email: 'ravi@example.com',
        role: 'nurse',
      }),
    });

    const res = await applicantHandler(req);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(calls.length, 1);
    assert.ok(!calls[0].subject.includes('\r'));
    assert.ok(!calls[0].subject.includes('\n'));
    assert.strictEqual(
      calls[0].subject,
      'New job application – Nurse – Ravi Kumar Cc: attacker@example.com'
    );
  });

  test('7. Resend returns { error } yields 502 MAIL_FAILED', async () => {
    const { mockClient } = createMockResend({
      errorReturn: { message: 'Failed to deliver' },
    });
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/applicant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '20.0.0.7',
      },
      body: JSON.stringify({
        name: 'Ravi Kumar',
        phone: '9123456780',
        email: 'ravi@example.com',
        role: 'nurse',
      }),
    });

    const res = await applicantHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 502);
    assert.strictEqual(json.error.code, 'MAIL_FAILED');
  });

  test('8. Resend throws network error yields 502 MAIL_FAILED', async () => {
    const { mockClient } = createMockResend({
      throwError: new Error('DNS failure'),
    });
    setResendClientForTesting(mockClient);

    const req = new Request('http://localhost/api/query/applicant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '20.0.0.8',
      },
      body: JSON.stringify({
        name: 'Ravi Kumar',
        phone: '9123456780',
        email: 'ravi@example.com',
        role: 'nurse',
      }),
    });

    const res = await applicantHandler(req);
    const json = await res.json();

    assert.strictEqual(res.status, 502);
    assert.strictEqual(json.error.code, 'MAIL_FAILED');
  });
});

describe('Phase 6: Hard Constraints & Zero Database Persistence Audit', () => {
  test('Prove zero DB/mongoose/mongodb imports or writes in app/api/query/*', () => {
    const customerRouteContent = fs.readFileSync(
      path.resolve(process.cwd(), 'app/api/query/customer/route.ts'),
      'utf8'
    );
    const applicantRouteContent = fs.readFileSync(
      path.resolve(process.cwd(), 'app/api/query/applicant/route.ts'),
      'utf8'
    );

    const forbiddenTerms = [
      'mongoose',
      'mongodb',
      'database',
      'prisma',
      'sqlite',
      'connectToDb',
      '.save(',
      '.create(',
      '.insertOne(',
      'fs.writeFile',
      'fs.appendFile',
    ];

    for (const term of forbiddenTerms) {
      assert.strictEqual(
        customerRouteContent.includes(`import ${term}`) ||
          customerRouteContent.includes(`from '${term}'`) ||
          customerRouteContent.includes(`from "${term}"`) ||
          customerRouteContent.includes(term + '('),
        false,
        `Customer route must not contain database operation: ${term}`
      );

      assert.strictEqual(
        applicantRouteContent.includes(`import ${term}`) ||
          applicantRouteContent.includes(`from '${term}'`) ||
          applicantRouteContent.includes(`from "${term}"`) ||
          applicantRouteContent.includes(term + '('),
        false,
        `Applicant route must not contain database operation: ${term}`
      );
    }
  });
});
