import { TrendingUp, TrendingDown, Coins } from 'lucide-react';
import type { MajorCoinSnapshot } from '../types';
import { formatCryptoPrice, formatChange } from '../utils/formatters';

interface MajorCoinsPanelProps {
  coins: MajorCoinSnapshot[];
}

export function MajorCoinsPanel({ coins }: MajorCoinsPanelProps) {
  return (
    <div className="animate-fade-in rounded-2xl border border-border bg-bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Coins size={20} className="text-accent-purple" />
        <h3 className="font-semibold text-text-primary">Kripto Varlıklar</h3>
        <span className="ml-auto rounded-full bg-accent-purple/15 px-2.5 py-0.5 text-xs font-medium text-accent-purple">
          {coins.length} coin · Binance
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-text-muted">
              <th className="pb-3 pr-4 font-medium">Coin</th>
              <th className="pb-3 pr-4 font-medium">Anlık Fiyat</th>
              <th className="pb-3 pr-4 font-medium">24s Değişim</th>
              <th className="pb-3 pr-4 font-medium">En Yüksek</th>
              <th className="pb-3 font-medium">En Düşük</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((item) => {
              const isPositive = item.price.change24h >= 0;

              return (
                <tr
                  key={item.coin.id}
                  className="border-b border-border/50 transition-colors last:border-0 hover:bg-bg-elevated/50"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-purple/10 text-sm font-bold text-accent-purple">
                        {item.coin.icon}
                      </span>
                      <div>
                        <p className="font-medium text-text-primary">{item.coin.symbol}</p>
                        <p className="text-xs text-text-muted">{item.coin.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono font-medium text-text-primary">
                    {formatCryptoPrice(item.price.price, item.coin.decimals)}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-medium ${
                        isPositive ? 'text-accent-green' : 'text-accent-red'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {formatChange(item.price.change24h)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-accent-green">
                    {formatCryptoPrice(item.price.high24h, item.coin.decimals)}
                  </td>
                  <td className="py-3 font-mono text-xs text-accent-red">
                    {formatCryptoPrice(item.price.low24h, item.coin.decimals)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
