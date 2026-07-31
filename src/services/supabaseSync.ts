import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { MarketSnapshot } from '../types';

export async function saveSnapshotsToSupabase(
  snapshots: Record<string, MarketSnapshot>,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase yapılandırılmamış' };
  }

  const rows = Object.values(snapshots).map((snap) => ({
    pair_id: snap.pair.id,
    symbol: snap.pair.symbol,
    price: snap.price.price,
    change_24h: snap.price.change24h,
    high_24h: snap.price.high24h,
    low_24h: snap.price.low24h,
    volume: snap.price.volume ?? null,
    signal_direction: snap.signal.direction,
    signal_confidence: snap.signal.confidence,
    entry_price: snap.signal.entryPrice,
    stop_loss: snap.signal.stopLoss,
    take_profit_1: snap.signal.takeProfit1,
    take_profit_2: snap.signal.takeProfit2,
  }));

  const { error } = await supabase.from('market_snapshots').insert(rows);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function fetchLatestSnapshots(limit = 50) {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('market_snapshots')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}
