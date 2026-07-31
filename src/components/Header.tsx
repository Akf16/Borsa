import { Bell, Settings, Wifi } from 'lucide-react';
import type { ConnectionStatus } from '../types';

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  lastFetchTime: Date | null;
  pollIntervalSeconds: number;
  supabaseConfigured: boolean;
}

const STATUS_MESSAGES: Record<ConnectionStatus, string> = {
  connected: 'Canlı Veri Bağlantısı Aktif',
  connecting: 'Bağlantı Kuruluyor...',
  analyzing: 'Yapay Zeka Analiz Ediyor...',
  waiting: 'Mum Kapanışı Bekleniyor',
};

export function Header({
  connectionStatus,
  lastFetchTime,
  pollIntervalSeconds,
  supabaseConfigured,
}: HeaderProps) {
  const isLive = connectionStatus === 'connected' || connectionStatus === 'analyzing';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-blue/15">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-text-primary sm:text-lg">
              Global Yapay Zeka Sinyalleri
            </h1>
            <p className="hidden text-xs text-text-muted sm:block">
              Kripto · Forex · Değerli Madenler
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-bg-card px-3 py-1.5">
            <div className="relative flex items-center gap-1.5">
              {isLive && (
                <span className="absolute -left-0.5 h-2 w-2 rounded-full bg-accent-green animate-pulse-live" />
              )}
              <Wifi
                size={14}
                className={isLive ? 'text-accent-green ml-2' : 'text-text-muted'}
              />
              <span className="text-xs font-semibold text-accent-green">CANLI</span>
            </div>
            <span className="hidden text-xs text-text-secondary lg:inline">
              {STATUS_MESSAGES[connectionStatus]}
              {lastFetchTime && <> · Binance {pollIntervalSeconds}sn</>}
              {supabaseConfigured && <> · Supabase ✓</>}
            </span>
          </div>

          <button
            type="button"
            className="rounded-lg border border-border bg-bg-card p-2 text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            aria-label="Bildirimler"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            className="rounded-lg border border-border bg-bg-card p-2 text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            aria-label="Ayarlar"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
