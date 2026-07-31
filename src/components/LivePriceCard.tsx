import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { MarketSnapshot } from '../types';
import { formatPrice, formatChange } from '../utils/formatters';

interface LivePriceCardProps {
  snapshot: MarketSnapshot;
}

export function LivePriceCard({ snapshot }: LivePriceCardProps) {
  const { pair, price } = snapshot;
  const isPositive = price.change24h >= 0;

  const marketTagColors = {
    crypto: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
    forex: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
    metal: 'bg-accent-gold/15 text-accent-gold border-accent-gold/30',
  };

  return (
    <div className="animate-fade-in rounded-2xl border border-border bg-bg-card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary">Piyasa Özeti</p>
          <h2 className="mt-1 text-xl font-bold text-text-primary sm:text-2xl">
            {pair.symbol}
          </h2>
        </div>
        <span
          className={`rounded-lg border px-3 py-1 text-xs font-semibold ${marketTagColors[pair.marketType]}`}
        >
          {pair.marketTag}
          {pair.leverage && ` · ${pair.leverage}`}
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-xs text-text-muted">Anlık Fiyat</p>
          <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {formatPrice(price.price, pair)}
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${
            isPositive ? 'bg-accent-green/15 text-accent-green' : 'bg-accent-red/15 text-accent-red'
          }`}
        >
          {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          <span className="font-mono text-sm font-semibold">
            {formatChange(price.change24h)}
          </span>
          <span className="text-xs opacity-80">24s</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox
          label="En Yüksek"
          value={formatPrice(price.high24h, pair)}
          icon={<ArrowUp size={14} className="text-accent-green" />}
        />
        <StatBox
          label="En Düşük"
          value={formatPrice(price.low24h, pair)}
          icon={<ArrowDown size={14} className="text-accent-red" />}
        />
        {price.volume !== undefined && (
          <StatBox
            label="24s Hacim"
            value={`${(price.volume / 1000).toFixed(1)}K`}
            icon={<TrendingUp size={14} className="text-accent-blue" />}
          />
        )}
        <StatBox
          label="Son Güncelleme"
          value={price.lastUpdate.toLocaleTimeString('tr-TR')}
          icon={null}
        />
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-3">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-xs text-text-muted">{label}</p>
      </div>
      <p className="mt-1 font-mono text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}
