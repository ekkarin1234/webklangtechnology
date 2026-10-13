import { head, put, BlobNotFoundError } from '@vercel/blob';
import { apiHeaders, isAuthed } from '../lib/auth.js';

const KEY = 'content.json';
const MAX_BYTES = 1024 * 1024; // images live in their own blobs, so the content itself stays small

export default async function handler(req, res) {
  apiHeaders(res);

  if (req.method === 'GET') {
    // errors and "empty" must never be cached, or the CDN keeps serving them after the first save
    res.setHeader('Cache-Control', 'no-store');
    try {
      const meta = await head(KEY);
      const r = await fetch(`${meta.url}?v=${new Date(meta.uploadedAt).getTime()}`, { cache: 'no-store' });
      if (!r.ok) throw new Error(`blob fetch ${r.status}`);
      // ?fresh=1 is used by the admin to see its own save immediately; visitors get a CDN-cached copy (refreshed every ~30 s).
      if (!req.query.fresh) res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=300');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).send(await r.text());
    } catch (e) {
      if (e instanceof BlobNotFoundError) return res.status(404).json({ error: 'empty' });
      console.error(e);
      return res.status(502).json({ error: 'read failed' });
    }
  }

  if (req.method === 'PUT') {
    res.setHeader('Cache-Control', 'no-store');
    if (!isAuthed(req)) return res.status(401).json({ error: 'login required' });
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'bad body' });
    const updatedAt = new Date().toISOString();
    const json = JSON.stringify({ ...body, updatedAt });
    if (Buffer.byteLength(json) > MAX_BYTES) return res.status(413).json({ error: 'content too large (upload images first)' });
    const opts = { access: 'public', contentType: 'application/json; charset=utf-8', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 };
    await put(KEY, json, opts);
    // keep every published version so a bad edit can be rolled back from the Vercel Blob dashboard
    await put(`backups/content-${updatedAt.replace(/[:.]/g, '-')}.json`, json, { ...opts, cacheControlMaxAge: undefined, allowOverwrite: false });
    return res.status(200).json({ updatedAt });
  }

  return res.status(405).json({ error: 'method' });
}
