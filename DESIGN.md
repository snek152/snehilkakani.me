---
name: Instrument Panel
description: A near-black, hairline-ruled engineering surface for a software/music/photography portfolio. One halftone ambient field behind flat, orthogonal UI, timed to a BPM-92 grid.
colors:
  bg: "#080808"
  card: "#0e0e0e"
  fg: "#efefef"
  dim: "#a8a8a8"
  dim2: "#868686"
  accent: "#2563eb"
  accent-text: "#4478ee"
  border: "rgba(255, 255, 255, 0.07)"
  rule: "rgba(255, 255, 255, 0.15)"
  scrim: "rgba(4, 4, 4, 0.86)"
typography:
  display-xl:
    fontFamily: "Clash Display, sans-serif"
    fontSize: "clamp(3.2rem, 8.5vw, 7.4rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.025em"
  display-lg:
    fontFamily: "Clash Display, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 700
    letterSpacing: "-0.02em"
  display-md:
    fontFamily: "Clash Display, sans-serif"
    fontSize: "clamp(1.5rem, 2.2vw, 1.85rem)"
    fontWeight: 600
    letterSpacing: "-0.012em"
  display-sm:
    fontFamily: "Clash Display, sans-serif"
    fontSize: "clamp(0.95rem, 1.1vw, 1.15rem)"
    fontWeight: 600
    letterSpacing: "0em"
  lead:
    fontFamily: "Switzer, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
  body:
    fontFamily: "Switzer, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  meta:
    fontFamily: "Switzer, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  micro:
    fontFamily: "Switzer, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "0.01em"
rounded:
  sm: "4px"
  dot: "9999px"
spacing:
  rail-thin: "52px"
  rail-full: "176px"
  topbar: "50px"
  page-x-base: "24px"
  page-x-sm: "32px"
  page-x-lg: "48px"
  halftone-cell: "8px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    typography: "{typography.meta}"
    rounded: "0px"
    padding: "0 16px"
    height: "40px"
  button-bordered:
    backgroundColor: "transparent"
    textColor: "{colors.dim}"
    typography: "{typography.meta}"
    rounded: "0px"
    padding: "7.2px 14px"
  button-bordered-hover:
    textColor: "{colors.fg}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    typography: "{typography.body}"
    rounded: "0px"
    padding: "9.6px 0"
  skill-tag:
    backgroundColor: "transparent"
    textColor: "{colors.dim}"
    typography: "{typography.meta}"
    rounded: "0px"
  transport:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
    typography: "{typography.micro}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  nav-rail:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.dim}"
    typography: "{typography.meta}"
    rounded: "0px"
    width: "52px"
  nav-rail-expanded:
    width: "176px"
---

# Design System: Instrument Panel

## Overview

**Creative North Star: "Instrument panel"**

A near-black engineering surface, hairline-ruled, that reads like the flat, orthogonal chrome around a piece of equipment rather than a stack of paper cards. One continuous ambient field (`WaveField`) breathes behind it. It is the only thing in the interface with depth, perspective, or continuous motion, and everything in front of it is deliberately flat: opacity, `y`, `scale`, `clip-path`. Every reveal, stagger and transport pulse is timed off a single BPM-92 grid (`beats()`), a structural nod to the music half of the site rather than a literal audio cue.

Density is high but never cramped. Text is a four-role scale (lead / body / meta / micro) and every prose block carries a measure cap. Colour is rationed to three greys and one blue, and the blue is split by role: shapes get `--accent`, words get the brighter `--accent-text`, so restraint is enforced by contrast math, not taste.

Nothing is decoration for its own sake. A shadow exists only where it does a job a hairline cannot. A rule draws instead of fading, because the site is built out of hairlines and letting them draw turns the page's own structure into the animation. The one texture is a **halftone dither**: an 8px dot grid gated by a 4x4 Bayer matrix, used by exactly three things (the wave field, the cursor glow, the loader) and nowhere else.

**Key Characteristics:**

