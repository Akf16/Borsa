import { Header } from './components/Header';
import { AssetSelector } from './components/AssetSelector';
import { LivePriceCard } from './components/LivePriceCard';
import { AISignalCard } from './components/AISignalCard';
import { IndicatorGrid } from './components/IndicatorGrid';
import { MarketWatchTable } from './components/MarketWatchTable';
import { useMarketData } from './hooks/useMarketData';

function App() {
  const {
    snapshots,
    selectedSnapshot,
    selectedPairId,
    setSelectedPairId,
    connectionStatus,
    lastFetchTime,
    pollIntervalSeconds,
    supabaseConfigured,
    allPairs,
  } = useMarketData();

  if (!selectedSnapshot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <p className="text-text-secondary">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header
        connectionStatus={connectionStatus}
        lastFetchTime={lastFetchTime}
        pollIntervalSeconds={pollIntervalSeconds}
        supabaseConfigured={supabaseConfigured}
      />

      <AssetSelector
        pairs={allPairs}
        selectedId={selectedPairId}
        onSelect={setSelectedPairId}
      />

      <main className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <LivePriceCard snapshot={selectedSnapshot} />
          <AISignalCard snapshot={selectedSnapshot} />
        </div>

        <IndicatorGrid indicators={selectedSnapshot.indicators} />

        <MarketWatchTable
          snapshots={snapshots}
          selectedId={selectedPairId}
          onSelect={setSelectedPairId}
        />
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-text-muted">
        Global Yapay Zeka Al-Sat Sinyal & Piyasa Takip Dashboard · Binance API · 15 saniyede bir güncellenir
      </footer>
    </div>
  );
}

export default App;
