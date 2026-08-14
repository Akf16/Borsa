import type { MarketSnapshot, PriceData, TradingPair } from '../types';
import type { BinanceTicker24hr } from './binanceApi';
import { parseTicker } from './binanceApi';
import { generateIndicators, generateSignal } from '../utils/signalEngine';
import { getDecimalsForPrice } from '../utils/decimals';
import { BINANCE_API_BASE } from '../config/api';

export interface BinanceSymbolInfo {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
}

const FIAT_BASES = new Set([
  'EUR', 'GBP', 'AUD', 'BRL', 'TRY', 'UAH', 'NGN', 'RUB', 'ZAR', 'PLN', 'RON',
  'ARS', 'JPY', 'CAD', 'CHF', 'CZK', 'DKK', 'HKD', 'HUF', 'IDR', 'ILS', 'MXN',
  'NOK', 'NZD', 'SEK', 'SGD', 'THB', 'VND', 'XUSD',
]);

const LEVERAGED_PATTERN = /(UP|DOWN|BULL|BEAR)$/;

let cachedUsdtSymbols: BinanceSymbolInfo[] | null = null;

export async function getVerifiedUsdtSymbols(): Promise<BinanceSymbolInfo[]> {
  if (cachedUsdtSymbols) return cachedUsdtSymbols;

  const response = await fetch(`${BINANCE_API_BASE}/v3/exchangeInfo`);
  if (!response.ok) throw new Error('Binance exchangeInfo hatası');

  const data = await response.json();

  cachedUsdtSymbols = data.symbols.filter(
    (s: BinanceSymbolInfo & { isSpotTradingAllowed?: boolean }) =>
      s.quoteAsset === 'USDT' &&
      s.status === 'TRADING' &&
      s.isSpotTradingAllowed !== false &&
      s.baseAsset !== 'USDT' &&
      !FIAT_BASES.has(s.baseAsset) &&
      !LEVERAGED_PATTERN.test(s.baseAsset),
  ) as BinanceSymbolInfo[];

  return cachedUsdtSymbols;
}

function buildCryptoPair(baseAsset: string, symbol: string, price: number): TradingPair {
  return {
    id: symbol.toLowerCase(),
    symbol: `${baseAsset}/USDT`,
    label: `${baseAsset} (${baseAsset}/USDT)`,
    shortLabel: `${baseAsset}/USDT`,
    marketType: 'crypto',
    marketTag: 'Kripto Spot · Binance ✓',
    decimals: getDecimalsForPrice(price),
    currency: 'USDT',
    binanceSymbol: symbol,
  };
}

export function buildAllCryptoSnapshots(
  symbols: BinanceSymbolInfo[],
  tickers: Map<string, BinanceTicker24hr>,
): MarketSnapshot[] {
  const snapshots: MarketSnapshot[] = [];

  for (const info of symbols) {
    const ticker = tickers.get(info.symbol);
    if (!ticker) continue;

    const data = parseTicker(ticker);
    const pair = buildCryptoPair(info.baseAsset, info.symbol, data.price);

    const priceData: PriceData = {
      price: data.price,
      change24h: data.change24h,
      high24h: data.high24h,
      low24h: data.low24h,
      volume: data.volume,
      lastUpdate: new Date(),
    };

    const seed = info.symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const indicators = generateIndicators(data.price, data.change24h, seed);
    const signal = generateSignal(data.price, data.change24h, indicators);

    snapshots.push({ pair, price: priceData, signal, indicators });
  }

  return snapshots.sort((a, b) => {
    const volA = (a.price.volume ?? 0) * a.price.price;
    const volB = (b.price.volume ?? 0) * b.price.price;
    return volB - volA;
  });
}