- **Flat and orthogonal in the foreground, volumetric in one background layer.** `WaveField` is the sole place depth, defocus and continuous motion live.
- **Hairlines, not cards.** No elevation system, no card component, nothing rounder than `rounded-sm`.
- **Three greys, one blue, split by role.** `--accent` for shapes, `--accent-text` for words.
- **One timing grid.** `beats()` off BPM 92 for choreography, two springs for anything a hand touches, one press curve (`--ease-press`, 120ms) for controls.
- **Dither as the single texture.** Halftone belongs to `WaveField`, `CursorGlow` and the loader. Swapping lines for dots anywhere else was tried and rejected.
- **Each surface reveals according to what it is.** Rows follow their rule on `/builds`, the contact sheet develops on `/lens`, the history builds as a spine on `/`. A generic fade-and-rise is the thing that would cheapen all of it.

**Confirmed anti-references.** Both were built, measured and deliberately deleted. Do not reintroduce either:

- The earlier `#2b2b2b` page with an `#fbfbfb` surface, Domine and IBM Plex, gradient-pill skill tags, `rounded-xl` cards with `shadow-lg`. None of it exists in the code.
- A second ambient layer behind the content: full-height `DraftingGrid` construction lines plus a `SchematicLayer` of scroll-bound draughtsman's figures, driven by GSAP. Two independent line systems in one plane fought each other and the figures had no relationship to the content.
- Pinned scroll sequences (`WorkCycle`, `ExperienceCycle`). Scroll may affect motion; it must never take the wheel.

### Motion

- **Choreography** (entrances nobody interrupts): fixed durations on the BPM-92 grid, `EASE_OUT` `cubic-bezier(0.22, 1, 0.36, 1)`. Standard entrance: `opacity 0 → 1`, `y 20 → 0`, `beats(0.75)`, `whileInView` with `once: true`. `fadeUp` adds a one-shot 8px blur-in.
- **Springs** (anything a hand can touch): `SPRING_UI` (`bounce 0`, 0.4s) for chrome that repositions; `SPRING_MOMENTUM` (`bounce 0.2`, 0.4s) only for a release that carried velocity. Overshoot is earned.
- **Press** (controls): `--ease-press` `cubic-bezier(0.23, 1, 0.32, 1)`, 120ms; `active:scale-[0.97]` on bordered controls and buttons, opacity on hit-slop icon links.
- **Route transition**: `template.tsx` clip-path wipe, direction-aware, `beats(0.65)`.
- **Reduced motion means gentler, not dead.** Drags keep tracking; springs become `{ duration: 0 }`; entrances render in place. The preference comes from `useMotionPreference()`; some components delegate it upstream (`CursorGlow` via `CursorField`, `BeatBars` via `useAudioAnalyser`).

## Colors

Three deliberate greys against near-black, plus exactly one blue split by role. The palette lives once in `app/globals.css` as `:root` custom properties and reaches Tailwind through `@theme inline` (`--bg` becomes `bg-bg`, `--dim2` becomes `text-dim2`).

### Primary

- **Accent, shapes only** (`#2563eb`): rules, fills, icons, focus rings, the primary button fill. 3.87:1 on `--bg`, under the 4.5:1 text floor, so it may never carry a word.
- **Accent Text, words** (`#4478ee`): anything read as words. 4.93:1 on `--bg`. Also the halftone ink in the wave field and loader.

`--accent-rgb` (`37 99 235`) is the same blue unpacked for `rgb(var(--accent-rgb) / <alpha>)` bloom values.

### Neutral

- **Background** (`#080808`): the page, and the only background most of the site uses. Also `themeColor`.
- **Card** (`#0e0e0e`): one step off the page, for the few surfaces that need it.
- **Foreground** (`#efefef`): 17.42:1. Anything read as primary text.
- **Dim** (`#a8a8a8`): 8.42:1. Secondary prose and metadata.
- **Dim 2** (`#868686`): 5.50:1. Captions, dividers, recessive readouts.
- **Border** (`rgba(255,255,255,0.07)`): card edges, inputs, nav. Quiet on purpose.
- **Rule** (`rgba(255,255,255,0.15)`): `DrawnRule` only, the lines meant to be watched arrive.
- **Scrim** (`rgba(4,4,4,0.86)`): lightbox backdrop, darker than the page but leaving the contact sheet sharp.

### Named Rules

**The Accent/Accent-Text Split Rule.** The brand blue is under the text floor on this background. `--accent` is for what is seen; `--accent-text` is required the moment the blue is read. Exception: white text on an `--accent` fill (the primary button) clears 5.17:1 because the contrast is against the fill, not the page.

