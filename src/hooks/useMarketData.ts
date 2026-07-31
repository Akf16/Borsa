import { useState, useEffect, useCallback, useRef } from 'react';
import { TRADING_PAIRS, BASE_PRICES, TROY_OZ_TO_GRAM } from '../data/pairs';
import { MAJOR_COINS, MAJOR_COIN_BASE_PRICES } from '../data/majorCoins';
import type { MarketSnapshot, MajorCoinSnapshot, ConnectionStatus, PriceData } from '../types';
import { generateIndicators, generateSignal } from '../utils/signalEngine';
import {
  fetchAllTickers24hr,
  parseTicker,
  BINANCE_POLL_INTERVAL_MS,
  type BinanceTicker24hr,
} from '../services/binanceApi';
import { getVerifiedUsdtSymbols, buildAllCryptoSnapshots } from '../services/binanceCoins';
import { saveSnapshotsToSupabase } from '../services/supabaseSync';
import { isSupabaseConfigured } from '../lib/supabase';

interface RawPriceEntry {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume?: number;
}

function buildSnapshot(
  pairId: string,
  data: RawPriceEntry,
  seed = Date.now(),
): MarketSnapshot {
  const pair = TRADING_PAIRS.find((p) => p.id === pairId)!;
  const priceData: PriceData = {
    price: data.price,
    change24h: data.change24h,
    high24h: data.high24h,
    low24h: data.low24h,
    volume: data.volume,
    lastUpdate: new Date(),
  };
  const indicators = generateIndicators(data.price, data.change24h, seed);
  const signal = generateSignal(data.price, data.change24h, indicators);

  return { pair, price: priceData, signal, indicators };
}

function getTicker(
  tickers: Map<string, BinanceTicker24hr>,
  symbol: string,
): RawPriceEntry | null {
  const ticker = tickers.get(symbol);
  if (!ticker) return null;
  return parseTicker(ticker);
}

function combineChange(a: number, b: number): number {
  return ((1 + a / 100) * (1 + b / 100) - 1) * 100;
}

function mapBinanceToPairs(tickers: Map<string, BinanceTicker24hr>): Record<string, RawPriceEntry> {
  const btc = getTicker(tickers, 'BTCUSDT');
  const btcJpy = getTicker(tickers, 'BTCJPY');
  const eur = getTicker(tickers, 'EURUSDT');
  const usdtTry = getTicker(tickers, 'USDTTRY');
  const gbp = getTicker(tickers, 'GBPUSDT');
  const paxg = getTicker(tickers, 'PAXGUSDT');

  const result: Record<string, RawPriceEntry> = {};

  if (btc) result['btc-usdt'] = btc;
  if (eur) result['eur-usd'] = eur;
  if (usdtTry) result['usd-try'] = usdtTry;
  if (gbp) result['gbp-usd'] = gbp;
  if (paxg) result['xau-usd'] = paxg;

  if (eur && usdtTry) {
    result['eur-try'] = {
      price: eur.price * usdtTry.price,
      change24h: combineChange(eur.change24h, usdtTry.change24h),
      high24h: eur.high24h * usdtTry.high24h,
      low24h: eur.low24h * usdtTry.low24h,
    };
  }

  if (btc && btcJpy) {
    result['usd-jpy'] = {
      price: btcJpy.price / btc.price,
      change24h: btcJpy.change24h - btc.change24h,
      high24h: btcJpy.high24h / btc.low24h,
      low24h: btcJpy.low24h / btc.high24h,
    };
  }

  if (paxg && eur) {
    result['xau-eur'] = {
      price: paxg.price / eur.price,
      change24h: paxg.change24h - eur.change24h,
      high24h: paxg.high24h / eur.low24h,
      low24h: paxg.low24h / eur.high24h,
    };
  }

  if (paxg && usdtTry) {
    result['gram-tl'] = {
      price: (paxg.price / TROY_OZ_TO_GRAM) * usdtTry.price,
      change24h: combineChange(paxg.change24h, usdtTry.change24h),
      high24h: (paxg.high24h / TROY_OZ_TO_GRAM) * usdtTry.high24h,
      low24h: (paxg.low24h / TROY_OZ_TO_GRAM) * usdtTry.low24h,
    };
  }

  return result;
}

