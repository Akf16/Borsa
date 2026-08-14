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

const CHUNK_SIZE = 80;

async function fetchTickerChunk(symbols: string[]): Promise<BinanceTicker24hr[]> {
  const url = `${BINANCE_API_BASE}/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`;
  const response = await fetch(url);

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Binance ticker hatası (${response.status}): ${detail.slice(0, 120)}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Binance ticker yanıtı geçersiz');
  }

  return data;
}

export async function fetchTickersForSymbols(
  symbols: string[],
): Promise<Map<string, BinanceTicker24hr>> {
  const unique = [...new Set(symbols)];
  const result = new Map<string, BinanceTicker24hr>();

  for (let i = 0; i < unique.length; i += CHUNK_SIZE) {
    const chunk = unique.slice(i, i + CHUNK_SIZE);
    const tickers = await fetchTickerChunk(chunk);
    tickers.forEach((ticker) => result.set(ticker.symbol, ticker));
  }

  return result;
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
