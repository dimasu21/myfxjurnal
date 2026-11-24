export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/%5ENDX?interval=1m&range=1d',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream error' });
    }

    const data = await response.json();
    const meta = data?.chart?.result?.[0]?.meta;

    if (!meta?.regularMarketPrice) {
      return res.status(502).json({ error: 'No market price available' });
    }

    const price = Number(meta.regularMarketPrice);
    const prevClose = Number(meta.chartPreviousClose || meta.previousClose || price);
    const change = prevClose > 0 ? Number((((price - prevClose) / prevClose) * 100).toFixed(2)) : 0;

    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    return res.status(200).json({
      symbol: 'NAS100',
      price,
      prevClose,
      change,
      high: Number(meta.regularMarketDayHigh || price),
      low: Number(meta.regularMarketDayLow || price),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch NASDAQ 100 price' });
  }
}