**The One Blue Rule.** The accent is the only blue any control, rule, icon or word uses. The wave field tints its three layers from white toward `37, 99, 235` and draws accent dots at `rgba(68,120,238,0.38)` / neutral dots at `rgba(200,205,220,0.21)`; those are canvas pixels, not interface colours, and must not be sampled for anything else. There is no violet, no seam gradient and no second hue anywhere.

**The No-Opacity-Dimming Rule.** `text-dim` and `text-dim2` are colours chosen to clear 4.5:1. `text-fg/70` is a guess at one. Two sanctioned opacity uses exist and neither is text: `bg-fg/40` for the bullet dot, `bg-white/[0.025]` for an active music row.

**The Accent Seam Rule.** The only gradient is the 1px hairline under project media (`ProjectCard`, `FeaturedProject`): `--accent` fading through 38-42% of itself to transparent. It draws left to right. No gradient fills, no gradient text.

## Typography

Two self-hosted variable fonts from the Indian Type Foundry, loaded through `next/font/local` from `app/fonts/` with licences alongside. Never a CDN webfont: the free Google catalogue is where every generated portfolio shops. Sharing a foundry means the faces sit together without being lookalikes.

- **Clash Display** (`--font-clash-display`, `font-display`): every display line. Axis **200-700**, so the tiers top out at `font-bold`.
- **Switzer** (`--font-switzer`, `font-sans`, the document default): body copy and all UI text. Axis **100-900**.
- **No mono, deliberately.** Numeric readouts (BPM, durations, EXIF triplets, dates) use `tabular-nums` on the sans.

### Hierarchy

Display tiers pair one size token with the tracking token of the same suffix. Every tier is a `clamp()`.

- **Display XL** (700, `clamp(3.2rem, 8.5vw, 7.4rem)`, `-0.025em`, leading 0.94): hero name lockup.
- **Display LG** (700, `clamp(2.5rem, 5vw, 4rem)`, `-0.02em`): full-page titles on all four routes plus 404.
- **Display MD** (600, `clamp(1.5rem, 2.2vw, 1.85rem)`, `-0.012em`): card and section headings, experience company names.
- **Display SM** (600, `clamp(0.95rem, 1.1vw, 1.15rem)`, `0em`): index labels, role cycler.

Text roles, four sizes and no others:

- **Lead** (`1.0625rem`, leading 1.75, measure 56ch): the one intro paragraph per page.
- **Body** (`1rem`, leading 1.7, measure 66ch): prose, descriptions, bullets.
- **Meta** (`0.875rem`): metadata, labels, captions, nav, buttons, EXIF readouts.
- **Micro** (`0.8125rem`): dense readouts: transport clock, notices, errors.

Colour is `text-fg` / `text-dim` / `text-dim2`. Small dim text at Meta or Micro takes `--track-text-sm` (+0.01em); uppercase micro-labels (`SkillsMatrix` group headings) keep their own `0.08em`; `text-fg` text takes neither.

### Named Rules

**The Token Scale Rule.** Every size, leading, measure and tracking value is a token in `globals.css`; a component references the role it needs. A hand-picked `text-[0.93rem]` at a callsite is the defect the scale replaced.

**The No-Breakpoint-Size Rule.** Display tiers scale by `clamp()`. A heading is the same size on every route at every width. An `sm:` or `lg:` size step on a display element is a defect.

**The No-800 Rule.** Clash Display has no 800. `font-extrabold` on a display element would be synthesized by the browser, not rendered.

**The Uncapped Prose Rule.** Prose without a measure cap is a bug. Caps are in `ch`, so they hold at any zoom.

**The Poster Scale Exception.** `--size-meta-poster` (11rem), `--text-meta-ribbon` (1.3125rem) and `--text-meta-stack` (2.25rem) exist solely for the noindex render surfaces `/meta-image` and `/linkedin-banner`, which are fixed-size 1200x630 and 1584x396 canvases that get exported to images. They are not site roles; do not use them in routes.

**The Brand Mark.** `public/brand-mark.svg` is one all-white ligature of the actual Clash Display Bold numerals `1`, `5`, `2` (the `1` enters the `5` at full stroke, the `2` paints last so its shoulder absorbs the lower junction), scaled to 66% of its construction square. The Sidebar renders it transparent at 32x32 through `next/image` with `unoptimized`. The raster icon family (`app/icon.png`, `app/apple-icon.png`, public 192/512 PNGs) mounts the same master on an opaque `--bg` square; `app/favicon.ico` packs a 32px render plus a pixel-hinted 16px. It is a brand composition, not a text role.

