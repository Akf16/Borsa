import type { TradingPair } from '../types';
import { getMarketTypeIcon } from '../utils/formatters';

interface AssetSelectorProps {
  pairs: TradingPair[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AssetSelector({ pairs, selectedId, onSelect }: AssetSelectorProps) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
      <div className="flex gap-2 overflow-x-auto pb-1 pt-4 scrollbar-thin">
        {pairs.map((pair) => {
          const isSelected = pair.id === selectedId;
          return (
            <button
              key={pair.id}
              type="button"
              onClick={() => onSelect(pair.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'border-accent-blue bg-accent-blue/15 text-accent-blue shadow-lg shadow-accent-blue/10'
                  : 'border-border bg-bg-card text-text-secondary hover:border-border-hover hover:bg-bg-elevated hover:text-text-primary'
              }`}
            >
              <span className="text-base">{getMarketTypeIcon(pair.marketType)}</span>
              <span className="whitespace-nowrap">{pair.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
