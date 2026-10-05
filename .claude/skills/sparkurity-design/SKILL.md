---
name: sparkurity-design
description: Use this skill to generate well-branded interfaces and assets for Sparkurity, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping, plus the LMS artifact ID/reference spec.
user-invocable: true
---

Read readme.md and artifact-spec.md in this folder. The live stylesheet is static/sparkurity/styles.css; templates are in design-system/templates/ (tracked; copy into course-source/<slug>/ to use — course-source/ is gitignored), and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
For LMS artifacts (lessons, quizzes, flashcards, decision trees, decks, cheat sheets, worksheets, certificates, emails, LinkedIn posts/banners), start from `design-system/templates/*.html`, link `styles.css`, and follow `artifact-spec.md` (this folder) for the `spk:id` header and `spk://` references.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
