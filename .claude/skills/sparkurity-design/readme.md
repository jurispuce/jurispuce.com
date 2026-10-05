# Sparkurity Design System

Sparkurity is Juris Puce's learning brand: cohort-based and self-paced training in cybersecurity and AI (ISO 27001, ISO 31000, NIS 2, DORA, EU AI Act). It's sold to practitioners and executives. Courses are delivered through an LMS built into jurispuce.com. Each lesson is a self-contained HTML file kept in Supabase Storage and shown in a split-screen viewer.

This system brings together three visual languages found in the source:
1. **Org-model artifact** (`static/security-management-structure/sparkurity-security-org-model-v2.html`). It supplies the **palette**: spark blue, petrol and terracotta. It also supplies the Fraunces / Inter / JetBrains Mono stack, chips, pills and expandable cards.
2. **Website** (`static/css/main.css`, `layouts/`). It supplies the **layout**: the 1140px container, sticky nav, Fraunces headings, 8px buttons and 16px marketing cards.
3. **Course lessons** (`.claude/skills/create-course-material/styling-reference.md`). It supplies the **component patterns**: page header, badge, card, scenario selector, decision tree, pipeline, flashcards and quiz. The Peakdefence red from the lessons is **not** carried over.

**Sources:** GitHub `jurispuce/jurispuce.com` @ `main`. The user uploaded the Sparkurity logo SVG and the icon PNG.

## Index
- `styles.css`: the single entry point. Artifacts link this one stylesheet.
- `tokens/`: `fonts.css`, `colors.css`, `typography.css`, `spacing.css`.
- `components/base.css`: opt-in document styles (`<body class="spk-doc">`).
- `components/components.css`: all `spk-*` classes.
- `components/core|forms|lms/*.jsx`: React wrappers for prototyping. Components: Button, Pill, KindTag, Chip, Kicker, Card, Input, Segmented, CourseCard, LessonRow, ProgressBar, ArtifactHeader.
- `components/lesson/`: a card for the lesson patterns (quiz option, flashcard, decision node, pipeline). These are CSS only.
- `artifacts/`: LMS-ready templates. Includes `lesson.html` (+ `lesson-lv.html`), `quiz.html`, `flashcards.html`, `decision-tree.html`, `deck.html` (16:9), `course-card.html`, and fixed formats: `cheat-sheet.html` and `worksheet.html` (A4), `certificate.html` (A4 landscape), `email.html` + `email-reminder.html` (600px, email-safe), `linkedin-post.html` (1080²) and `linkedin-banner.html` (1584×396).
- `guidelines/artifact-spec.md`: **artifact ID and reference spec.** Read this before creating artifacts.
- `guidelines/*.html`: foundation specimen cards.
- `ui_kits/lms/LMS.dc.html`: LMS click-through. Screens: sign-in, dashboard, catalog, course, viewer, library.
- `ui_kits/website/Website.dc.html`: recreation of the current jurispuce.com home page.
- `assets/logo/`: lockup (colour, white, ink), mark (colour, white), icon PNG. `assets/images/`: default thumbnail.
- `SKILL.md`: Agent Skill entry point.

## Artifacts in the LMS
Every artifact is one HTML file with `<meta charset>`, a `spk:id` meta tag and a `#spk-artifact` JSON block. The JSON holds id, kind, version, course, block and references. The ID format is `spk.<kind>.<course>.<slug>[@semver]`. To link two artifacts, use `href="spk://<id>"`. Quizzes report results with `postMessage({type:'spk:result',…})`. Full details are in `guidelines/artifact-spec.md`.

## CONTENT FUNDAMENTALS
- **Voice:** an expert talking directly and plainly. The website uses first person ("I help organizations…", "My name is Juris!"). Course material speaks to the learner as **you**, or uses the imperative.
- **Tone:** dry and candid, with a little wit. Examples: "Veridion Dynamics — risk, we manage it, allegedly". "Phantom controls". "Treatment is not a colour change on a heatmap." Name the anti-pattern honestly.
- **Structure:** a title, then an em-dash clarifier. Examples: "What risk really is — and isn't", "Treatment options — outputs must be controls".
- **Casing:** sentence case for titles in the LMS and artifacts. The website uses Title Case for marketing headings ("How Can I Help", "Latest Content"). Use **UPPERCASE mono** only for kickers, pills and metadata.
- **Specifics:** cite standards by their official names (ISO 31000, ISO/IEC 27005, EU AI Act, NIS 2, DORA). Use the recurring case-study organisations, such as Veridion Dynamics for risk and Loopwell for AI. Keep each organisation consistent within a course.
- **No emoji.** The legacy course page uses ⏱ and ★. Replace them with line icons or mono meta text.
- **Language:** English primary, Latvian second. Latvian translations get their own `-lv` course slug and ID (see artifact-spec §6); sample: `artifacts/lesson-lv.html`. Latvian copy keeps the same dry, direct voice and uses „…” quotes.

