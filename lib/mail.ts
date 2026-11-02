/**
 * lib/mail.ts
 *
 * The ONLY file in the repository that imports the Resend SDK.
 * Exposes sendCustomerEnquiry and sendApplicantApplication.
 *
 * HARD RULES (build-prompt §3 & api.md §1.3):
 * 1. RESEND_API_KEY is server-only (never NEXT_PUBLIC_).
 * 2. resend.emails.send returns { data, error } and does not throw on API errors;
 *    we check error and throw an exception to yield HTTP 502 MAIL_FAILED.
 * 3. Never log the request payload or error details containing personal data.
 *    Only log: { form, status, timestamp }.
 * 4. All user inputs are HTML-escaped before insertion into email templates.
 * 5. \r and \n are strictly stripped from names before inclusion in the subject line.
 */

import { Resend } from 'resend';
import { ROLE_LABEL, type RoleValue } from '@/content/roles';

// Lazy initialize so tests can mock or run without env var
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY || 're_mock_key';
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

/** Test helper to inject mock Resend client */
export function setResendClientForTesting(client: unknown | null) {
  resendClient = client as Resend | null;
}

/** HTML-escape user-supplied string to prevent email HTML injection */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Strips carriage returns and newlines to prevent email subject / header injection */
export function sanitizeSubjectLine(str: string): string {
  return str.replace(/[\r\n]+/g, ' ').trim();
}

/** Returns formatted current time in Indian Standard Time (IST) */
function getIstTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium',
  }) + ' (IST)';
}

/* ─── 1. Customer Enquiry Mailer ─────────────────────────────────────────── */

export interface CustomerEnquiryMailPayload {
  name: string;
  phone: string;
  email?: string;
  message: string;
  sourcePage?: string;
}

