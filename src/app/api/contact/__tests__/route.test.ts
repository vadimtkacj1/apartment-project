import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the SMTP layer; capture the transporter so individual tests can assert
// on (or fail) verify()/sendMail(). vi.hoisted: vi.mock factories run first.
const { sendMail, verify, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn();
  const verify = vi.fn();
  return { sendMail, verify, createTransport: vi.fn(() => ({ sendMail, verify })) };
});
vi.mock('nodemailer', () => ({
  default: { createTransport },
  createTransport,
}));

import { POST } from '@/app/api/contact/route';

let ipSeed = 0;
const post = (body: unknown, ip = `192.0.2.${ipSeed++}`) =>
  POST(
    new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify(body),
    })
  );

const validBody = { name: 'Israel Israeli', phone: '050-123-4567', message: 'Hi' };

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMail.mockReset().mockResolvedValue({ messageId: 'x' });
    verify.mockReset().mockResolvedValue(true);
    createTransport.mockClear();
    vi.stubEnv('EMAIL_SERVER_HOST', 'smtp.example.com');
    vi.stubEnv('EMAIL_SERVER_PORT', '587');
    vi.stubEnv('EMAIL_SERVER_USER', 'user@example.com');
    vi.stubEnv('EMAIL_SERVER_PASSWORD', 'secret');
    vi.stubEnv('EMAIL_TO', 'to@example.com');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('sends the email and returns 200 for a valid submission', async () => {
    const res = await post(validBody);
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ message: 'Success' });
    expect(verify).toHaveBeenCalled();
    expect(sendMail).toHaveBeenCalledTimes(1);

    const mail = sendMail.mock.calls[0][0];
    expect(mail.to).toBe('to@example.com');
    expect(mail.subject).toContain('Israel Israeli');
  });

  it('rejects a name shorter than 2 characters with 400', async () => {
    const res = await post({ ...validBody, name: 'I' });
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejects a malformed phone number with 400', async () => {
    const res = await post({ ...validBody, phone: '00012' });
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('accepts an international +972 phone format', async () => {
    const res = await post({ ...validBody, phone: '+972 50 123 4567' });
    expect(res.status).toBe(200);
  });

  it('returns 500 when email env vars are not configured', async () => {
    vi.stubEnv('EMAIL_SERVER_HOST', '');
    const res = await post(validBody);
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Email service not configured' });
  });

  it('HTML-escapes user input to prevent markup injection in the email body', async () => {
    await post({ name: '<script>alert(1)</script>', phone: '0501234567', message: '<b>hi</b>' });
    const mail = sendMail.mock.calls[0][0];
    expect(mail.html).not.toContain('<script>');
    expect(mail.html).toContain('&lt;script&gt;');
    expect(mail.html).not.toContain('<b>hi</b>');
    expect(mail.html).toContain('&lt;b&gt;hi&lt;/b&gt;');
  });

  it('strips CR/LF from the email subject (header-injection guard)', async () => {
    await post({ ...validBody, name: 'Eve\r\nBcc: evil@x.com' });
    const mail = sendMail.mock.calls[0][0];
    expect(mail.subject).not.toMatch(/[\r\n]/);
  });

  it('returns 500 when SMTP verification fails', async () => {
    verify.mockRejectedValue(new Error('connect ECONNREFUSED'));
    const res = await post(validBody);
    expect(res.status).toBe(500);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('returns a generic 500 (no internal leak) when sendMail throws', async () => {
    sendMail.mockRejectedValue(new Error('smtp blew up'));
    const res = await post(validBody);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Internal Server Error');
    expect(JSON.stringify(json)).not.toContain('smtp blew up');
  });

  it('rate-limits repeated submissions from the same IP (429 + Retry-After)', async () => {
    const ip = '198.51.100.42';
    // Limit is 5 per window.
    for (let i = 0; i < 5; i++) {
      const ok = await post(validBody, ip);
      expect(ok.status).toBe(200);
    }
    const blocked = await post(validBody, ip);
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});
