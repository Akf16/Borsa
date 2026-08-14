/** Production'da Vercel proxy, local'de doğrudan Binance API */
export const BINANCE_API_BASE = import.meta.env.PROD
  ? '/api/binance'
  : 'https://api.binance.com/api';
