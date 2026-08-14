import { BINANCE_API_BASE } from '../config/api';

export interface BinanceTicker24hr {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

export const BINANCE_MARKET_SYMBOLS = [
  'BTCUSDT',
  'BTCJPY',
  'EURUSDT',
  'USDTTRY',
  'GBPUSDT',
  'PAXGUSDT',
] as const;

export const BINANCE_POLL_INTERVAL_MS = 15_000;

export async function fetchAllTickers24hr(): Promise<Map<string, BinanceTicker24hr>> {
  const response = await fetch(`${BINANCE_API_BASE}/v3/ticker/24hr`);

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
    quoteVolume: parseFloat(ticker.quoteVolume),
  };
}
