import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { offlineDb } from './offline-db';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Check if we're in offline mode
const isOffline = !SUPABASE_URL || SUPABASE_URL.includes('placeholder') || SUPABASE_URL.includes('example.com');

// Create the real Supabase client
const realSupabase = createClient<Database>(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_PUBLISHABLE_KEY || 'placeholder', {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Mock Supabase implementation for offline use
const offlineSupabase = {
  ...realSupabase,
  from: (table: string) => offlineDb.from(table),
} as any;

export const supabase = isOffline ? offlineSupabase : realSupabase;