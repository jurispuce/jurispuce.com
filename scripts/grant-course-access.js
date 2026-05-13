#!/usr/bin/env node
/**
 * Grant access to a private course by inserting rows into course_access.
 *
 * Usage:
 *   npm run grant-access -- <course-slug> <email> [<email> ...]
 *
 * Example:
 *   npm run grant-access -- ai-use-case-management-en alice@x.com bob@y.com
 *
 * Prerequisites (in .env):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const [slug, ...emails] = process.argv.slice(2);
if (!slug || emails.length === 0) {
  console.error('Usage: npm run grant-access -- <course-slug> <email> [<email> ...]');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const rows = emails.map((e) => ({ email: e.toLowerCase(), course_slug: slug }));

const { data, error } = await supabase
  .from('course_access')
  .upsert(rows, { onConflict: 'email,course_slug', ignoreDuplicates: false })
  .select('email, course_slug, granted_at');

if (error) {
  console.error(`Insert failed: ${error.message}`);
  process.exit(1);
}

console.log(`Granted access to "${slug}" for ${data.length} email(s):`);
data.forEach((r) => console.log(`  ✓ ${r.email}  (granted_at: ${r.granted_at})`));
