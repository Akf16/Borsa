export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      market_snapshots: {
        Row: {
          id: string;
          pair_id: string;
          symbol: string;
          price: number;
          change_24h: number;
          high_24h: number;
          low_24h: number;
          volume: number | null;
          signal_direction: 'long' | 'short' | 'neutral';
          signal_confidence: number;
          entry_price: number;
          stop_loss: number;
          take_profit_1: number;
          take_profit_2: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          pair_id: string;
          symbol: string;
          price: number;
          change_24h: number;
          high_24h: number;
          low_24h: number;
          volume?: number | null;
          signal_direction: 'long' | 'short' | 'neutral';
          signal_confidence: number;
          entry_price: number;
          stop_loss: number;
          take_profit_1: number;
          take_profit_2: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['market_snapshots']['Insert']>;
      };
      ai_signals: {
        Row: {
          id: string;
          pair_id: string;
          symbol: string;
          direction: 'long' | 'short' | 'neutral';
          confidence: number;
          entry_price: number;
          stop_loss: number;
          take_profit_1: number;
          take_profit_2: number;
          timeframe: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          pair_id: string;
          symbol: string;
          direction: 'long' | 'short' | 'neutral';
          confidence: number;
          entry_price: number;
          stop_loss: number;
          take_profit_1: number;
          take_profit_2: number;
          timeframe?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ai_signals']['Insert']>;
      };
    };
  };
}
