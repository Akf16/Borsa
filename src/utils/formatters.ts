import type { TradingPair, SignalDirection, RSIStatus, MACDTrend, SMACross, VolumePressure } from '../types';

export function formatCryptoPrice(price: number, decimals: number): string {
  const formatted = price.toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${formatted} USDT`;
}

export function formatPrice(price: number, pair: TradingPair): string {
  const formatted = price.toLocaleString('tr-TR', {
    minimumFractionDigits: pair.decimals,
    maximumFractionDigits: pair.decimals,
  });

  switch (pair.currency) {
    case 'TRY':
      return `${formatted} ₺`;
    case 'USD':
      return pair.marketType === 'metal' ? `${formatted} $` : formatted;
    case 'EUR':
      return `${formatted} €`;
    case 'JPY':
      return `${formatted} ¥`;
    case 'USDT':
      return `${formatted} USDT`;
    default:
      return formatted;
  }
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

export function formatConfidence(confidence: number): string {
  return `%${confidence} YZ Güveni`;
}

export function getSignalLabel(direction: SignalDirection): string {
  switch (direction) {
    case 'long':
      return 'AL / LONG 🚀';
    case 'short':
      return 'SAT / SHORT 🔻';
    case 'neutral':
      return 'NÖTR ⏸️';
  }
}

export function getRSILabel(status: RSIStatus): string {
  switch (status) {
    case 'overbought':
      return 'Aşırı Alım';
    case 'oversold':
      return 'Aşırı Satım';
    case 'neutral':
      return 'Nötr';
  }
}

export function getMACDLabel(trend: MACDTrend): string {
  switch (trend) {
    case 'bullish':
      return 'Yükseliş Eğilimi';
    case 'bearish':
      return 'Düşüş Eğilimi';
    case 'neutral':
      return 'Yatay';
  }
}

export function getSMALabel(cross: SMACross): string {
  switch (cross) {
    case 'golden':
      return 'Altın Kesişim';
    case 'death':
      return 'Ölüm Kesişimi';
    case 'none':
      return 'Kesişim Yok';
  }
}

export function getVolumeLabel(pressure: VolumePressure): string {
  switch (pressure) {
    case 'buy':
      return 'Yüksek Alım';
    case 'sell':
      return 'Yüksek Satım';
    case 'neutral':
      return 'Dengeli';
  }
}

export function getMarketTypeIcon(marketType: TradingPair['marketType']): string {
  switch (marketType) {
    case 'crypto':
      return '₿';
    case 'forex':
      return '💱';
    case 'metal':
      return '🥇';
  }
}