## VISUAL FOUNDATIONS
- **Colour:** mostly cool and restrained.
  - The page ground is mist `#F4F4F5` and cards are white.
  - Ink `#2B2C2E` is for text and body grey `#56575A` is for copy.
  - Action blue `#2F6FA3` is for links and CTAs. Spark `#4A95D1` is for the logo, accents and focus only, because it is too light for text.
  - Petrol `#2C6374` is the signature dark surface: header bands, table heads and flashcard backs.
  - Terracotta `#B25C43` is the only warm hue. Use it for gaps, warnings and wrong answers.
  - Never introduce new hues.
- **Type:**
  - Fraunces 600 at −0.01em, for headings only (42 / 29 / 19 / 17).
  - Inter for everything else, at 15px body with 1.55 line height.
  - JetBrains Mono, uppercase, +0.16em, for kickers, chips, IDs and version strings.
- **Spacing:** a 4-based scale. Sections are separated by 52px. Cards are padded 20–24px. The grid gap is 10–16px.
- **Backgrounds:** flat colour. The only effect is a soft radial **spark glow**, rgba(74,149,209,.28), in the top-right corner of a petrol header. There are no images in the LMS chrome, no textures and no gradients beyond that glow. Photos are marketing-only (portrait with a large soft shadow).
- **Corners:**
  - 6px for chips and small buttons.
  - 8px for buttons and inputs.
  - 9px for inner cards and rows.
  - 14px for cards and panels.
  - 16px for marketing cards.
  - Pills are fully rounded.
- **Cards:** white, with a 1px `#E7E7E8` border and a near-invisible shadow (`0 3px 9px rgba(0,0,0,.05)`). On hover the shadow tints blue (`0 6px 16px rgba(37,85,124,.13)`). Cards do not lift on hover. That lift is a pattern from the website's marketing cards only.
- **Borders:** 1px line. A dashed line separates the summary from the body inside expandable cards. A 4px terracotta left rule is reserved for "attention" cards (gaps). Use it sparingly.
- **Hover:** links darken to blue-800, and their underline moves from blue-100 to action. Secondary buttons and rows turn their border blue. Use no opacity fades.
- **Press:** move the element 1px down. Disabled elements are shown at 45% opacity.
- **Focus:** a 3px spark ring at 35% opacity.
- **Motion:** 150–300ms ease, used only for colour, shadow and border changes. The flashcard flip uses 0.5s with an ease-out curve. A `:target` flash is allowed. Respect `prefers-reduced-motion`.
- **Transparency and blur:** used only on the sticky sub-nav (white at 94% with an 8px backdrop blur) and the eyebrow on petrol (white at 12% with a 22% border).
- **Layout:**
  - The LMS and artifacts use a 1180px wrap. The website uses a 1140px container. Reading-width text is 720–820px.
  - Navigation is sticky. The viewer is a full-window overlay.
  - The mobile breakpoint is 768px, where layouts become a single column.
- **Imagery:** the site uses warm, natural portraits. The blog uses default thumbnails. Artifacts use no stock imagery and show diagrams in HTML instead.

## ICONOGRAPHY
- The source uses inline **Feather-style line SVGs**: 24px viewBox, 2px stroke, `currentColor`, drawn at 11–18px. Examples are the clock, star, video, columns, external-link, chevrons and close. There is no icon font. If you need a full set, use **Lucide** from a CDN because it is visually identical. This is flagged as a substitution, since the repo uses hand-inlined Feather paths.
- The footer uses filled social glyphs (LinkedIn, Facebook, X) at 24px.
- No emoji. The unicode characters "→" (link affordance) and "+ / –" (expand toggles, in mono) are used as glyphs.
- **Logo:** the lockup has "spark" in spark blue and "urity" in grey, with the four-arrow mark. Use the white variant on petrol. When an image isn't possible, the text lockup `.spk-lockup` (Inter 800) is the documented fallback, taken from the org model.

## Intentional additions
- `ArtifactHeader`, `.spk-artifact-meta` and the `spk://` reference spec are new. They exist so the LMS can index and cross-reference artifacts.
- The LMS Dashboard and Artifact library screens are new designs, as requested.
- `--spk-success-50` and `--spk-danger*` are new: tints derived for status feedback.

## Caveats
- The webfonts are loaded from Google Fonts. The repo's base64 font embeds were stripped, so no font binaries are bundled.
- The uploaded SVG logos had no colour styles. Colours were re-applied from the PNG icon and the org-model lockup (spark `#4A95D1` and grey `#6D6E71`). Please confirm.