export async function sendCustomerEnquiry(payload: CustomerEnquiryMailPayload): Promise<void> {
  const resend = getResendClient();
  const toEmail = process.env.QUERY_TO_EMAIL || 'owner@homenursingservice.in';
  const fromEmail = process.env.QUERY_FROM_EMAIL || 'enquiries@homenursingservice.in';
  const cleanName = sanitizeSubjectLine(payload.name);
  const subject = `New customer enquiry – ${cleanName}`;
  const timestamp = getIstTimestamp();

  const safeName = escapeHtml(payload.name);
  const safePhone = escapeHtml(payload.phone);
  const safeEmail = payload.email ? escapeHtml(payload.email) : 'Not provided';
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br />');
  const safeSource = payload.sourcePage ? escapeHtml(payload.sourcePage) : '/';

  const textBody = [
    `NEW CUSTOMER ENQUIRY`,
    `----------------------------------------`,
    `Name:        ${payload.name}`,
    `Phone:       ${payload.phone}`,
    `Email:       ${payload.email || 'Not provided'}`,
    `Source Page: ${payload.sourcePage || '/'}`,
    `Received:    ${timestamp}`,
    `----------------------------------------`,
    `Requirement:`,
    payload.message,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F1A1D; line-height: 1.6; max-width: 600px; padding: 20px; border: 1px solid #ECE4E8; border-radius: 8px;">
      <h2 style="color: #A31758; margin-top: 0; margin-bottom: 16px;">New Customer Enquiry</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600; width: 130px; color: #6A5A62;">Name:</td>
          <td style="padding: 8px 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6A5A62;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:${safePhone}" style="color: #185E96; text-decoration: none; font-weight: 600;">${safePhone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6A5A62;">Email:</td>
          <td style="padding: 8px 0;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6A5A62;">Source Page:</td>
          <td style="padding: 8px 0;"><code>${safeSource}</code></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6A5A62;">Received (IST):</td>
          <td style="padding: 8px 0; font-size: 13px; color: #6A5A62;">${timestamp}</td>
        </tr>
      </table>
      <div style="background-color: #FBF8F9; border-left: 4px solid #A31758; padding: 14px; border-radius: 4px;">
        <p style="margin: 0; font-weight: 600; font-size: 13px; color: #6A5A62; margin-bottom: 6px;">Care Requirement / Message:</p>
        <p style="margin: 0; white-space: pre-wrap; font-size: 15px;">${safeMessage}</p>
      </div>
      <p style="font-size: 12px; color: #6A5A62; margin-top: 24px; margin-bottom: 0;">This enquiry was submitted on homenursingservice.in and is not stored in a public database.</p>
    </div>
  `;
  
  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: payload.email || undefined,
      subject,
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      // Non-sensitive logging only
      console.error(JSON.stringify({ form: 'customer', status: 'error', timestamp: new Date().toISOString() }));
      throw new Error(`MAIL_FAILED: ${error.message || 'Resend API error'}`);
    }

    console.log(JSON.stringify({ form: 'customer', status: 'success', timestamp: new Date().toISOString() }));
  } catch (err) {
    console.error(JSON.stringify({ form: 'customer', status: 'error', timestamp: new Date().toISOString() }));
    throw err;
  }
}

/* ─── 2. Job Application Mailer ──────────────────────────────────────────── */

export interface ApplicantApplicationMailPayload {
  name: string;
  phone: string;
  email: string;
  role: RoleValue;
}

export async function sendApplicantApplication(payload: ApplicantApplicationMailPayload): Promise<void> {
  const resend = getResendClient();
  const toEmail = process.env.APPLICANT_TO_EMAIL || process.env.QUERY_TO_EMAIL || 'owner@homenursingservice.in';
  const fromEmail = process.env.QUERY_FROM_EMAIL || 'enquiries@homenursingservice.in';

  const roleLabel = ROLE_LABEL[payload.role] || payload.role;
  const cleanName = sanitizeSubjectLine(payload.name);
  const subject = `New job application – ${roleLabel} – ${cleanName}`;
  const timestamp = getIstTimestamp();

  const safeName = escapeHtml(payload.name);
  const safePhone = escapeHtml(payload.phone);
  const safeEmail = escapeHtml(payload.email);
  const safeRole = escapeHtml(roleLabel);

  const textBody = [
    `NEW JOB APPLICATION`,
    `----------------------------------------`,
    `Role:        ${roleLabel}`,
    `Name:        ${payload.name}`,
    `Phone:       ${payload.phone}`,
    `Email:       ${payload.email}`,
    `Received:    ${timestamp}`,
    `----------------------------------------`,
    `Reply to this email to contact the applicant directly for verification documents.`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F1A1D; line-height: 1.6; max-width: 600px; padding: 20px; border: 1px solid #ECE4E8; border-radius: 8px;">
      <h2 style="color: #185E96; margin-top: 0; margin-bottom: 16px;">New Job Application</h2>
      <div style="background-color: #EAF2F9; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; font-weight: 600; color: #124A76;">
        Applied Role: ${safeRole}
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; font-weight: 600; width: 130px; color: #6A5A62;">Full Name:</td>
          <td style="padding: 8px 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6A5A62;">Phone Number:</td>
          <td style="padding: 8px 0;"><a href="tel:${safePhone}" style="color: #185E96; text-decoration: none; font-weight: 600;">${safePhone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6A5A62;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #185E96; text-decoration: none;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 600; color: #6A5A62;">Received (IST):</td>
          <td style="padding: 8px 0; font-size: 13px; color: #6A5A62;">${timestamp}</td>
        </tr>
      </table>
      <p style="font-size: 13px; color: #1F1A1D; background: #FBF8F9; padding: 12px; border-radius: 6px; margin: 0 0 16px 0;">
        <strong>Next step:</strong> Reply directly to this email to contact the applicant and request identity proof, nursing/caretaker certificates, and references.
      </p>
      <p style="font-size: 12px; color: #6A5A62; margin: 0;">This application was submitted on homenursingservice.in/careers and is not stored in a public database.</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: payload.email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      console.error(JSON.stringify({ form: 'applicant', status: 'error', timestamp: new Date().toISOString() }));
      throw new Error(`MAIL_FAILED: ${error.message || 'Resend API error'}`);
    }

    console.log(JSON.stringify({ form: 'applicant', status: 'success', timestamp: new Date().toISOString() }));
  } catch (err) {
    console.error(JSON.stringify({ form: 'applicant', status: 'error', timestamp: new Date().toISOString() }));
    throw err;
  }
}
