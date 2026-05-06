#!/usr/bin/env node
/**
 * Course material uploader.
 *
 * Usage:
 *   npm install
 *   cp .env.example .env      # then fill in SUPABASE_SERVICE_ROLE_KEY
 *   npm run upload-course -- <course-slug>
 *
 * What it does:
 *   1. Reads course-source/<slug>/meta.yaml
 *   2. Ensures the private Supabase Storage bucket exists
 *   3. Uploads every file to <bucket>/<slug>/[<block-dir>/]<file>
 *      with the correct Content-Type, upserting on re-runs
 *   4. Regenerates content/courses/<slug>.md so Hugo stays in sync
 *
 * ── Two meta.yaml formats are supported ──────────────────────────
 *
 * BLOCKS format (new, preferred):
 *   Lessons live in per-block subdirectories.  Filenames must carry a
 *   numeric prefix (e.g. 01_, 02_) so alphabetical order = sequence.
 *
 *   blocks:
 *     - dir: "01_it-systems"            # subfolder under course-source/<slug>/
 *       title: "IT Sistēmas pamati"
 *       summary: "…"
 *       lessons:
 *         - file: "01_it_sistemas_pamata.html"
 *           title: "IT sistēmas anatomija (pamata)"
 *           description: "…"
 *           kind: lesson               # default: lesson
 *           videoUrl: "https://…"      # optional YouTube embed URL
 *         - file: "02_it_sistemas_paplasinata.html"
 *           …
 *     - dir: "02_risk-management"
 *       …
 *
 *   Source layout:
 *     course-source/<slug>/
 *       meta.yaml
 *       01_it-systems/
 *         01_it_sistemas_pamata.html
 *         02_it_sistemas_paplasinata.html
 *       02_risk-management/
 *         …
 *
 *   Supabase storage layout:
 *     <bucket>/<slug>/01_it-systems/01_it_sistemas_pamata.html
 *     <bucket>/<slug>/02_risk-management/…
 *
 * LEGACY format (backwards-compatible):
 *   files:
 *     - path: filename.html
 *       title: "…"
 *       description: "…"
 *       kind: lesson
 *
 *   Source + storage: flat, no subdirectories (original behaviour).
 *
 * Source files in course-source/ are gitignored — they live locally only.
 * Only meta-derived .md pages and this script are committed.
 */

import { readFile, writeFile, mkdir, stat, readdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import yaml from 'js-yaml';
import mime from 'mime-types';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function die(msg) {
  console.error(`\nError: ${msg}\n`);
  process.exit(1);
}

function warn(msg) {
  console.warn(`  ⚠  ${msg}`);
}

// ── CLI args ─────────────────────────────────────────────────────

const slug = process.argv[2];
if (!slug) die('Missing course slug.\n  Usage: npm run upload-course -- <course-slug>');
if (!/^[a-z0-9-]+$/.test(slug)) die(`Invalid slug "${slug}". Use lowercase letters, digits, and hyphens only.`);

// ── Env ──────────────────────────────────────────────────────────

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_COURSE_BUCKET = 'course-materials' } = process.env;
if (!SUPABASE_URL) die('SUPABASE_URL is not set. Copy .env.example to .env and fill it in.');
if (!SUPABASE_SERVICE_ROLE_KEY) die('SUPABASE_SERVICE_ROLE_KEY is not set. Copy .env.example to .env and fill it in.');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// ── Read meta.yaml ────────────────────────────────────────────────

const courseDir = join(REPO_ROOT, 'course-source', slug);
const metaPath  = join(courseDir, 'meta.yaml');

const meta = await readFile(metaPath, 'utf8').then(yaml.load).catch(() => {
  die(`Could not read ${metaPath}. Create the course folder and a meta.yaml (see scripts/meta.example.yaml).`);
});

if (!meta?.title) die(`meta.yaml is missing "title".`);

// ── Resolve upload tasks from whichever format is used ───────────

const isBlocksMode = Array.isArray(meta.blocks) && meta.blocks.length > 0;
const isLegacyMode = Array.isArray(meta.files)  && meta.files.length  > 0;

