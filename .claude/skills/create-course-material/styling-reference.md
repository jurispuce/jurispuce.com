# Course Material Styling Reference

Design tokens and patterns shared across all lessons in `course-source/`. Inline these into each lesson's `<style>` block — there is no shared stylesheet.

## Brand colors (Peakdefence)

```css
:root {
  /* Primary brand */
  --pd-red:        #CC002E;   /* primary accent — page-title spans, primary buttons, key alerts */
  --pd-red-light:  #FFE6EB;   /* tinted backgrounds for active/selected red state */
  --pd-red-hover:  #A60025;   /* hover/pressed state for red */

  --pd-blue:       #3F3D56;   /* secondary accent — badges, neutral structural emphasis */
  --pd-blue-light: #E8E8EE;
  --pd-blue-bg:    #F4F4F8;   /* very light blue-grey body wash */

  --pd-green:      #669090;   /* tertiary — used for "good" outcomes, MedReg/SmartCity scenario B */
  --pd-green-light:#E8F0F0;

  /* Functional accents */
  --amber:         #BA7517;   /* warnings, caution states, intermediate findings */
  --amber-light:   #FAEEDA;
  --purple:        #534AB7;   /* informational, highlight, "modern" topics like AI Act */
  --purple-light:  #EEEDFE;
}
```

**Rule of thumb**: red = alert / primary CTA, blue = neutral structural, green = success / positive scenario, amber = caution, purple = info. Don't introduce new hues — pick from this palette.

## Surface / neutral palette

Two conventions exist in the codebase — both are acceptable; pick one and use it consistently within a single file.

### Convention A — semantic neutrals (preferred for new lessons)

```css
:root {
  --bg:              #F5F4F1;   /* page background — warm off-white */
  --card:            #FFFFFF;   /* card surface */
  --border:          #E4E2DD;   /* default border */
  --text-primary:    #1A1918;
  --text-secondary:  #6B6862;
  --text-tertiary:   #9E9A93;
}
```

### Convention B — numbered grayscale (used in some older lessons)

```css
:root {
  --gray-0: #F8F9FA;
  --gray-1: #F1F3F5;
  --gray-2: #E9ECEF;
  --gray-3: #DEE2E6;
  --gray-4: #CED4DA;
  --gray-5: #ADB5BD;
  --gray-6: #868E96;
  --gray-7: #495057;
  --gray-8: #343A40;
  --gray-9: #212529;
}
```

If unsure, copy the closest neighbour lesson's convention.

## Typography

Preferred (most lessons):

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --font: 'Plus Jakarta Sans', -apple-system, sans-serif;
  --mono: 'JetBrains Mono', 'Menlo', monospace;
}

body {
  font-family: var(--font);
  font-size: 14px;
  line-height: 1.55;
}
```

Fallback (when Google Fonts is unavailable / for very simple lessons):

```css
:root {
  --rto-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --rto-mono: 'Menlo', 'Monaco', 'Consolas', monospace;
}
```

Sizes:
- Body: `14px`
- Small/meta: `12–13px`
- Section headings: `16–18px`
- Card titles: `18–20px`
- Page title: `26–28px`, weight 600–700, letter-spacing `-0.5px`

## Layout

```css
:root {
  --radius:    8px;    /* small cards, buttons */
  --radius-lg: 12px;   /* large cards, primary surfaces */
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
}
```

Mobile breakpoint: `@media (max-width: 768px)`. Lessons should be single-column at this width.

## Common components

### Page header

```html
<header class="page-header">
  <div class="page-header-top">
    <div>
      <h1 class="page-title">Lesson <span>title accent</span></h1>
      <p class="page-subtitle">One-line context.</p>
    </div>
    <span class="badge">ISO 27001</span>
  </div>
</header>
```

`.page-title span` uses `--pd-red` to highlight the keyword.

### Badge

```css
.badge {
  display: inline-flex;
  padding: 6px 14px;
  background: var(--pd-blue);
  color: white;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}
```

### Card

```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
```

### Scenario selector (MedReg / SmartCity)

Many lessons let the reader toggle between two recurring example organisations. The convention:

- **MedReg** (private healthcare): activates `--pd-red` family
- **SmartCity Rīga** (municipal IoT): activates `--pd-green` family

Buttons use a 2px border, light tinted background when active, and the corresponding text color.

## Interactive elements

Vanilla JS only — no build step, no framework. Common patterns in existing lessons:

- **Decision tree** with click-to-expand nodes
- **Pipeline** with numbered stages connected by a vertical gradient line
- **Toggleable scenarios** (MedReg vs SmartCity)
- **Form simulators** (NCR form, audit report sections)
- **Confusion-matrix / 2×2 grids** for classification topics

When building a new lesson, look at the neighbouring lessons in the same block for an established interaction pattern before inventing a new one.

## Language

All user-facing strings in **Latvian** (`lang="lv"`). Standard names (ISO, MK, EU AI Act) keep their official form. Code/keys/CSS-class names stay in English.

## Accessibility minimums

- Color contrast ≥ 4.5:1 for body text
- All interactive elements keyboard-reachable (use `<button>`, not `<div onclick>`)
- Don't rely on color alone to convey state — pair with icon, label, or border change
