/**
 * Centralized database utility module that exports all database operations
 * FOR CLIENT-SIDE USE ONLY
 */

// Re-export all user profile operations
export * from './user-profiles';

// Re-export all template operations
export * from './templates';

// Re-export all generated text operations
export * from './generated-texts';

// Re-export types
export type { 
  UserProfile,
  UserPreferences,
  Template,
  GeneratedText
} from './supabase';

// Re-export Supabase client (client-side only)
export { supabase } from './supabase';
// Do not export supabaseAdmin as it should only be used server-side 