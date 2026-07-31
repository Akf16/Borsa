import type {
  AISignal,
  Indicators,
  SignalDirection,
  RSIStatus,
  MACDTrend,
  SMACross,
  VolumePressure,
} from '../types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getRSIStatus(rsi: number): RSIStatus {
  if (rsi >= 70) return 'overbought';
  if (rsi <= 30) return 'oversold';
  return 'neutral';
}

export function generateIndicators(_price: number, change24h: number, seed: number): Indicators {
  const rsi = clamp(50 + change24h * 3 + Math.sin(seed) * 15, 15, 85);
  const smaCross: SMACross =
    change24h > 1.5 ? 'golden' : change24h < -1.5 ? 'death' : 'none';
  const macdTrend: MACDTrend =
    change24h > 0.3 ? 'bullish' : change24h < -0.3 ? 'bearish' : 'neutral';
  const volumePressure: VolumePressure =
    change24h > 0.5 ? 'buy' : change24h < -0.5 ? 'sell' : 'neutral';

  return {
    smaCross,
    rsi: Math.round(rsi),
    rsiStatus: getRSIStatus(rsi),
    macdTrend,
    volumePressure,
  };
}

export function generateSignal(
  price: number,
  change24h: number,
  indicators: Indicators,
): AISignal {
  let direction: SignalDirection = 'neutral';
  let confidence = 55;

  if (indicators.rsiStatus === 'oversold' && indicators.macdTrend === 'bullish') {
    direction = 'long';
    confidence = 78 + Math.round(Math.random() * 12);
  } else if (indicators.rsiStatus === 'overbought' && indicators.macdTrend === 'bearish') {
    direction = 'short';
    confidence = 75 + Math.round(Math.random() * 13);
  } else if (change24h > 0.8) {
    direction = 'long';
    confidence = 65 + Math.round(Math.random() * 15);
  } else if (change24h < -0.8) {
    direction = 'short';
    confidence = 63 + Math.round(Math.random() * 15);
  } else if (indicators.smaCross === 'golden') {
    direction = 'long';
    confidence = 72 + Math.round(Math.random() * 10);
  } else if (indicators.smaCross === 'death') {
    direction = 'short';
    confidence = 70 + Math.round(Math.random() * 10);
  }

  confidence = clamp(confidence, 55, 95);

  const pct = price * 0.015;
  const isLong = direction === 'long';
  const isShort = direction === 'short';

  return {
    direction,
    confidence,
    entryPrice: price,
    stopLoss: isLong ? price - pct : isShort ? price + pct : price - pct * 0.5,
    takeProfit1: isLong ? price + pct * 1.5 : isShort ? price - pct * 1.5 : price + pct,
    takeProfit2: isLong ? price + pct * 3 : isShort ? price - pct * 3 : price + pct * 2,
    timeframe: '4 Saat',
    statusMessage:
      direction === 'neutral'
        ? 'Mum Kapanışı Bekleniyor'
        : 'Yapay Zeka Analiz Ediyor...',
  };
}
