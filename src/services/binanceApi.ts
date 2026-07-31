export interface BinanceTicker24hr {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
}

export const BINANCE_TICKER_SYMBOLS = [
  'BTCUSDT',
  'BTCJPY',
  'EURUSDT',
  'USDTTRY',
  'GBPUSDT',
  'PAXGUSDT',
] as const;

export const BINANCE_POLL_INTERVAL_MS = 15_000;

const BINANCE_API = 'https://api.binance.com/api/v3/ticker/24hr';

export async function fetchBinanceTickers(): Promise<Map<string, BinanceTicker24hr>> {
  const symbols = JSON.stringify([...BINANCE_TICKER_SYMBOLS]);
  const response = await fetch(`${BINANCE_API}?symbols=${encodeURIComponent(symbols)}`);

  if (!response.ok) {
    throw new Error(`Binance API hatası: ${response.status}`);
  }

  const tickers: BinanceTicker24hr[] = await response.json();
  return new Map(tickers.map((ticker) => [ticker.symbol, ticker]));
}

export function parseTicker(ticker: BinanceTicker24hr) {
  return {
    price: parseFloat(ticker.lastPrice),
    change24h: parseFloat(ticker.priceChangePercent),
    high24h: parseFloat(ticker.highPrice),
    low24h: parseFloat(ticker.lowPrice),
    volume: parseFloat(ticker.volume),
  };
}
