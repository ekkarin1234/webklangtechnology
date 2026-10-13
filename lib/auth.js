import { createHmac, timingSafeEqual } from 'node:crypto';

// Admin sessions are stateless signed tokens: "<expiry ms>.<hmac>". The secret is ADMIN_PASSWORD,
// so changing the password in Vercel signs everyone out.
const TTL_MS = 12 * 60 * 60 * 1000;

const secret = () => process.env.ADMIN_PASSWORD || '';
const sign = exp => createHmac('sha256', secret()).update(String(exp)).digest('base64url');

const sameText = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export const passwordConfigured = () => secret().length >= 6;
export const checkPassword = pw => passwordConfigured() && sameText(pw || '', secret());
export const issueToken = () => { const exp = Date.now() + TTL_MS; return `${exp}.${sign(exp)}`; };

export function isAuthed(req) {
  if (!passwordConfigured()) return false;
  const m = /^Bearer (\d+)\.([\w-]+)$/.exec(req.headers.authorization || '');
  return !!m && Number(m[1]) > Date.now() && sameText(m[2], sign(m[1]));
}

// Every API response carries this header so the browser can tell "API answered" apart from "no API here" (local preview).
export const apiHeaders = res => res.setHeader('X-KTS-API', '1');
