/**
 * Vercel serverless proxy — Binance API CORS engelini aşar.
 * Query parametrelerini (symbols vb.) iletir.
 */
export default async function handler(req, res) {
  const segments = req.query.path;
  const pathStr = Array.isArray(segments) ? segments.join('/') : segments || '';

  if (!pathStr) {
    return res.status(400).json({ error: 'Geçersiz Binance proxy yolu' });
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  }

  const qs = params.toString();
  const target = `https://api.binance.com/api/${pathStr}${qs ? `?${qs}` : ''}`;

  try {
    const response = await fetch(target, {
      headers: { Accept: 'application/json' },
    });

    const text = await response.text();
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(text);
  } catch (error) {
    res.status(502).json({
      error: 'Binance proxy bağlantı hatası',
      detail: error instanceof Error ? error.message : 'unknown',
    });
  }
}

export const config = {
  maxDuration: 30,
};
