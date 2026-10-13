import { put } from '@vercel/blob';
import { apiHeaders, isAuthed } from '../lib/auth.js';

const TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };
const MAX_BYTES = 4 * 1024 * 1024;

// Body: { dataUrl: "data:image/...;base64,...", name?: "hint" } → { url }
export default async function handler(req, res) {
  apiHeaders(res);
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!isAuthed(req)) return res.status(401).json({ error: 'login required' });

  const m = /^data:([\w/+.-]+);base64,(.+)$/s.exec((req.body && req.body.dataUrl) || '');
  const ext = m && TYPES[m[1]];
  if (!ext) return res.status(400).json({ error: 'unsupported image' });
  const bytes = Buffer.from(m[2], 'base64');
  if (bytes.length > MAX_BYTES) return res.status(413).json({ error: 'image too large' });

  const hint = String((req.body && req.body.name) || 'image').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'image';
  const blob = await put(`images/${hint}.${ext}`, bytes, { access: 'public', contentType: m[1], addRandomSuffix: true });
  return res.status(200).json({ url: blob.url });
}
