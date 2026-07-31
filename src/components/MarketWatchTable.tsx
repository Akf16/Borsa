import { Eye } from 'lucide-react';
import type { MarketSnapshot } from '../types';
import {
  formatPrice,
  formatChange,
  getSignalLabel,
  getMarketTypeIcon,
} from '../utils/formatters';

interface MarketWatchTableProps {
  snapshots: Record<string, MarketSnapshot>;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function MarketWatchTable({
  snapshots,
  selectedId,
  onSelect,
}: MarketWatchTableProps) {
  const rows = Object.values(snapshots);

  return (
    <div className="animate-fade-in rounded-2xl border border-border bg-bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Eye size={20} className="text-accent-blue" />
        <h3 className="font-semibold text-text-primary">Tüm Piyasalar İzleme</h3>
        <span className="ml-auto rounded-full bg-bg-elevated px-2.5 py-0.5 text-xs text-text-muted">
          {rows.length} parite
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
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
            {rows.map((snap) => {
              const isSelected = snap.pair.id === selectedId;
              const isPositive = snap.price.change24h >= 0;

              return (
                <tr
                  key={snap.pair.id}
                  onClick={() => onSelect(snap.pair.id)}
                  className={`cursor-pointer border-b border-border/50 transition-colors last:border-0 ${
                    isSelected
                      ? 'bg-accent-blue/8 hover:bg-accent-blue/12'
                      : 'hover:bg-bg-elevated/50'
                  }`}
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span>{getMarketTypeIcon(snap.pair.marketType)}</span>
                      <div>
                        <p className="font-medium text-text-primary">{snap.pair.shortLabel}</p>
                        <p className="text-xs text-text-muted">{snap.pair.label}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-md bg-bg-elevated px-2 py-1 text-xs text-text-secondary">
                      {snap.pair.marketTag}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-mono font-medium text-text-primary">
                    {formatPrice(snap.price.price, snap.pair)}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-mono font-medium ${
                        isPositive ? 'text-accent-green' : 'text-accent-red'
                      }`}
                    >
                      {formatChange(snap.price.change24h)}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <SignalBadge direction={snap.signal.direction} />
                  </td>
                  <td className="py-3 pr-4 font-mono text-text-secondary">
                    %{snap.signal.confidence}
                  </td>
                  <td className="py-3">
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
