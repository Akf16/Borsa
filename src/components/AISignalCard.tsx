import { Brain, Target, Shield, Crosshair, Clock, Sparkles } from 'lucide-react';
import type { MarketSnapshot } from '../types';
import { formatPrice, formatConfidence, getSignalLabel } from '../utils/formatters';

interface AISignalCardProps {
  snapshot: MarketSnapshot;
}

export function AISignalCard({ snapshot }: AISignalCardProps) {
  const { pair, signal } = snapshot;

  const directionStyles = {
    long: {
      bg: 'from-accent-green/20 to-accent-green/5',
      border: 'border-accent-green/40',
      text: 'text-accent-green',
      glow: 'shadow-accent-green/10',
    },
    short: {
      bg: 'from-accent-red/20 to-accent-red/5',
      border: 'border-accent-red/40',
      text: 'text-accent-red',
      glow: 'shadow-accent-red/10',
    },
    neutral: {
      bg: 'from-text-muted/20 to-text-muted/5',
      border: 'border-border',
      text: 'text-text-secondary',
      glow: 'shadow-none',
    },
  };

  const style = directionStyles[signal.direction];

  return (
    <div
      className={`animate-fade-in rounded-2xl border bg-gradient-to-br ${style.bg} ${style.border} p-5 shadow-lg ${style.glow} sm:p-6`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-bg-card/80 p-2">
            <Brain size={20} className="text-accent-purple" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Yapay Zeka Sinyal Kartı</h3>
            <p className="text-xs text-text-muted">{signal.statusMessage}</p>
          </div>
        </div>
        <Sparkles size={18} className="text-accent-gold animate-pulse" />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div
          className={`rounded-xl border bg-bg-card/60 px-5 py-3 font-bold ${style.text} ${style.border}`}
        >
          <p className="text-xs font-normal text-text-muted">Sinyal Durumu</p>
          <p className="mt-1 text-lg sm:text-xl">{getSignalLabel(signal.direction)}</p>
        </div>

        <div className="rounded-xl border border-border bg-bg-card/60 px-5 py-3">
          <p className="text-xs text-text-muted">Yapay Zeka Güven Skoru</p>
          <p className="mt-1 font-mono text-lg font-bold text-accent-blue">
            {formatConfidence(signal.confidence)}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-500"
              style={{ width: `${signal.confidence}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <LevelBox
          icon={<Crosshair size={16} />}
          label="Giriş Fiyatı"
          value={formatPrice(signal.entryPrice, pair)}
          color="text-accent-blue"
        />
        <LevelBox
          icon={<Shield size={16} />}
          label="Zarar Durdur (SL)"
          value={formatPrice(signal.stopLoss, pair)}
          color="text-accent-red"
        />
        <LevelBox
          icon={<Target size={16} />}
          label="Kar Al (TP1)"
          value={formatPrice(signal.takeProfit1, pair)}
          color="text-accent-green"
        />
        <LevelBox
          icon={<Target size={16} />}
          label="Kar Al (TP2)"
          value={formatPrice(signal.takeProfit2, pair)}
          color="text-accent-green"
        />
        <LevelBox
          icon={<Clock size={16} />}
          label="Zaman Dilimi"
          value={signal.timeframe}
          color="text-text-secondary"
        />
      </div>
    </div>
  );
}

function LevelBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-card/50 p-3">
      <div className={`flex items-center gap-1.5 ${color}`}>
        {icon}
        <p className="text-xs text-text-muted">{label}</p>
      </div>
      <p className="mt-1.5 font-mono text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}
