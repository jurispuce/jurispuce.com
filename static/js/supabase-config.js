/**
 * Supabase Configuration
 *
 * IMPORTANT: The Supabase JS client requires the JWT-format "anon" key.
 *
 * To get the correct key:
 * 1. Go to https://supabase.com/dashboard and sign in
 * 2. Select your project
 * 3. Go to Settings > API
 * 4. Under "Project API keys", copy the "anon" "public" key
 *    (It should start with "eyJ..." - this is a JWT token)
 *    Do NOT use the "publishable" key (sb_publishable_...) - that's for REST API only
 */

const SUPABASE_CONFIG = {
  // Supabase project URL
  url: 'https://trvhrdrrhejntqzbwmpz.supabase.co',

  // Supabase anon (public) key
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydmhyZHJyaGVqbnRxemJ3bXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDc5NjgsImV4cCI6MjA4NDQyMzk2OH0.p3S2DhyF6Jpus646H7OzkYBCfzzboTMt1ymzw_wpS5Q',

  // Redirect URL after authentication
  redirectUrl: window.location.origin + '/training/'
};

// Export for use in other scripts
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
