import { createClient } from '@supabase/supabase-js';

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables');
}

// Create a Supabase client using environment variables (client-side safe)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types for user data in Supabase
export type UserProfile = {
  id: string;
  clerk_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  subscription_status?: string;
  subscription_tier?: string;
  created_at?: string;
  updated_at?: string;
};

// Types for user preferences in Supabase
export type UserPreferences = {
  id: string;
  user_id: string;
  theme?: 'light' | 'dark' | 'system';
  notifications_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Types for templates in Supabase
export type Template = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content: string;
  category?: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
};

// Types for generated texts in Supabase
export type GeneratedText = {
  id: string;
  user_id: string;
  template_id?: string;
  title: string;
  content: string;
  prompt?: string;
  generation_settings?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}; 