---
name: create-course-material
description: Interactively author a new course lesson HTML file (or revise an existing one) so it fits an existing course in `course-source/<slug>/`. Use when the user asks to "create a lesson", "add new course material", "make a new interactive page" for a course, or wants help styling/restructuring an HTML lesson to match the project's design system. Walks through course identification, block placement, sequence numbering, filename convention, design-token usage, and meta.yaml registration.
---

# Create Course Material

Authors a self-contained HTML lesson that drops into the existing course pipeline (`course-source/<slug>/<block-dir>/NN_filename.html`, registered in `meta.yaml`, uploaded to Supabase by `scripts/upload-course.js`).

## When to use

Trigger this skill when the user wants to:
- create a new course lesson / interactive page / HTML material
- restyle or restructure an existing lesson to match the rest of the course
- add a lesson to a specific course block

## Operating principle

**Don't generate HTML before the placement is clear.** A lesson belongs to exactly one course → one block → one sequence position. Get those locked in first; styling is mechanical once the structure is settled.

## Workflow

### 1. Identify the target course

- List existing courses: `ls course-source/`.
- If the user named a course, confirm the slug. If not, ask. Don't guess.
- Read `course-source/<slug>/meta.yaml` to load course context: title, audience (`description`), `difficulty`, `duration`, and the full `blocks:` tree.

### 2. Place the lesson in the structure

Show the user the course outline (block titles + existing lesson titles) and ask:
- Which **block** does this material belong to? (Or: does it justify a new block?)
- Where in the **sequence** within that block? (Show current order; the next prefix `NN_` is implied — files sort alphabetically by numeric prefix.)
- Confirm the **filename** in snake_case Latvian (matching neighbours), e.g. `03_zurnalfaili_laika_sinhronizacija.html`.

If the topic doesn't fit cleanly, surface that. Don't shoehorn — it's better to propose a new block (with `dir`, `title`, `summary`) than to bury an off-topic lesson inside an existing one.

### 3. Confirm the lesson scope

Before writing HTML, agree with the user on:
- **Title** (short, descriptive, Latvian — matches the language of the course)
- **Description** (one sentence, used in `meta.yaml` and shown in the catalog)
- **Learning goal** — what does the reader leave knowing or able to do?
- **Interactive element(s)** — most lessons have one: decision tree, scenario simulator, classification grid, before/after visualiser, etc. Look at neighbouring lessons in the same block for the established pattern.
- **References** — which standards/regulations to cite (ISO 27001/27005/27035/19011/22301/31000, MK 397, EU MI Akts, etc.)
- **Scenario context** — does the lesson use the recurring example orgs (MedReg, SmartCity Rīga)? Most do; consistency helps learners.

### 4. Generate the HTML

Lessons are **self-contained HTML documents** — no external CSS, no shared layout. Each file inlines its own `<style>`. They are uploaded as static objects to Supabase Storage and rendered in an iframe / split-screen viewer.

Required document shell:

```html
<!DOCTYPE html>
<html lang="lv">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ Lesson title }}</title>
<style>
  /* design tokens — see styling-reference.md */
  :root { … }
  /* lesson-specific styles, prefixed if needed */
</style>
</head>
<body>
  <div class="container">
    <header class="page-header">…</header>
    <main>…</main>
  </div>
  <script>
    // any interactive logic — vanilla JS only, no build step
  </script>
</body>
</html>
```

**Read `styling-reference.md` (sibling file)** for the full design-token palette, typography rules, and component patterns to follow.

### 5. Wire it into meta.yaml

After the file is on disk:

1. Add an entry under the chosen block's `lessons:` list in `course-source/<slug>/meta.yaml`:
   ```yaml
   - file: "NN_filename.html"
     title: "…"
     description: "…"
     kind: "lesson"
   ```
2. If introducing a new block, add a new entry under `blocks:` with `dir`, `title`, `summary`, `lessons:`.
3. Tell the user the next step:
   ```
   npm run upload-course -- <slug> --dry-run    # preview
   npm run upload-course -- <slug> --prune       # upload + clean orphans
   ```

### 6. Verify before handoff

- Open the HTML in a browser (or describe how) to confirm it renders standalone.
- Check that the design tokens match `styling-reference.md` — colors, fonts, radii, spacing scale.
- Check responsive behaviour at 768px (the mobile breakpoint used across existing lessons).
- Confirm no external dependencies beyond Google Fonts (Plus Jakarta Sans + JetBrains Mono).

## Anti-patterns

- **Don't** invent a new color palette. Reuse the existing tokens — adding colors fragments the brand.
- **Don't** pull in CSS frameworks (Tailwind, Bootstrap). Lessons are inline-only.
- **Don't** edit `content/courses/<slug>.md` by hand — it's regenerated by `upload-course.js`.
- **Don't** put files at the course root (`course-source/<slug>/foo.html`) — the new schema is blocks-only. Every lesson lives under a `<block-dir>/`.
- **Don't** skip the `NN_` numeric prefix. The script sorts lessons by filename for sequence; non-prefixed files break the order.
- **Don't** mix English and Latvian in user-visible strings unless the course is explicitly multilingual.

## References in this skill folder

- `styling-reference.md` — full design-token palette, typography, component patterns

## Project references

- `MANAGING_COURSES.md` — operational doc for the course pipeline
- `scripts/upload-course.js` — uploader (top-of-file comment block describes both meta.yaml schemas)
- `scripts/meta.example.yaml` — meta.yaml template