if (!isBlocksMode && !isLegacyMode) {
  die('meta.yaml must define either "blocks" (new) or "files" (legacy) with at least one entry.');
}

/**
 * A task is a flat description of one file to upload + its metadata.
 *
 * Fields:
 *   localPath   – absolute path to the source file
 *   remotePath  – path inside the bucket:  <slug>/<dir?>/<file>
 *   storagePath – path relative to slug:   <dir?>/<file>   (written to generated md)
 *   blockDir    – block subfolder, or null for legacy
 *   file        – filename only
 *   title, description, kind, videoUrl – metadata from meta.yaml
 */
const tasks = [];

if (isBlocksMode) {
  console.log(`\nBlocks mode — ${meta.blocks.length} block(s) found in meta.yaml\n`);

  for (const [bIdx, block] of meta.blocks.entries()) {
    if (!block.dir) die(`Block #${bIdx + 1} is missing "dir".`);
    if (!block.title) die(`Block "${block.dir}" is missing "title".`);
    if (!Array.isArray(block.lessons) || block.lessons.length === 0) {
      die(`Block "${block.dir}" must have at least one entry under "lessons".`);
    }

    const blockLocalDir = join(courseDir, block.dir);

    // Sort lessons by filename (numeric prefix governs sequence)
    const sortedLessons = [...block.lessons].sort((a, b) =>
      (a.file || '').localeCompare(b.file || '', undefined, { numeric: true, sensitivity: 'base' })
    );

    // Warn if meta order differs from sorted order
    const metaOrder   = block.lessons.map(l => l.file).join(',');
    const sortedOrder = sortedLessons.map(l => l.file).join(',');
    if (metaOrder !== sortedOrder) {
      warn(`Block "${block.dir}": lesson order in meta.yaml differs from filename sort order. Filename order will be used.`);
    }

    // Cross-check: warn about files in the directory that aren't listed
    try {
      const dirFiles = (await readdir(blockLocalDir))
        .filter(f => /\.(html?|pdf|zip)$/i.test(f))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      const listed = new Set(sortedLessons.map(l => l.file));
      for (const f of dirFiles) {
        if (!listed.has(f)) warn(`Block "${block.dir}": file "${f}" exists in directory but is not listed in meta.yaml.`);
      }
    } catch {
      // directory might not exist yet — the stat() below will catch missing files
    }

    for (const lesson of sortedLessons) {
      if (!lesson.file) die(`A lesson in block "${block.dir}" is missing "file".`);
      const storagePath = `${block.dir}/${lesson.file}`;
      tasks.push({
        localPath:   join(blockLocalDir, lesson.file),
        remotePath:  `${slug}/${storagePath}`,
        storagePath,
        blockDir:    block.dir,
        file:        lesson.file,
        title:       lesson.title       ?? lesson.file,
        description: lesson.description ?? '',
        kind:        lesson.kind        ?? 'lesson',
        videoUrl:    lesson.videoUrl    ?? null,
      });
    }
  }
} else {
  // Legacy flat-file mode
  console.log(`\nLegacy mode — ${meta.files.length} file(s) found in meta.yaml\n`);

  for (const entry of meta.files) {
    if (!entry?.path) die(`A file entry in meta.yaml is missing "path".`);
    tasks.push({
      localPath:   join(courseDir, entry.path),
      remotePath:  `${slug}/${entry.path}`,
      storagePath: entry.path,
      blockDir:    null,
      file:        entry.path,
      title:       entry.title       ?? entry.path,
      description: entry.description ?? '',
      kind:        entry.kind        ?? 'lesson',
      videoUrl:    entry.videoUrl    ?? null,
    });
  }
}

// ── Upload ────────────────────────────────────────────────────────

await ensureBucket(SUPABASE_COURSE_BUCKET);

