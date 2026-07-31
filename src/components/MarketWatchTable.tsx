import { useState, useMemo } from 'react';
import { Eye, Search } from 'lucide-react';
import type { MarketSnapshot } from '../types';
import {
  formatPrice,
  formatChange,
  getSignalLabel,
  getMarketTypeIcon,
} from '../utils/formatters';

interface MarketWatchTableProps {
  snapshots: MarketSnapshot[];
}

export function MarketWatchTable({ snapshots }: MarketWatchTableProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return snapshots;
    return snapshots.filter(
      (snap) =>
        snap.pair.shortLabel.toLowerCase().includes(q) ||
        snap.pair.label.toLowerCase().includes(q) ||
        snap.pair.id.includes(q),
    );
  }, [snapshots, search]);

  return (
    <div className="animate-fade-in rounded-2xl border border-border bg-bg-card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Eye size={20} className="text-accent-blue" />
          <h3 className="font-semibold text-text-primary">Ana Kripto Varlıklar İzleme</h3>
        </div>
        <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs text-text-muted">
          {snapshots.length} coin · Binance
        </span>
        <div className="relative ml-auto w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Coin ara... (BTC, ETH, SOL)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-secondary py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:outline-none"
          />
        </div>
      </div>

      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-bg-card">
            <tr className="border-b border-border text-xs text-text-muted">
              <th className="pb-3 pr-4 font-medium">Parite</th>
              <th className="pb-3 pr-4 font-medium">Piyasa Türü</th>
              <th className="pb-3 pr-4 font-medium">Anlık Fiyat</th>
              <th className="pb-3 pr-4 font-medium">24s Değişim</th>
              <th className="pb-3 pr-4 font-medium">Son Sinyal</th>
              <th className="pb-3 pr-4 font-medium">YZ Güveni</th>
              <th className="pb-3 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((snap) => {
              const isPositive = snap.price.change24h >= 0;

              return (
                <tr
                  key={snap.pair.id}
                  className="border-b border-border/50 transition-colors last:border-0 hover:bg-bg-elevated/50"
                >
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span>{getMarketTypeIcon(snap.pair.marketType)}</span>
                      <div>
                        <p className="font-medium text-text-primary">{snap.pair.shortLabel}</p>
                        <p className="text-xs text-text-muted">{snap.pair.label}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="rounded-md bg-accent-purple/10 px-2 py-1 text-xs text-accent-purple">
                      {snap.pair.marketTag}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 font-mono font-medium text-text-primary">
                    {formatPrice(snap.price.price, snap.pair)}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`font-mono font-medium ${
                        isPositive ? 'text-accent-green' : 'text-accent-red'
                      }`}
                    >
                      {formatChange(snap.price.change24h)}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <SignalBadge direction={snap.signal.direction} />
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-text-secondary">
                    %{snap.signal.confidence}
                  </td>
                  <td className="py-2.5">
                    <span className="text-xs text-text-muted">
                      {snap.signal.statusMessage}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-text-muted">Sonuç bulunamadı.</p>
      )}
    </div>
  );
}

function SignalBadge({ direction }: { direction: 'long' | 'short' | 'neutral' }) {
  const styles = {
    long: 'bg-accent-green/15 text-accent-green border-accent-green/30',
    short: 'bg-accent-red/15 text-accent-red border-accent-red/30',
    neutral: 'bg-bg-elevated text-text-secondary border-border',
  };

  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${styles[direction]}`}
    >
      {getSignalLabel(direction)}
    </span>
  );
}
