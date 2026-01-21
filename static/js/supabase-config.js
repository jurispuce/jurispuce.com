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

  // Supabase anon (public) key - MUST be the JWT format starting with "eyJ..."
  // Replace this with your actual anon key from Settings > API
  anonKey: 'YOUR_ANON_KEY_HERE',

  // Redirect URL after authentication
  redirectUrl: window.location.origin + '/training/'
};

// Export for use in other scripts
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
