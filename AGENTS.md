# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Next.js 15 App Router** portfolio site using React 19, TypeScript, and Tailwind CSS 4.

### Pages & Routes

| Route | Page file | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Home — hero, index strip, experience |
| `/builds` | `app/builds/page.tsx` | Featured project, project rows, stack |
| `/music` | `app/music/page.tsx` | Beat release list + persistent transport |
| `/lens` | `app/lens/page.tsx` | Photography contact sheet + lightbox |
| `/reach` | `app/reach/page.tsx` | Contact |

Each route except `/` has a server `layout.tsx` beside it carrying that
route's `metadata`; the page components are `"use client"` and so cannot
export it themselves. Shared metadata values live in `app/lib/metadata.ts`.

### Data Layer

All content lives in TypeScript files under `app/lib/data/`. To add or edit portfolio content, edit these files — **no CMS, no API, no markdown**:

- `projects.ts` — `Project[]` with title, subtitle (date range), description, image, skills, and optional `link` / `github` / `privateRepo`
- `experience.ts` — `Experience[]` with title, company, location, period, description bullets, skills
- `beats.ts` — `Beat[]` with audio file path, category, tempo, description
- `beat-durations.ts` — track lengths in seconds, generated from the MP3s with `ffprobe`; regenerate when the beats change
- `skills.ts` — skill objects with icon (from `@icons-pack/react-simple-icons`), label, colorClass, and `type` (`"frontend"` | `"backend"` | `"AI"` | `"other"`), rendered as a grouped icon grid. It is an inventory of tools used, not a ranking — deliberately no proficiency levels, tiers or ratings, which are unfalsifiable and read as padding
- `photos.ts` — photo metadata with EXIF-style fields (aperture, ISO, etc.)
- `photo-dims.generated.ts` — intrinsic image dimensions, generated; do not hand-edit
- `app/lib/nav.ts` — navigation items (note: at `app/lib/`, not `app/lib/data/`)

### Component Patterns

- **`"use client"`** on all interactive components
- **`useInView`** from `motion/react` for scroll-triggered entrance animations, paired with `viewport={{ once: true }}` on `whileInView`. (Not `react-intersection-observer` — that dependency is gone.)
- Navbar expands on hover (desktop: vertical sidebar `lg:w-18` → `lg:w-36`; mobile: top bar)

### Styling

Tailwind CSS 4 with custom theme tokens defined in `app/globals.css` via `@theme`:

```
--color-primary:    #0d6efd  (blue accent)
--color-secondary:  #262626  (card/surface dark)
--color-surface:    #fbfbfb
--color-background: #2b2b2b  (page background)
--color-on-surface: #404040
```

**Fonts** — both are **self-hosted variable** fonts from the Indian Type
Foundry, loaded with `next/font/local` in `app/layout.tsx` from `app/fonts/`
with their licences beside them (`*-FFL-LICENSE.txt`). They are deliberately
not CDN webfonts: the free Google catalogue is where every generated portfolio
shops, and its most-reached-for grotesques are why so many read alike.

- **Clash Display** (`--font-clash-display`, the `font-display` token) — every
  display line. Its axis is **200–700**. There is no 800, so the tiers top out
  at `font-bold`; an `font-extrabold` class on a display element would be
  browser-synthesized, not rendered. Do not reintroduce one.
- **Switzer** (`--font-switzer`, the `font-sans` token and the document
  default) — body copy and all UI text. Axis **100–900**, so every weight the
  design uses is real.

There is deliberately **no mono**. Numeric readouts (BPM, track durations, EXIF
triplets, viewfinder captions) use `tabular-nums` on the sans, which aligns the
figures without introducing a third voice.

**The type scale lives in `globals.css`, not at callsites.** Every size,
leading, measure, and tracking value is a token; a component references the
role it needs. A hand-picked `text-[0.93rem]` at a callsite is the defect this
replaced — nine near-identical prose sizes across five surfaces, and four
sibling page titles that each scaled differently.

Display tiers — one size token paired with the tracking token of the same
suffix:

|Tier|Used for|Classes|
|---|---|---|
|XL|Hero name lockup|`text-[length:var(--size-display-xl)] font-bold tracking-[var(--track-display-xl)]`|
|LG|Full-page titles (all four routes)|`text-[length:var(--size-display-lg)] font-bold tracking-[var(--track-display-lg)]`|
|MD|Card + section headings|`text-[length:var(--size-display-md)] font-semibold tracking-[var(--track-display-md)]`|
|SM|Small display labels (index labels, role cycler)|`text-[length:var(--size-display-sm)] font-semibold tracking-[var(--track-display-sm)]`|

Every tier is a `clamp()`, so a heading is the same size on every route at every
width. Never add a `sm:`/`lg:` size step to a display element — the token
already scales.

Text roles — four sizes, no others:

|Token|Value|Used for|
|---|---|---|
|`--text-lead`|1.0625rem|the one intro paragraph per page|
|`--text-body`|1rem|prose: descriptions, bullets, running copy|
|`--text-meta`|0.875rem|metadata, labels, captions, nav, buttons|
|`--text-micro`|0.8125rem|dense readouts: EXIF, transport clock, notices|

Prose pairs with `--leading-lead`/`--leading-body` and a measure cap
(`--measure-lead` 56ch, `--measure-body` 66ch). Prose without a cap is a bug:
three blocks used to run unbounded across their columns.

**Small dim text on this near-black surface gets `--track-text-sm` (+0.01em).**
Any element at `--text-meta` or `--text-micro` coloured `text-dim`/`text-dim2`
takes it. Uppercase micro-labels keep their own positive `0.08em` instead, and
`text-fg` text takes neither.