function mapBinanceToMajorCoins(tickers: Map<string, BinanceTicker24hr>): MajorCoinSnapshot[] {
  return MAJOR_COINS.map((coin) => {
    const ticker = tickers.get(coin.binanceSymbol);
    const base = MAJOR_COIN_BASE_PRICES[coin.id];

    const data = ticker
      ? parseTicker(ticker)
      : {
          price: base,
          change24h: 0,
          high24h: base * 1.01,
          low24h: base * 0.99,
          volume: undefined,
        };

    return {
      coin: {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        label: coin.label,
        icon: coin.icon,
        decimals: coin.decimals,
      },
      price: {
        price: data.price,
        change24h: data.change24h,
        high24h: data.high24h,
        low24h: data.low24h,
        volume: data.volume,
        lastUpdate: new Date(),
      },
    };
  });
}

export function useMarketData() {
  const [snapshots, setSnapshots] = useState<Record<string, MarketSnapshot>>(() => {
    const initial: Record<string, MarketSnapshot> = {};
    TRADING_PAIRS.forEach((pair) => {
      initial[pair.id] = buildSnapshot(pair.id, {
        price: BASE_PRICES[pair.id],
        change24h: 0,
        high24h: BASE_PRICES[pair.id] * 1.01,
        low24h: BASE_PRICES[pair.id] * 0.99,
      });
    });
    return initial;
  });

  const [allCryptoSnapshots, setAllCryptoSnapshots] = useState<MarketSnapshot[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [selectedPairId, setSelectedPairId] = useState('btc-usdt');
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [majorCoins, setMajorCoins] = useState<MajorCoinSnapshot[]>(() =>
    MAJOR_COINS.map((coin) => ({
      coin: {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        label: coin.label,
        icon: coin.icon,
        decimals: coin.decimals,
      },
      price: {
        price: MAJOR_COIN_BASE_PRICES[coin.id],
        change24h: 0,
        high24h: MAJOR_COIN_BASE_PRICES[coin.id] * 1.01,
        low24h: MAJOR_COIN_BASE_PRICES[coin.id] * 0.99,
        lastUpdate: new Date(),
      },
    })),
  );
  const isFetchingRef = useRef(false);

  const refreshFromBinance = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setConnectionStatus('analyzing');

    try {
      const [tickers, usdtSymbols] = await Promise.all([
        fetchAllTickers24hr(),
        getVerifiedUsdtSymbols(),
      ]);

      const mapped = mapBinanceToPairs(tickers);
      const coins = mapBinanceToMajorCoins(tickers);
      const allCrypto = buildAllCryptoSnapshots(usdtSymbols, tickers);

      setMajorCoins(coins);
      setAllCryptoSnapshots(allCrypto);

      const next: Record<string, MarketSnapshot> = {};
      TRADING_PAIRS.forEach((pair) => {
        const data = mapped[pair.id];
        if (data) {
          next[pair.id] = buildSnapshot(pair.id, data, Date.now() + pair.id.length);
        }
      });

      let merged: Record<string, MarketSnapshot> = {};
      setSnapshots((prev) => {
        merged = { ...prev, ...next };
        return merged;
      });

      if (isSupabaseConfigured && Object.keys(next).length > 0) {
        saveSnapshotsToSupabase(merged).catch(() => {});
      }

      setLastFetchTime(new Date());
      setConnectionStatus('connected');
    } catch {
      setConnectionStatus('connected');
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshFromBinance();

    const interval = setInterval(refreshFromBinance, BINANCE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshFromBinance]);

  const selectedSnapshot = snapshots[selectedPairId];

  return {
    snapshots,
    allCryptoSnapshots,
    selectedSnapshot,
    selectedPairId,
    setSelectedPairId,
    connectionStatus,
    lastFetchTime,
    pollIntervalSeconds: BINANCE_POLL_INTERVAL_MS / 1000,
    supabaseConfigured: isSupabaseConfigured,
    majorCoins,
    allPairs: TRADING_PAIRS,
  };
}
