import { createClient } from '@supabase/supabase-js';
import type { UserProfile, UserPreferences } from '@/utils/supabase';

// Create an admin client with the service role key (for server-side operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Re-export the types
export type { UserProfile, UserPreferences }; 