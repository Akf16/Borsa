import { Header } from './components/Header';
import { AssetSelector } from './components/AssetSelector';
import { LivePriceCard } from './components/LivePriceCard';
import { AISignalCard } from './components/AISignalCard';
import { IndicatorGrid } from './components/IndicatorGrid';
import { MarketWatchTable } from './components/MarketWatchTable';
import { MajorCoinsPanel } from './components/MajorCoinsPanel';
import { useMarketData } from './hooks/useMarketData';

function App() {
  const {
    selectedSnapshot,
    selectedPairId,
    setSelectedPairId,
    connectionStatus,
    lastFetchTime,
    pollIntervalSeconds,
    fullPollIntervalSeconds,
    supabaseConfigured,
    fetchError,
    majorCoins,
    allCryptoSnapshots,
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
        fullPollIntervalSeconds={fullPollIntervalSeconds}
        supabaseConfigured={supabaseConfigured}
        fetchError={fetchError}
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

        <div className="space-y-5">
          <MarketWatchTable snapshots={allCryptoSnapshots} />
          <MajorCoinsPanel coins={majorCoins} />
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-text-muted">
        Global Yapay Zeka Al-Sat Sinyal & Piyasa Takip Dashboard · Binance API · 2sn / 20sn güncelleme
      </footer>
    </div>
  );
}

export default App;
