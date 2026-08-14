export type MarketType = 'crypto' | 'forex' | 'metal';

export type SignalDirection = 'long' | 'short' | 'neutral';

export type RSIStatus = 'overbought' | 'oversold' | 'neutral';

export type MACDTrend = 'bullish' | 'bearish' | 'neutral';

export type SMACross = 'golden' | 'death' | 'none';

export type VolumePressure = 'buy' | 'sell' | 'neutral';

export type ConnectionStatus = 'connected' | 'connecting' | 'analyzing' | 'waiting' | 'error';

export interface TradingPair {
  id: string;
  symbol: string;
  label: string;
  shortLabel: string;
  marketType: MarketType;
  marketTag: string;
  leverage?: string;
  decimals: number;
  currency: string;
  binanceSymbol?: string;
  isDerived?: boolean;
}

export interface PriceData {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume?: number;
  lastUpdate: Date;
}

export interface AISignal {
  direction: SignalDirection;
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  timeframe: string;
  statusMessage: string;
}

export interface Indicators {
  smaCross: SMACross;
  rsi: number;
  rsiStatus: RSIStatus;
  macdTrend: MACDTrend;
  volumePressure: VolumePressure;
}

export interface MarketSnapshot {
  pair: TradingPair;
  price: PriceData;
  signal: AISignal;
  indicators: Indicators;
}

export interface MajorCoinSnapshot {
  coin: {
    id: string;
    symbol: string;
    name: string;
    label: string;
    icon: string;
    decimals: number;
  };
  price: PriceData;
}
