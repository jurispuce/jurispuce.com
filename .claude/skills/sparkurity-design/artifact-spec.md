# Sparkurity artifact spec — v1

Every LMS artifact (lesson, exercise, quiz, flashcards, deck, handout) is one self-contained HTML file that the LMS can index and other artifacts can reference.

## 1. Identity

```
spk.<kind>.<course-slug>.<artifact-slug>[@<semver>]
```

- `kind` — `lesson | exercise | quiz | card | deck | video | handout | certificate | email | social` (matches `.spk-kind[data-kind]`)
- Optional `"format"` in the JSON for fixed-size artifacts: `a4`, `a4-landscape`, `email-600`, `1080x1080`, `1584x396`.
- `course-slug` — same slug as `course-source/<slug>/` and `content/courses/<slug>.md`
- `artifact-slug` — kebab-case, stable forever. Rename the title, never the slug.
- `@semver` — optional on references. Omit to mean "latest"; pin (`@1.2.0`) when a deck quotes exact wording.
- Courses themselves: `spk.course.<course-slug>`.

## 2. Header (required in `<head>`)

```html
<meta charset="UTF-8">
<meta name="spk:id" content="spk.lesson.risk-management-en.what-risk-is">
<meta name="spk:version" content="1.2.0">
<script type="application/json" id="spk-artifact">
{
  "id": "spk.lesson.risk-management-en.what-risk-is",
  "kind": "lesson",
  "version": "1.2.0",
  "title": "What risk really is — and isn't",
  "course": "risk-management-en",
  "block": "01_foundations",
  "sequence": "1.1",
  "lang": "en",
  "duration": "12 min",
  "updated": "2026-10-02",
  "references": ["spk.card.risk-management-en.glossary"],
  "standards": ["ISO 31000"]
}
</script>
<link rel="stylesheet" href="https://jurispuce.com/sparkurity/styles.css">
```

`upload-course.js` can read `#spk-artifact` instead of (or to validate) the `meta.yaml` entry.

## 3. Visible header

Show the ID once, in the artifact header, with `.spk-artifact-meta`:

```html
<div class="spk-artifact-meta"><span class="spk-kind" data-kind="lesson">lesson</span><code>spk.lesson.…</code><span>v1.2.0</span></div>
```

## 4. Referencing other artifacts

- Link: `<a href="spk://spk.quiz.risk-management-en.risk-or-issue">`. The LMS viewer intercepts `spk://` and opens the target in the split-screen viewer.
- Card/tile: `data-spk-ref="spk.course.risk-management-en"` on any element.
- Also list every reference in the JSON `references` array so the LMS can build "used in" / backlinks.

## 5. Reporting results (quizzes, exercises)

```js
parent.postMessage({ type: 'spk:result', id, score, total, pass }, '*');
```

## 6. Languages (EN primary, LV second)

- Language lives in the course slug, so each translation has its own ID: `spk.lesson.risk-management-en.what-risk-is` ↔ `spk.lesson.risk-management-lv.what-risk-is`. Keep the artifact slug identical (English) across languages.
- Set `<html lang="lv">`, `"lang": "lv"` and `"translationOf": "<en id>"` in the JSON so the LMS can offer a language switch.
- Translate all visible copy including kind labels (nodarbība, vingrinājums, tests, kartītes, prezentācija). Keep IDs, standard names and case-study org names unchanged.
- Latvian runs ~15–20% longer: never use `nowrap` on titles or buttons; test headings at 30px mobile size.
- Dates: `2026. gada 2. okt.`; quotes „…”.

## 7. Fixed-format artifacts

- **Print (cheat sheet, worksheet, certificate):** one `.page` at exact A4 mm size, `@page { size: A4; margin: 0 }`, `print-color-adjust: exact`. Body text ≥ 9pt. ID in the footer.
- **Email:** tables + inline styles only; Georgia / Arial / Courier New fallbacks for Fraunces / Inter / Mono; logo as live text (no SVG); hex values, no CSS variables. Merge fields as `{{snake_case}}`.
- **Social:** fixed pixel canvas; petrol + spark glow; one statement in Fraunces. LinkedIn banner keeps the left 400px clear for the avatar.

## 8. Versioning

- Patch (1.2.x): typo, styling. Minor (1.x.0): new section or question. Major: learning goal changed — references pinned to the old major keep the old file.
