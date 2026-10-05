# Sparkurity design system

Imported from the Sparkurity design handoff (see `HANDOFF.md` for the original integration notes).

| What | Where |
|---|---|
| Production CSS (tokens + `spk-*` components), logos, deck shell | `static/sparkurity/` → served at `https://jurispuce.com/sparkurity/` |
| Artifact templates (lesson, quiz, flashcards, deck, certificate, email, social…) | `design-system/templates/` |
| Brand rules, artifact ID spec, Claude skill | `.claude/skills/sparkurity-design/` |

`course-source/` is gitignored, so templates live here instead of `course-source/_templates/`. Copy a template into `course-source/<slug>/…` to start a lesson.

Nothing applies to existing pages until a page links `/sparkurity/styles.css` and adds `class="spk-doc"` to `<body>`.

Not included in the handoff bundle (referenced in `readme.md` but absent): React prototype components, `guidelines/*.html` specimen cards, `ui_kits/` click-throughs.
