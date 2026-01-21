/**
 * Supabase Configuration
 *
 * IMPORTANT: Replace these values with your actual Supabase project credentials.
 *
 * To get these values:
 * 1. Go to https://supabase.com and sign in
 * 2. Select your project (or create a new one)
 * 3. Go to Settings > API
 * 4. Copy the "Project URL" and "anon public" key
 */

const SUPABASE_CONFIG = {
  // Supabase project URL
  url: 'https://trvhrdrrhejntqzbwmpz.supabase.co',

  // Supabase anon (public) key
  anonKey: 'sb_publishable_llksuWzpoxb17JW1pRFMrA_iqlHWKVO',

  // Redirect URL after authentication (update for production)
  redirectUrl: window.location.origin + '/training/'
};

// Export for use in other scripts
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
