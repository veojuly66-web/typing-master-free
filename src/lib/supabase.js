import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Fallback dummy client if credentials aren't set yet (prevents app crashes)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => ({ error: { message: 'Supabase credentials not configured yet. See .env.example.' } }),
        signInWithOtp: async () => ({ error: { message: 'Supabase credentials not configured yet. See .env.example.' } }),
        verifyOtp: async () => ({ error: { message: 'Supabase credentials not configured yet.' } }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null })
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }), order: () => Promise.resolve({ data: [] }) }),
        insert: async () => ({ error: null }),
        upsert: async () => ({ error: null }),
        update: () => ({ eq: async () => ({ error: null }) })
      }),
      rpc: async () => ({ data: null, error: null }),
      functions: {
        invoke: async () => ({ data: null, error: { message: 'Supabase credentials not configured yet.' } })
      }
    };
