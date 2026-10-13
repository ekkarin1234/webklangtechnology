import { apiHeaders, checkPassword, issueToken, passwordConfigured } from '../lib/auth.js';

export default async function handler(req, res) {
  apiHeaders(res);
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!passwordConfigured()) return res.status(500).json({ error: 'ADMIN_PASSWORD is not set in Vercel' });
  if (!checkPassword(req.body && req.body.password)) {
    await new Promise(r => setTimeout(r, 600)); // slow down password guessing
    return res.status(401).json({ error: 'wrong password' });
  }
  return res.status(200).json({ token: issueToken() });
}
