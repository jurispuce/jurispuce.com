#!/usr/bin/env node
/**
 * Send emails to course participants.
 *
 * Usage:
 *   npm run send-email -- <course-slug> <template> [options]
 *
 * Arguments:
 *   course-slug             Which course's participants to email (e.g. "is-auditor")
 *   template                Email template name: "welcome", "welcome-lv", or "course-update"
 *
 * Options:
 *   --dry-run               Preview recipients and rendered email without sending
 *   --to a@x.com,b@y.com    Send to an explicit list of addresses (comma-separated).
 *                           Replaces the Supabase-derived list. Addresses not enrolled
 *                           are warned but still sent to.
 *   --emails-file <path>    Read recipients from a newline-delimited file. Blank lines
 *                           and lines starting with "#" are ignored. Replaces the
 *                           Supabase-derived list (unioned with --to if both given).
 *   --since <ISO-date>      Only include enrolled users whose granted_at >= the given
 *                           date. Ignored if --to or --emails-file is also set.
 *
 * Examples:
 *   npm run send-email -- is-auditor welcome --dry-run
 *   npm run send-email -- is-auditor welcome --to your@email.com
 *   npm run send-email -- is-auditor welcome --to a@x.com,b@y.com
 *   npm run send-email -- is-auditor welcome --emails-file ./batch.txt --dry-run
 *   npm run send-email -- is-auditor welcome --since 2026-05-01 --dry-run
 *   npm run send-email -- is-auditor course-update
 *
 * Prerequisites:
 *   - GMAIL_USER and GMAIL_APP_PASSWORD set in .env
 *   - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in .env
 */

import { readFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import yaml from 'js-yaml';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SUBJECT_MAP = {
  welcome: 'Welcome to {{course_title}}',
  'welcome-lv': 'Laipni aicināti kursā {{course_title}}',
  'course-update': 'Update: {{course_title}} — new materials available',
};

const SITE_URL = process.env.SITE_URL || 'https://jurispuce.com';

function die(msg) {
  console.error(`\nError: ${msg}\n`);
  process.exit(1);
}

// --- Parse arguments ---
const args = process.argv.slice(2);
const slug = args[0];
const templateName = args[1];
const dryRun = args.includes('--dry-run');

function flagValue(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const toArg = flagValue('--to');
const emailsFileArg = flagValue('--emails-file');
const sinceArg = flagValue('--since');

if (!slug || !templateName) {
  die('Missing arguments.\n  Usage: npm run send-email -- <course-slug> <template> [--dry-run] [--to a@x.com,b@y.com] [--emails-file path] [--since ISO-date]');
}

let sinceIso = null;
if (sinceArg) {
  const d = new Date(sinceArg);
  if (Number.isNaN(d.getTime())) die(`Invalid --since value "${sinceArg}". Expected an ISO date like 2026-05-01.`);
  sinceIso = d.toISOString();
}

function parseEmailList(raw) {
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

async function readEmailsFile(path) {
  const abs = resolve(path);
  const content = await readFile(abs, 'utf8').catch(() => {
    die(`Emails file not found or unreadable: ${abs}`);
  });
  return content
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('#'))
    .map((s) => s.toLowerCase());
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  die(`Invalid slug "${slug}". Use lowercase letters, digits, and hyphens only.`);
}
if (!SUBJECT_MAP[templateName]) {
  die(`Unknown template "${templateName}". Available: ${Object.keys(SUBJECT_MAP).join(', ')}`);
}

// --- Check env vars ---
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_FROM } = process.env;
if (!SUPABASE_URL) die('SUPABASE_URL is not set in .env');
if (!SUPABASE_SERVICE_ROLE_KEY) die('SUPABASE_SERVICE_ROLE_KEY is not set in .env');
if (!dryRun && !GMAIL_USER) die('GMAIL_USER is not set in .env');
if (!dryRun && !GMAIL_APP_PASSWORD) die('GMAIL_APP_PASSWORD is not set in .env');

// --- Read course metadata ---
const coursePath = join(REPO_ROOT, 'content', 'courses', `${slug}.md`);
const courseContent = await readFile(coursePath, 'utf8').catch(() => {
  die(`Course file not found: ${coursePath}`);
});

const frontMatterMatch = courseContent.match(/^---\n([\s\S]*?)\n---/);
if (!frontMatterMatch) die(`Could not parse frontmatter from ${coursePath}`);
const courseMeta = yaml.load(frontMatterMatch[1]);
const courseTitle = courseMeta.title;
const courseUrl = `${SITE_URL}/courses/${slug}/`;

// --- Read email template ---
const templatePath = join(REPO_ROOT, 'email-templates', `${templateName}.html`);
const templateHtml = await readFile(templatePath, 'utf8').catch(() => {
  die(`Template not found: ${templatePath}`);
});

// --- Query participants from Supabase ---
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let query = supabase
  .from('course_access')
  .select('email, granted_at')
  .eq('course_slug', slug);

const explicitListUsed = Boolean(toArg || emailsFileArg);
if (sinceIso && !explicitListUsed) query = query.gte('granted_at', sinceIso);

const { data: participants, error: queryError } = await query;
if (queryError) die(`Supabase query failed: ${queryError.message}`);

const enrolledEmails = (participants || []).map((p) => p.email.toLowerCase());
const enrolledSet = new Set(enrolledEmails);

let recipients;
if (explicitListUsed) {
  if (sinceIso) {
    console.log('Note: --since is ignored because --to/--emails-file was provided.');
  }
  const fromTo = toArg ? parseEmailList(toArg) : [];
  const fromFile = emailsFileArg ? await readEmailsFile(emailsFileArg) : [];
  recipients = Array.from(new Set([...fromTo, ...fromFile]));
  if (recipients.length === 0) die('No recipients resolved from --to / --emails-file.');
  for (const email of recipients) {
    if (!enrolledSet.has(email)) {
      console.log(`Note: ${email} is not enrolled in "${slug}", but sending anyway (override).`);
    }
  }
} else {
  if (enrolledEmails.length === 0) {
    die(sinceIso
      ? `No participants found for course "${slug}" with granted_at >= ${sinceIso}.`
      : `No participants found for course "${slug}".`);
  }
  recipients = Array.from(new Set(enrolledEmails));
}

// --- Render template ---
function render(template, email) {
  return template
    .replace(/\{\{course_title\}\}/g, courseTitle)
    .replace(/\{\{course_url\}\}/g, courseUrl)
    .replace(/\{\{recipient_email\}\}/g, email);
}

const subjectTemplate = SUBJECT_MAP[templateName];

console.log(`\nCourse:     ${courseTitle}`);
console.log(`Template:   ${templateName}`);
console.log(`Recipients: ${recipients.length}`);
console.log(`Dry run:    ${dryRun}\n`);

if (dryRun) {
  console.log('--- Recipients ---');
  recipients.forEach((email) => console.log(`  ${email}`));
  console.log('\n--- Preview (first recipient) ---');
  console.log(`Subject: ${render(subjectTemplate, recipients[0])}`);
  console.log(render(templateHtml, recipients[0]));
  console.log('\nDry run complete. No emails sent.');
  process.exit(0);
}

// --- Send emails ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

const from = EMAIL_FROM || GMAIL_USER;
let sent = 0;
let failed = 0;

for (const email of recipients) {
  const subject = render(subjectTemplate, email);
  const html = render(templateHtml, email);

  try {
    await transporter.sendMail({ from, to: email, subject, html });
    console.log(`  ✓ ${email}`);
    sent++;
  } catch (err) {
    console.error(`  ✗ ${email}: ${err.message}`);
    failed++;
  }
}

console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
if (failed > 0) process.exit(1);