const uploaded = [];
for (const task of tasks) {
  const fileStat = await stat(task.localPath).catch(() =>
    die(`File not found: ${task.localPath}`)
  );
  const bytes       = await readFile(task.localPath);
  const contentType = mime.lookup(task.localPath) || 'application/octet-stream';

  const { error } = await supabase.storage
    .from(SUPABASE_COURSE_BUCKET)
    .upload(task.remotePath, bytes, { contentType, upsert: true, cacheControl: '3600' });

  if (error) die(`Upload failed for ${task.remotePath}: ${error.message}`);

  console.log(`  ✓ ${task.remotePath}  (${(fileStat.size / 1024).toFixed(1)} KB)`);
  uploaded.push({ ...task, size: fileStat.size, contentType });
}

// ── Write catalog markdown ─────────────────────────────────────────

await writeCatalog(slug, meta, uploaded, isBlocksMode);

console.log(`\nDone. Uploaded ${uploaded.length} file(s) to bucket "${SUPABASE_COURSE_BUCKET}/${slug}".`);
console.log(`Catalog written to content/courses/${slug}.md`);

// ── Helpers ───────────────────────────────────────────────────────

async function ensureBucket(name) {
  const { data, error } = await supabase.storage.getBucket(name);
  if (data) return;
  if (error && !/not found/i.test(error.message)) die(`Could not inspect bucket "${name}": ${error.message}`);
  const { error: createErr } = await supabase.storage.createBucket(name, { public: false });
  if (createErr) die(`Could not create private bucket "${name}": ${createErr.message}`);
  console.log(`Created private bucket "${name}".`);
}

async function writeCatalog(slug, meta, uploaded, blocksMode) {
  const outDir = join(REPO_ROOT, 'content', 'courses');
  await mkdir(outDir, { recursive: true });

  // Always write a flat `files` list (used by legacy layout fallback + search)
  const filesFlat = uploaded.map(f => ({
    path:        f.storagePath,
    title:       f.title,
    description: f.description,
    kind:        f.kind,
    contentType: f.contentType,
    size:        f.size,
    ...(f.videoUrl ? { videoUrl: f.videoUrl } : {}),
  }));

  const frontMatter = {
    title:       meta.title,
    description: meta.description ?? '',
    weight:      meta.weight      ?? 50,
    difficulty:  meta.difficulty  ?? null,
    duration:    meta.duration    ?? null,
    courseSlug:  slug,
    bucket:      SUPABASE_COURSE_BUCKET,
    generated:   true,
    files:       filesFlat,
  };

  // In blocks mode also write the full blocks structure so Hugo can render it
  if (blocksMode) {
    let blockSeq = 0;
    frontMatter.blocks = meta.blocks.map(block => {
      blockSeq++;

      // Sort by filename (same order used during upload)
      const sortedLessons = [...block.lessons].sort((a, b) =>
        (a.file || '').localeCompare(b.file || '', undefined, { numeric: true, sensitivity: 'base' })
      );

      let lessonSeq = 0;
      const lessons = sortedLessons.map(lesson => {
        lessonSeq++;
        const match = uploaded.find(u => u.storagePath === `${block.dir}/${lesson.file}`);
        return {
          path:        `${block.dir}/${lesson.file}`,
          file:        lesson.file,
          title:       lesson.title       ?? lesson.file,
          description: lesson.description ?? '',
          kind:        lesson.kind        ?? 'lesson',
          sequence:    lessonSeq,
          ...(lesson.videoUrl ? { videoUrl: lesson.videoUrl } : {}),
          ...(match ? { size: match.size, contentType: match.contentType } : {}),
        };
      });

      return {
        id:       block.dir,
        dir:      block.dir,
        title:    block.title,
        summary:  block.summary  ?? '',
        sequence: blockSeq,
        lessons,
      };
    });
  }

  const body = [
    '---',
    yaml.dump(frontMatter, { lineWidth: 120 }).trimEnd(),
    '---',
    '',
    '<!-- Generated by scripts/upload-course.js from course-source/' + slug + '/meta.yaml. Do not edit by hand. -->',
    ''
  ].join('\n');

  await writeFile(join(outDir, `${slug}.md`), body);
}
