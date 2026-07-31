import { Activity, BarChart3, TrendingUp, Layers } from 'lucide-react';
import type { Indicators } from '../types';
import {
  getRSILabel,
  getMACDLabel,
  getSMALabel,
  getVolumeLabel,
} from '../utils/formatters';

interface IndicatorGridProps {
  indicators: Indicators;
}

export function IndicatorGrid({ indicators }: IndicatorGridProps) {
  return (
    <div className="animate-fade-in rounded-2xl border border-border bg-bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Activity size={20} className="text-accent-blue" />
        <h3 className="font-semibold text-text-primary">Canlı İndikatör Analizi</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <IndicatorCard
          icon={<Layers size={18} />}
          title="SMA Kesişimi"
          value={getSMALabel(indicators.smaCross)}
          status={indicators.smaCross}
          statusMap={{
            golden: { color: 'text-accent-green', bg: 'bg-accent-green/10' },
            death: { color: 'text-accent-red', bg: 'bg-accent-red/10' },
            none: { color: 'text-text-secondary', bg: 'bg-bg-elevated' },
          }}
        />

        <IndicatorCard
          icon={<Activity size={18} />}
          title="RSI (14) Durumu"
          value={getRSILabel(indicators.rsiStatus)}
          subtitle={`RSI: ${indicators.rsi}`}
          status={indicators.rsiStatus}
          statusMap={{
            overbought: { color: 'text-accent-red', bg: 'bg-accent-red/10' },
            oversold: { color: 'text-accent-green', bg: 'bg-accent-green/10' },
            neutral: { color: 'text-text-secondary', bg: 'bg-bg-elevated' },
          }}
        />

        <IndicatorCard
          icon={<TrendingUp size={18} />}
          title="MACD Trendi"
          value={getMACDLabel(indicators.macdTrend)}
          status={indicators.macdTrend}
          statusMap={{
            bullish: { color: 'text-accent-green', bg: 'bg-accent-green/10' },
            bearish: { color: 'text-accent-red', bg: 'bg-accent-red/10' },
            neutral: { color: 'text-text-secondary', bg: 'bg-bg-elevated' },
          }}
        />

        <IndicatorCard
          icon={<BarChart3 size={18} />}
          title="Hacim & Alım Baskısı"
          value={getVolumeLabel(indicators.volumePressure)}
          status={indicators.volumePressure}
          statusMap={{
            buy: { color: 'text-accent-green', bg: 'bg-accent-green/10' },
            sell: { color: 'text-accent-red', bg: 'bg-accent-red/10' },
            neutral: { color: 'text-text-secondary', bg: 'bg-bg-elevated' },
          }}
        />
      </div>
    </div>
  );
}

function IndicatorCard<T extends string>({
  icon,
  title,
  value,
  subtitle,
  status,
  statusMap,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  status: T;
  statusMap: Record<T, { color: string; bg: string }>;
}) {
  const { color, bg } = statusMap[status];

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4 transition-colors hover:border-border-hover">
      <div className="mb-3 flex items-center gap-2 text-text-secondary">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold ${color} ${bg}`}>
        {value}
      </div>
      {subtitle && (
        <p className="mt-2 font-mono text-xs text-text-muted">{subtitle}</p>
      )}
    </div>
  );
}
