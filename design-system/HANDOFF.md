# Handoff: Sparkurity Design System → jurispuce/jurispuce.com

## Overview
This bundle adds the Sparkurity design system to the Hugo site and LMS. It includes the shared stylesheet, the logos, the templates for LMS artifacts, the artifact ID spec, and a Claude Code skill. Claude Code can then generate new course material in the new style.

The folder layout **mirrors the repo root**. Copy each folder to the same path in the repo:

```
static/sparkurity/            → served at https://jurispuce.com/sparkurity/
  styles.css                  single entry point (imports tokens + components)
  tokens/*.css, components/*.css
  assets/logo/*.svg|png
  deck-stage.js               slide-deck shell used by deck templates
course-source/_templates/     starting templates for new artifacts
.claude/skills/sparkurity-design/   SKILL.md, readme.md (brand rules), artifact-spec.md
```

## About the files
- **`static/sparkurity/**` is production code.** Ship it as-is. The CSS is plain, needs no build step, and uses only `spk-` prefixed classes and `--spk-*` / semantic custom properties. Nothing applies until you add `class="spk-doc"` to the body, so existing site styles are untouched.
- **`course-source/_templates/*.html` are working templates.** Copy one, rename it and edit the content. They link the stylesheet by absolute URL (`https://jurispuce.com/sparkurity/styles.css`). This is because lessons are served from Supabase Storage on a different origin.
- **Fidelity:** high-fidelity. Colours, type and spacing are final.

## Integration tasks for Claude Code
1. **Copy the folders** into the repo at the paths above. Commit with the message: `Add Sparkurity design system`.
2. **Update the course-material skill.** In `.claude/skills/create-course-material/SKILL.md` and `styling-reference.md`, replace the Peakdefence styling (#CC002E, Plus Jakarta Sans, warm neutrals) with these rules:
   - Every new lesson links `https://jurispuce.com/sparkurity/styles.css` and uses `spk-*` classes.
   - Start from `course-source/_templates/`.
   - Follow `.claude/skills/sparkurity-design/artifact-spec.md`.
   - Remove the "no external CSS" rule. This one stylesheet is now allowed.
3. **Artifact metadata in `scripts/upload-course.js`:**
   - When uploading, parse `<script type="application/json" id="spk-artifact">` from each HTML file.
   - Validate that `id`, `kind`, `version`, `course` and `lang` are present, and that `id` matches `spk.<kind>.<course>.<slug>`.
   - Store the result alongside the lesson row in Supabase. Suggested columns: `artifact_id text unique`, `kind`, `version`, `lang`, `translation_of`, `references text[]`.
   - Fall back to `meta.yaml` when the block is absent, so existing lessons keep working.
4. **`spk://` links in the inline viewer** (`layouts/partials/courses/inline-viewer.html` and `static/js/training-blocks.js`):
   - Listen for clicks inside the iframe, or ask templates to `postMessage({type:'spk:navigate', id})`.
   - Resolve the `id` to a lesson URL and open it in the viewer.
   - Also handle `postMessage({type:'spk:result', id, score, total, pass})` from quizzes, and write it through `static/js/progress-tracker.js`.
5. **Optional reskin of the LMS chrome.** Map `static/css/courses.css` and `training.css` onto the tokens. Use `--spk-action` for CTAs instead of `#2563eb`, `--spk-petrol` for headers, and 14px card radii. The target look is `ui_kits/lms/LMS.dc.html` in the design project (sign-in, dashboard, catalog, course, viewer, library). The dashboard and artifact library are new screens.
6. **Latvian.** Courses ending `-lv` use `<html lang="lv">`, `"lang":"lv"` and `"translationOf"`. The viewer can offer a language switch when a translation exists.

## Design tokens (summary — full list in static/sparkurity/tokens/)
- Spark `#4A95D1` (logo and accents; never body text) · Action `#2F6FA3` (links, CTAs) · Blue-800 `#25557C` · Blue-100 `#D4E6F5` · Blue-50 `#EDF4FB`
- Petrol `#2C6374` / dark `#214B58` / 100 `#C4D8D4` / 50 `#EAF1F0`
- Ink `#2B2C2E` · Body `#56575A` · Grey `#6D6E71` · Grey-200 `#CFCFD1` · Line `#E7E7E8` · Mist `#F4F4F5`
- Terracotta `#B25C43` (only warm hue: gaps, warnings, wrong answers) · Success `#2F855A` · Danger `#B42318`
- Fonts:
  - Fraunces 600, −0.01em, for headings (42/29/19/17)
  - Inter, 15px body at 1.55 line height
  - JetBrains Mono, uppercase, +0.16em, for kickers and IDs
  - All three load from Google Fonts
- Radii: 6 chip · 8 button/input · 9 inner card · 14 card · 16 marketing · pill
- Shadows: card `0 3px 9px rgba(0,0,0,.05)`, hover `0 6px 16px rgba(37,85,124,.13)`
- Focus ring: `0 0 0 3px rgba(74,149,209,.35)`

## Templates included
`lesson.html`, `lesson-lv.html`, `quiz.html`, `flashcards.html`, `decision-tree.html`, `deck.html` (16:9), `course-card.html`, `cheat-sheet.html` (A4), `worksheet.html` (A4), `certificate.html` (A4 landscape), `email.html` and `email-reminder.html` (600px, email-safe, hex only, no stylesheet), `linkedin-post.html` (1080²), `linkedin-banner.html` (1584×396).

## Notes
- The email templates intentionally do not use `styles.css`. Send them through `scripts/send-course-email.js` with `{{merge_fields}}`.
- Logo colours: spark `#4A95D1` and grey `#6D6E71`, confirmed by the owner.
