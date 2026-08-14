/**
 * Vercel serverless proxy — Binance API CORS engelini aşar.
 */
export default async function handler(req, res) {
  const segments = req.query.path;
  const pathStr = Array.isArray(segments) ? segments.join('/') : segments || '';

  if (!pathStr) {
    return res.status(400).json({ error: 'Geçersiz Binance proxy yolu' });
  }

  const target = `https://api.binance.com/api/${pathStr}`;

  try {
    const response = await fetch(target, {
      headers: { Accept: 'application/json' },
    });

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ error: 'Binance proxy bağlantı hatası' });
  }
}
