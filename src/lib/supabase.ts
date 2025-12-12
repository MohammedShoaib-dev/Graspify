/**
 * Supabase Client Configuration
 * 
 * Initializes and exports the Supabase client for use throughout the application.
 * Uses environment variables from .env file for configuration.
 * 
 * To use this client:
 * ```ts
 * import { supabase } from '@/lib/supabase'
 * ```
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY'
  );
}

/**
 * Supabase client instance
 * Use this to interact with Supabase services (Auth, Database, Storage, etc.)
 * 
 * @example
 * // Authentication
 * const { data, error } = await supabase.auth.signUp({ email, password });
 * 
 * @example
 * // Database queries
 * const { data, error } = await supabase.from('users').select('*');
 * 
 * @example
 * // Storage
 * const { data, error } = await supabase.storage.from('avatars').upload('file.jpg', file);
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

