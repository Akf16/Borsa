export interface MajorCoin {
  id: string;
  symbol: string;
  name: string;
  label: string;
  binanceSymbol: string;
  icon: string;
  decimals: number;
}

export const MAJOR_COINS: MajorCoin[] = [
  { id: 'eth', symbol: 'ETH/USDT', name: 'Ethereum', label: 'Ethereum (ETH/USDT)', binanceSymbol: 'ETHUSDT', icon: '⟠', decimals: 2 },
  { id: 'bnb', symbol: 'BNB/USDT', name: 'BNB', label: 'BNB (BNB/USDT)', binanceSymbol: 'BNBUSDT', icon: '🔶', decimals: 2 },
  { id: 'sol', symbol: 'SOL/USDT', name: 'Solana', label: 'Solana (SOL/USDT)', binanceSymbol: 'SOLUSDT', icon: '◎', decimals: 2 },
  { id: 'xrp', symbol: 'XRP/USDT', name: 'Ripple', label: 'Ripple (XRP/USDT)', binanceSymbol: 'XRPUSDT', icon: '✕', decimals: 4 },
  { id: 'ada', symbol: 'ADA/USDT', name: 'Cardano', label: 'Cardano (ADA/USDT)', binanceSymbol: 'ADAUSDT', icon: '₳', decimals: 4 },
  { id: 'doge', symbol: 'DOGE/USDT', name: 'Dogecoin', label: 'Dogecoin (DOGE/USDT)', binanceSymbol: 'DOGEUSDT', icon: 'Ð', decimals: 4 },
  { id: 'avax', symbol: 'AVAX/USDT', name: 'Avalanche', label: 'Avalanche (AVAX/USDT)', binanceSymbol: 'AVAXUSDT', icon: '🔺', decimals: 2 },
  { id: 'dot', symbol: 'DOT/USDT', name: 'Polkadot', label: 'Polkadot (DOT/USDT)', binanceSymbol: 'DOTUSDT', icon: '●', decimals: 3 },
  { id: 'link', symbol: 'LINK/USDT', name: 'Chainlink', label: 'Chainlink (LINK/USDT)', binanceSymbol: 'LINKUSDT', icon: '⬡', decimals: 2 },
  { id: 'ltc', symbol: 'LTC/USDT', name: 'Litecoin', label: 'Litecoin (LTC/USDT)', binanceSymbol: 'LTCUSDT', icon: 'Ł', decimals: 2 },
  { id: 'trx', symbol: 'TRX/USDT', name: 'TRON', label: 'TRON (TRX/USDT)', binanceSymbol: 'TRXUSDT', icon: '⚡', decimals: 4 },
  { id: 'shib', symbol: 'SHIB/USDT', name: 'Shiba Inu', label: 'Shiba Inu (SHIB/USDT)', binanceSymbol: 'SHIBUSDT', icon: '🐕', decimals: 6 },
  { id: 'pol', symbol: 'POL/USDT', name: 'Polygon', label: 'Polygon (POL/USDT)', binanceSymbol: 'POLUSDT', icon: '⬡', decimals: 4 },
];

export const MAJOR_COIN_BINANCE_SYMBOLS = MAJOR_COINS.map((c) => c.binanceSymbol);

export const MAJOR_COIN_BASE_PRICES: Record<string, number> = {
  eth: 3400,
  bnb: 620,
  sol: 180,
  xrp: 0.52,
  ada: 0.45,
  doge: 0.12,
  avax: 35,
  dot: 7,
  link: 14,
  ltc: 85,
  trx: 0.12,
  shib: 0.000015,
  pol: 0.45,
};