## Layout

The shell is `flex min-h-[100dvh] flex-col lg:pl-[52px]`: the 52px offset is the collapsed rail, so content clears it on desktop and the rail never reflows anything on hover. `main` is `flex-1`; extra space above the footer on a tall viewport is the expected sticky-footer stretch.

`lg` is the one cutoff that switches navigation between a vertical sidebar (desktop) and a 50px top bar (mobile). `sm` and `md` scale padding and grid columns within either mode. Route containers use `px-6 sm:px-8 lg:px-12` (24 / 32 / 48px); full-bleed rules and rows break out with matching negative margins (`-mx-6 sm:-mx-8 lg:-mx-12`).

Recurring grids:

- **Hero:** `min-h-[95vh]`, content bottom-anchored, `lg:grid-cols-[1.5fr_minmax(220px,1.2fr)]`.
- **Index strip (`GridIndex`):** four equal columns, even on mobile, hairline column dividers at `bg-border/50`.
- **Experience:** `lg:grid-cols-16`, date column spans 4 (right hairline, `lg:pl-12 lg:pr-10`), content spans 12 (`lg:pl-10 lg:pr-12`). Single column below `lg`.
- **Builds:** featured project `[5fr_7fr]`; project rows `1fr 1fr` with the image edge on the page's centre stop; skills matrix 1 / 2 / 4 columns on a `border-l border-t` frame.
- **Music:** feature grid 1 / 2 / 4 columns; track rows `[minmax(11rem,1fr)_auto_auto]` from `lg`.
- **Lens:** justified rows packed from intrinsic dimensions, exact-pixel cells.
- **Reach:** `[minmax(0,3fr)_minmax(15rem,2fr)]` from `md`.

Spacing is Tailwind's scale with no custom tokens beyond the rail widths. Vertical rhythm is set by hairlines: rows sit between rules with `py-8` / `lg:py-10` (experience) or `py-10` / `lg:py-12` (projects).

**Rail widths.** Collapsed `52px`, expanded `176px`. The extra 124px sits on top of the page and never reflows it, which is why the expanded rail needs `data-material` and a real directional shadow to read as a panel.

## Elevation & Depth

**There is no elevation system and no card component.** A surface is separated from the page by a 1px `border-border` hairline, a `DrawnRule`, or nothing. `--card` exists for the few surfaces that need to sit one shade off.

Depth is expressed by **defocus**, never by drop shadow. `WaveField` recedes by going soft, not dark: each curve's bloom widens and fades with depth. The one deliberate exception is `Lightbox`, whose scrim dims the contact sheet but leaves it sharp, because a blurred photograph reads as a loading failure.

### Shadow Vocabulary

Four shadows exist; each does a job a hairline cannot, and nothing else is permitted.

- **Rail panel** (`box-shadow: 6px 0 28px -8px rgba(0,0,0,0.85)`): the expanded `Sidebar` rail, so it reads as a panel over the page and not a wider strip of it.
- **Charged fill** (`box-shadow: 0 0 20px 2px var(--color-accent)`): `ScrollProgressRail` fill.
- **Orbit ring** (`box-shadow: 0 0 0 1px rgb(var(--accent-rgb) / 0.18)`): the loader's orbit node, a zero-blur 1px ring.
- **Falling light** (`box-shadow: 0 6px 14px -7px rgb(var(--accent-rgb) / 0.14 | 0.26)`): `SignalRule`. Offset plus blur, so it has a direction; a zero-offset glow is decoration.

Not a shadow: `.instrument-chassis` draws an inset 1px `rgb(255 255 255 / 0.025)` frame around the app, a hairline in disguise.

### Material

`backdrop-filter` appears three times and each has a job: the expanded rail (`14px`), the mobile top bar (`14px`, `bg-bg/90`), and the music transport (`8px`, `bg-bg/95`), the last because it floats over scrolling rows and needs an edge to read against them. Anything with `data-material` falls back to opaque `--bg` under `prefers-reduced-transparency`, and to `#000` with a `0.55` border under `prefers-contrast: more`, through `globals.css` overrides rather than per-component branches.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. No shadow as card elevation, ever.