The `SK` wordmark in `Sidebar` is the one documented exception to all of the
above: it keeps a fixed `text-[0.9rem]` and `font-bold`, because a brand mark is
not a scale role.

Tracking belongs to a **typeface**, not to a layout. The current values are
retuned for Clash Display, which is narrower and drawn tighter than the Epilogue
they were originally set for. Changing the display face means retuning them.

### Static Assets

Public assets are organized by section under `public/`:
- `public/beats/` — MP3 audio files
- `public/photos/` — Photography portfolio images
- `public/projects/` — Project screenshot/cover images
- `public/resume.pdf` — Resume download

Project and skill images use static imports (`StaticImageData`) rather than public paths.

### Path Alias

`@/*` maps to the repo root (configured in `tsconfig.json`).

### Design Conventions

**Cards**
- Use `bg-secondary` (not `bg-background`) for card backgrounds — `bg-background` is the same as the page background (`#2b2b2b`) and will be invisible.
- Standard card: `bg-secondary border-[1.5px] border-secondary/60 rounded-xl overflow-hidden shadow-lg`
- Heavy card (e.g. AboutCard): `border-4 border-secondary bg-background rounded-xl` with a box-shadow glow via inline `style`

**Skill tags** — use this exact class string everywhere for consistency:
```
bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60 text-surface z-20 relative px-3 py-1 rounded-full text-sm font-ibm border-2 border-primary/70 shadow-md hover:scale-105 hover:shadow-lg active:scale-105 active:shadow-lg transition-all duration-200 font-semibold
```

**Typography hierarchy** (dark backgrounds)
- Heading: `text-surface font-domine font-bold` — `text-xl lg:text-2xl` for card titles, `text-3xl lg:text-4xl` for section titles
- Subheading: `text-surface/70 font-ibm font-semibold text-sm lg:text-base`
- Meta (period, location): `text-surface/60` and `text-surface/50` at `text-sm font-ibm`
- Body: `text-surface font-ibm text-sm lg:text-base leading-relaxed`
- Do not add opacity modifiers just to dim body text — use `text-surface` at full opacity for readable content

**Bullet points** (in lists)
```
<span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0 mt-[0.65rem]" />
```
Parent `<li>` should use `flex items-start gap-2.5` — never `items-center` or `self-center` on the dot, which causes misalignment on wrapped lines.

**Animations** — standard entrance pattern, applied directly on a
`motion.*` element:
```tsx
initial={reduceMotion ? false : { opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.3 }}
transition={{ duration: beats(0.75), ease: EASE_OUT }}
```
`EASE_OUT` and `beats()` come from `app/lib/motion.ts` and `app/lib/tempo.ts` — a
single BPM-92 timing grid (`app/lib/tempo.ts`) every entrance duration derives
from, instead of components picking their own numbers in isolation. The shared
`fadeUp`/`staggerContainer` variants in `app/lib/motion.ts` carry the same
values for anything driven by named `variants` (page headers, staggered lists)
rather than inline targets. Always respect `useMotionPreference()` (from
`app/lib/components/shared/MotionPreference.tsx`) for reduced-motion users.
Note that some components delegate this upstream rather than branching
themselves — `CursorGlow` renders nothing because `CursorField` clears
`active`, `BeatBars` sits still because `useAudioAnalyser` never starts its
frame loop, and `OrbitStage` is never mounted because `LoadingScreen`
substitutes a plain backdrop. Check the provider before adding a branch.

A `Reveal` wrapper component used to be documented here as the standard. It
was deleted — nothing ever imported it, and every component had gone on
writing the pattern above inline. Reintroducing a wrapper is fine, but it
would have to actually be adopted.

**Durations vs. springs** — the pattern above is for *choreography*: entrances
nobody interrupts, which is why a fixed duration on the BPM-92 grid is the
right tool. Anything a hand can touch takes a spring instead, because a
duration cannot answer new input — a grabbed or reversed drag has to animate
from wherever the value currently is. `app/lib/motion.ts` exports three, in
Apple's two-parameter form (`bounce` is the damping ratio inverted, `duration`
is the response — how fast it reaches the target, not how long it may take):

|Spring|Values|For|
|---|---|---|
|`SPRING_UI`|`bounce 0`, `0.4`|chrome that repositions: the sidebar rail, panels|
|`SPRING_DRAWER`|`bounce 0`, `0.3`|sheets and drawers|
|`SPRING_MOMENTUM`|`bounce 0.2`, `0.4`|**only** a release that carried velocity|

Overshoot is earned. `bounce > 0` belongs solely where the gesture itself had
momentum — a flick or a throw. A panel that merely appeared has no momentum to
express and gets `bounce: 0`.

Two helpers back the gesture work, and both name a formula whose inlined form
would explain nothing:

- `project(velocity)` — where a flick comes to rest, by exponential decay (the
  scroll-deceleration form, **not** `v²/2a`). Commit on the *projected* rest and
  the velocity *sign*, never on raw distance dragged: that is what makes a short
  fast flick read as a throw instead of an ignored gesture.
- `rubberband(overshoot, dimension)` — progressive resistance, and only ever
  past a real boundary. Applying it from the first pixel makes the element lag
  the finger, which is the one thing direct manipulation must not do. See
  `Lightbox`: downward drag dismisses so it tracks 1:1, upward has nothing
  behind it so that is where the resistance goes.

Reduced motion means gentler, not dead. A drag must keep tracking — dragging is
not vestibular motion, and removing it breaks the control. What changes is the
settle: swap the spring for `{ duration: 0 }` and drop any overshoot. The
`Lightbox` gesture and the `PlayerBar` scrubber handle both follow this — the
handle still appears under reduced motion because it is an affordance, and only
its transition is dropped.

**Experience data ordering** — most recent first in `experience.ts`.
