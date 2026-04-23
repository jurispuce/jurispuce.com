#!/usr/bin/env node
/**
 * Send emails to course participants.
 *
 * Usage:
 *   npm run send-email -- <course-slug> <template> [--dry-run] [--to email@example.com]
 *
 * Arguments:
 *   course-slug   Which course's participants to email (e.g. "is-auditor")
 *   template      Email template name: "welcome" or "course-update"
 *
 * Options:
 *   --dry-run     Preview recipients and rendered email without sending
 *   --to <email>  Send to a single address only (for testing)
 *
 * Examples:
 *   npm run send-email -- is-auditor welcome --dry-run
 *   npm run send-email -- is-auditor welcome --to your@email.com
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
const toIndex = args.indexOf('--to');
const singleRecipient = toIndex !== -1 ? args[toIndex + 1] : null;

if (!slug || !templateName) {
  die('Missing arguments.\n  Usage: npm run send-email -- <course-slug> <template> [--dry-run] [--to email]');
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

const { data: participants, error: queryError } = await supabase
  .from('course_access')
  .select('email')
  .eq('course_slug', slug);

if (queryError) die(`Supabase query failed: ${queryError.message}`);
if (!participants || participants.length === 0) die(`No participants found for course "${slug}".`);

let recipients = participants.map((p) => p.email);
if (singleRecipient) {
  if (!recipients.includes(singleRecipient)) {
    console.log(`Note: ${singleRecipient} is not enrolled in "${slug}", but sending anyway (--to override).`);
  }
  recipients = [singleRecipient];
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