**The Defocus Rule.** To put one thing behind another, soften it. Do not darken it and do not shadow the one in front.

**The One Ambient Layer Rule.** `WaveField` is the site's only continuous ambient motion. A second animated layer in the same plane, however quiet, makes both read as clutter. Make the field perceptible by raising filament opacity, never by adding a layer above it. `CursorGlow` is pointer feedback, not ambience: it mounts only for a precise pointer, tracks it 1:1, and has no idle position, drift or audio reactivity.

## Shapes

Corner radius never exceeds `rounded-sm` (4px in Tailwind 4). Controls, inputs, form fields, image frames and rows are square (0px). The geometry is orthogonal: 1px lines, right angles, and a 45-degree diamond (the loader's centre node and the matrix mark).

Circles exist only as marks, never as containers: the 6px bullet dot (`bg-fg/40`), the `SignalRule` endpoint dot, the `ScrollProgressRail` fill, and the 8px square active marker in music rows (`rounded-sm`). `BeatBars` columns are `2.5px` wide with `1px` corners.

Hairlines carry three brightness levels, each scoped to one job:

- **`--border`** (0.07): quiet edges: cards, inputs, nav, row dividers.
- **`--rule`** (0.15): `DrawnRule` only. 0.07 was invisible when animated; 0.2 read as loud while a second line system competed; 0.15 is where the draw is legible without the dividers taking over.
- **`--accent`**: active state only: a playing row's rule, a focused field's underline, a hovered photo's baseline.

`RouteSignal` draws a per-route geometric mark (`builds`, `music`, `lens`, `reach`; each its own path, a `--dim2` seam trace and a terminal dot) as a self-tracing signature beside the page title on Builds, Music, Lens and Reach, `--accent` stroke at 1.15px.

### Named Rules

**The Rules-Draw Rule.** Rules draw; they never fade. `DrawnRule` scales a 1px line from an origin over ~0.8s, starting `240px` above the fold (roughly three-quarters of a laptop viewport) so the draw finishes where the reader is looking. A rule within 240px of the end of the document is detected on mount and resize and rendered already present.

**The No-Pill Rule.** No pill, chip, capsule or rounded-container tag. Skill tags are text.

## Components

### Buttons

- **Primary** (hero Résumé, error retry): `h-10`, `px-4`, `--accent` fill and border, white `meta`-size medium text. Hover drops opacity to 0.8; press `active:scale-[0.97]`. Square corners.
- **Bordered control** (`BORDERED_CONTROL` in `shared/controls.ts`; Reach confirmation actions, 404, hero icon buttons): 1px `--border`, `text-dim` rising to `text-fg`, `px-[0.875rem] py-[0.45rem]`, press `active:scale-[0.97]` through Tailwind v4's independent `scale` property. Hover on icon buttons and the 404 link also shifts the border to `--accent`.
- **Focus** (every interactive element): `outline-2 outline-offset-4 outline-accent`. A 1px border switching to `--accent` alone is not a focus indicator at 3.87:1. Icon links in `ProjectMeta` use `ring-2 ring-accent ring-offset-4 ring-offset-bg` for the same effect.
- **Hit slop**: footer links (`before:-inset-2`) and project icon links (`before:-inset-x-1.5 before:-inset-y-2.5`) grow the tap target with an absolutely-positioned `::before`, not by resizing, and signal press with opacity or scale on the visible element so the extender does not shrink under a thumb.

### Inputs / Fields

No visible box. The input's bottom border (`--border`) is the rule; on focus an accent underline draws from the caret side and retracts the same way. Placeholder `text-dim2`. Errors render at `text-fg`, Micro size, never a semantic red: the problem is carried by words, position and `aria-invalid`. Validation runs on submit and on blur of a field the visitor filled in, never per keystroke.

### Navigation

- **Rail (`Sidebar`, desktop):** `52px` collapsed, `176px` expanded via `SPRING_UI` after a 120ms hover-intent delay so a cursor grazing the rail does not slide a panel over the page. Keyboard focus expands it at once; it collapses on every route change. Expanded state carries `data-material`, the 14px blur and the rail shadow. 42px item rows inside a 52px icon column, Home mark at the top (32x32).
- **Top bar (mobile):** 50px, `border-b border-border`, `bg-bg/90`, 14px blur, five right-aligned labels at a 12px gap plus the Home mark.
- Both `<nav>`s carry `aria-label="Primary"`.

### Index strip (`GridIndex`)

Four cells under a top hairline: Display SM label in `text-dim`, rising to `text-fg` on hover, a Micro caption (visible from `sm`) and an arrow that nudges `-0.5 / +0.5` on hover. Press `active:scale-[0.98]`.

### Experience entry (`ExperienceList`)

A history that builds as a spine. Two columns from `lg`: the date column (Meta, `text-fg`, `tabular-nums`, one `period`) with location beneath in Micro `text-dim`; the content column with company in Display MD, a Meta role line in `text-dim` (`Title, previously X` when the role was promoted), the summary as Body `text-fg` at `mt-5`, bullets in Body `text-dim` on `bg-fg/40` dots, an optional impact line in Meta medium `text-accent-text` with a 16px `TrendingUp` icon in `--accent`, then skill tags. Rows reveal in two steps: date column, then content `beats(0.1)` behind, with a `DrawnRule` along the bottom and `viewport` margin `100000px 0px -6% 0px` so skipped rows are still seen.

### Skill tags (`ProjectSkills`, experience skills)

A list item prefixed by a `/` drawn with `before:content-['/']` (`--dim2` in projects, `--accent` in experience). No background, border, radius or hover scale.

### Project rows (`FeaturedProject`, `ProjectCard`)

Media in a `border-border` frame with an accent-fading hairline along its foot; text beside it. Featured project overlaps a secondary image with a `bg-bg p-1.5` mat. Each project row is a `<details>` accordion (animated height, `inert` while closed) with a `+` that rotates 45 degrees. On `/builds` the rule leads and the row's content follows `beats(0.15)` behind.

### Skills matrix (`SkillsMatrix`)

An inventory of tools, never a ranking: no levels, tiers or ratings. Four grouped columns on a hairline grid, each headed by a 2px accent tick and an uppercase `0.08em` Body label; items are a 14px icon in `--dim2` (turns accent on hover) plus a Meta `text-dim` label, divided by hairlines.

### Music (`TrackRow`, `FeatureTrackGrid`, `PlayerBar`)

Release rows are hairline-divided. Order in `beats.ts` is the running order. The active row gets `bg-white/[0.025]`, an accent 8px marker, and the accent rule that continues down into the transport's hairline. `BeatBars` rests at `0.12` per bar when idle. **Transport** is a compact route-scoped panel `fixed bottom-4 right-4`, `w-40 sm:w-56`, `border-border bg-bg/95`, 8px blur, `rounded-sm`: the one boxed surface in the system. Its progress rail is a 1px `bg-border` line filled with `bg-accent`. Closing it or leaving `/music` tears down the audio graph.

### Gallery (`GalleryCell`, `Lightbox`)

Cells are sized in exact pixels from the justified row packing at the photo's true aspect ratio. No hover zoom, no corner ticks, no caption; an aligned EXIF readout (tabular) sits beneath. The contact sheet **develops**: a `clip-path` wipe in reading order with a slight scale settle. **Lightbox**: `--scrim` without blur, `data-material`, own Tab trap, neighbour preload through the same `next/image` props, manual dual-layer crossfade, drag frame sized from the active photo's aspect. Downward drag tracks 1:1 and dismisses on `project()` rest plus velocity sign; upward has nothing behind it, so `rubberband()` resistance goes there.

### Footer

Icon plus label links at Meta, `text-dim` to `text-fg`, `gap-5` / `gap-6`. Below 420px the icons drop and labels stay: the label names the destination, the icon is decoration.

### Ambient field (`WaveField`, `CursorGlow`, `CursorField`)

**`WaveField`** is a fixed full-viewport canvas behind every route: three tinted layers of coherent filaments (white toward accent), rendered in three passes (bloom, halo, core) into a 1/8-scale offscreen canvas, read back, and quantised to the 8px halftone grid. Each cell becomes a dot sized by brightness and gated by the 4x4 Bayer matrix, so soft falloff reads as ordered dither. DPR is capped at 1.5. It responds to scroll (phase and an energy term that decays). Its `intensity` prop (default 1) scales stroke width and alpha; only `/meta-image` and `/linkedin-banner` raise it (1.8) so the dots hold up as still images. **`CursorGlow`** is accent dots on the same 8px grid, radius up to `0.3 * cell`, reach 150px, 0.22 alpha, Bayer-gated; mounted only after `CursorField` reports a precise pointer, so touch and reduced-motion visitors never get it.

### Loader (`LoadingScreen`, `OrbitStage`, `DitherReveal`, `HalftoneHalo`)

A first-visit intro: four tool marks (Terminal, SlidersVertical, Aperture, Binary: engineering, music, photography, research) on a 140px orbit scaled 2.1x around a diamond node, with halftone halos. Exit is a dither sweep revealing the page; the stage is eaten by the same front through a CSS mask, not a separate fade. Runs once per 24 hours, decided by a synchronous `<head>` script (`LOADER_GATE_SCRIPT`) so a returning visitor never sees it; the visit is stamped when the intro finishes. Click, Enter, Space or Escape skip. Reduced motion renders a plain `--bg` layer for 160ms. `LoaderMatrix` is a static 2x2 grid of the same four marks in `border-white/[0.22]` squares, used only by the two render surfaces.

### Render surfaces (`/meta-image`, `/linkedin-banner`)

`noindex, nofollow`, `Disallow`ed in `robots.ts`, and absent from the sitemap. Fixed-size canvases (1200x630, 1584x396) that compose the display lockup, the role cycle list, `LoaderMatrix` and a frozen `WaveField` at `frozenAtMs` with raised `intensity`. Exported to `app/opengraph-image.png`, `app/twitter-image.png` and `public/linkedin_banner.jpg` by hand; the files do not regenerate themselves.

### Role cycler (`RoleCycle`, `useScrambleText`)

Scramble-decode between roles using a deliberately letter-free glyph set (`0123456789#%&*+=~<>/|`) so mid-decode text never reads as a misspelling. The full list is exposed once in an `sr-only` span, never `aria-live`. Role order is load-bearing: index 0 is what reduced-motion visitors and recruiters see, so an engineering title leads.

## Do's and Don'ts

### Do:

- **Do** separate surfaces with a hairline (`--border`, `--rule`) or nothing.
- **Do** use `--accent` for shapes and `--accent-text` for words.
- **Do** use `text-dim` / `text-dim2` for de-emphasis.
- **Do** keep `WaveField` as the one ambient layer, and halftone as the texture of `WaveField`, `CursorGlow` and the loader only.
- **Do** source type from the four text roles and four display tiers in `globals.css`, with a measure cap on prose.
- **Do** time choreography with `beats()` and `EASE_OUT`, hand-driven motion with `SPRING_UI` / `SPRING_MOMENTUM`, and presses with `--ease-press` at 120ms.
- **Do** give every new surface a reveal that fits what it is (a rule leading, a sheet developing, a spine building).
- **Do** respect `useMotionPreference()` and keep drags tracking under reduced motion.
- **Do** put a visible `focus-visible` outline (`outline-2 outline-offset-4 outline-accent`) on every interactive element, and a 24px minimum hit area.
- **Do** route per-route metadata through `routeMetadata()` so OG and Twitter images survive the replace-not-merge behaviour.
- **Do** treat the site's content as typed data under `app/lib/data/`, and keep generated files (`beat-durations.ts`, `photo-dims.generated.ts`) generated.

### Don't:

- **Don't** let `--accent` (`#2563eb`, 3.87:1) carry a word.
- **Don't** dim text with an opacity modifier.
- **Don't** use a shadow as card elevation; the four named shadows are the whole list.
- **Don't** add a second animated background, pinned scroll sequence, or a dotted `RouteSignal`, loader texture, hero line, scroll rail or `BeatBars`: all were tried and read worse than the solid strokes.
- **Don't** introduce a fifth text size, a hand-picked literal such as `text-[0.93rem]`, or an `sm:` / `lg:` size step on a display element.
- **Don't** use `font-extrabold` on Clash Display.
- **Don't** use a radius above `rounded-sm`, a pill, a gradient fill, or gradient text.
- **Don't** invent per-component durations, or fade a rule where it should draw.
- **Don't** add a kicker or eyebrow above a heading.
- **Don't** add a semantic colour (error red, success green). The palette has one blue.
- **Don't** add a proficiency level, rating or tier to skills.
- **Don't** put the Poster Scale tokens, `LoaderMatrix` or `intensity` above 1 on a real route.
- **Don't** demote `Builds`, `Music` or `Lens` into a footnote: range is the claim.
