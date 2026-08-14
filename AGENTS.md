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

Tailwind CSS 4. The palette is defined once in `app/globals.css` as `:root`
custom properties and exposed to Tailwind through `@theme inline`, so
`--bg` becomes `bg-bg`, `--dim2` becomes `text-dim2`, and so on.

```
--bg          #080808          page, and the only background there is
--card        #0e0e0e          the one step off the page, for the few surfaces that need it
--fg          #efefef          17.42:1 — anything read as primary text
--dim         #a8a8a8           8.42:1 — secondary prose, metadata
--dim2        #7d7d7d           4.87:1 — captions, dividers, recessive readouts
--accent      #2563eb           3.87:1 — SHAPES ONLY: rules, fills, icons, focus rings
--accent-text #4478ee           4.93:1 — REQUIRED for anything read as words
--accent-rgb  37 99 235        the same blue unpacked, for `rgb(var(--accent-rgb) / <alpha>)`
--border      rgba(255,255,255,0.07)   card edges, inputs, nav — stays quiet
--rule        rgba(255,255,255,0.15)   `DrawnRule` only — the lines you are meant to watch arrive
--scrim       rgba(4,4,4,0.97)         the lightbox backdrop, deliberately darker than the page
```

Three greys and one blue. The `--accent` / `--accent-text` split is the load-
bearing rule in that table: the brand blue is *under* the 4.5:1 floor on this
background, so it may never carry a word. Reach for `--accent-text` the moment
the blue thing is read rather than seen.

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

Everything from here to the Animations heading below used to describe a
different site: a `#2b2b2b` page with an `#fbfbfb` surface, Domine and IBM
Plex, gradient pill tags, `rounded-xl` cards with `shadow-lg`. None of those
values, fonts or classes exist anywhere in `app/` — they were checked, and
every one of them appeared only in this file. A conventions doc that mandates a
design the code does not have is worse than no doc: it is a defect generator,
and it demonstrably generated defects (see the `OrbitStage` note under
Animations). What follows is what the code actually does.

**Surfaces are defined by a hairline, not by a fill.** There is no card
component and no elevation system. A region is separated from the page by a 1px
`border-border` edge, a `DrawnRule`, or nothing at all — never by a shadow, and
never by a corner radius above `rounded-sm`. `--card` (`#0e0e0e`) exists for
the few surfaces that need to sit a shade off the page; it is 3 steps of
lightness away from `--bg`, and that is the whole range the design uses.
`shadow-*` appears nowhere. Do not introduce it.

**Skill tags are text, not chips.** `ProjectSkills` sets each skill as a list
item prefixed by a `/` divider drawn with `before:content-['/']` in `--dim2`,
at `--text-meta` with `--track-text-sm`. No background, no border, no radius,
no hover scale. The gradient-pill string this file used to mandate "everywhere
for consistency" also carried `transition-all` and `hover:scale-105`, neither
of which the design permits.

**Typography goes through the scale in `globals.css`, never through a class
recipe.** The display tiers and the four text roles are tabulated under
Styling above; a component references the role it needs. Colour is
`text-fg` / `text-dim` / `text-dim2` — three deliberate steps, all of which
clear 4.5:1 on `--bg`. Never dim text with an opacity modifier: `text-dim` is
a colour chosen for contrast, `text-fg/70` is a guess at one.

**Bullet points** (in lists)
```
<span aria-hidden="true" className="mt-[0.65rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/50" />
```
Parent `<li>` uses `flex items-start gap-2.5` — never `items-center` or
`self-center` on the dot, which misaligns it on wrapped lines. The dot is
decorative, so it is `aria-hidden`. This used to read `bg-primary/50`, and
`--color-primary` was kept in `@theme` purely as an alias so that this line
stayed technically true; the alias is gone and the one callsite now names the
colour the design actually has. There is exactly one blue.

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
`active`, and `BeatBars` sits still because `useAudioAnalyser` never starts its
frame loop. Check the provider before adding a branch.

`LoadingScreen` is the exception that reads the preference directly, via
motion's own `useReducedMotion` rather than `useMotionPreference()`: it gates
first paint, so it runs before the provider it would otherwise consume. It
mounts `OrbitStage` at `scale={2.1}` and shares `RELEASE_MS` with it so the
backdrop and the orbit dissolve on the same frame. This paragraph previously
claimed `OrbitStage` was never mounted and that the loader substituted a plain
backdrop; that was false, and two separate reviewers went on to file its live
`boxShadow` as dead code on the strength of it. A wrong comment costs more than
a missing one.

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

**The background belongs to `WaveField`, and nothing else may compete for it.**
The site has exactly one continuous ambient motion: the wave canvas behind every
route. It is the piece that carries the site's character, and it works because
it is alone back there — a second animated layer in the same visual plane reads
as clutter over it, no matter how quiet that layer is on its own.

This is not a preference, it is a settled decision with a cost attached. An
earlier version added a whole drawn-line system behind the content: full-height
vertical construction lines (`DraftingGrid`) and a layer of self-tracing SVG
draughtsman's figures (`SchematicLayer` — compass arcs, axonometric boxes,
hatching, dimension lines) whose `stroke-dashoffset` was bound to scroll. Every
piece of it measured correctly and it was still wrong: two independent line
systems in one background fight each other, and figures with no relationship to
the content read exactly as what they were — random shapes. It was deleted, along
with GSAP. Do not rebuild it. If a surface needs more presence, get it from
typography, spacing, or the content itself, never from a second ambient layer.

What remains, and is enough:

1. **Entrances come off one BPM-92 grid.** `beats()` from `app/lib/tempo.ts`,
   `EASE_OUT` / the springs from `app/lib/motion.ts`. No component invents its
   own duration.
2. **Rules draw, they never fade, and the draw is meant to be seen.**
   `DrawnRule` scales a 1px line from an origin, on its own `--rule` token at
   0.15 alpha — brighter than `--border` (0.07), which stays quiet for card
   edges, inputs and the nav. Three values have been tried: 0.07 was invisible,
   0.2 read as loud, but only while a second drawn-line system was competing
   with it. With the rules alone, 0.15 is where the draw is legible and the
   dividers still don't take over.
3. **Rules draw where the reader can watch them.** `DrawnRule` observes with a
   negative bottom margin (`-240px`), starting its 0.8s draw at roughly
   three-quarters of a laptop viewport rather than at the bottom edge where it
   would complete unseen. Rows and cards keep their established, independent
   observer margins: structural rules and content do not need to land in
   lockstep, and those values must not be “tidied” into one shared constant.
   The `240px` lead is deliberately `px`, not `%`: percentage root margins
   resolve against the root's width, which is meaningless for a vertical lead.
   A rule within that lead distance of the end of the document cannot ever
   enter the observer band at maximum scroll. `DrawnRule` detects that rare
   case on mount and resize, then renders it immediately rather than leaving a
   missing separator. Do not add a `ResizeObserver` per rule; static image
   imports reserve their aspect ratios, and the window resize pass is enough.
   On `/builds`, the opening rule and per-project rules alone break out through
   the page padding to match the full-bleed experience dividers; never put
   those negative margins on `ProjectCard` itself because its grid's image edge
   is aligned to the page centre stop.
4. **Intricate, not flashy.** `WaveField` is the benchmark: a great deal of
   coordination underneath, deliberately quiet on the surface. The spectacle
   comes from how many parts move in agreement, never from brightness.

**No pinned scroll sequences.** There were two — a `WorkCycle` "Selected work"
section and an `ExperienceCycle` that held the history on screen while the roles
cycled. Both are gone. Pinning fights the wave canvas for the same scroll and,
more simply, it made the page feel like it was jumping around: the reader scrolls
and the section refuses to move, which reads as a broken page rather than as an
effect, and no amount of correct measurement fixes that impression. `/`'s
Experience section is an ordinary scrolling section (`ExperienceList`), and
that is the right answer. Scroll may *affect* motion — `GridIndex` and the hero
accent lines already do — but it must never take the wheel.

Each surface expresses its own reveal according to what its content actually is,
rather than repeating one entrance: on `/builds` the rule LEADS and the row's
content follows in its wake (`beats(0.15)` behind); on `/lens` the contact sheet
DEVELOPS via a `clip-path` wipe travelling in reading order with a slight scale
settle, because a contact sheet develops; on `/music` the accent moves from a
playing row's rule down into the transport's hairline, which is visually the
same line; on `/reach` a focused field's underline draws from the caret side and
retracts the same way; on `/` the history builds as a spine, the date column
leading its prose. Adding a generic fade-and-rise to a new section is the one
thing that would cheapen all of it.

`DrawnRule` takes `className` for layout and **`ruleClassName` for anything that
paints the line** (a state colour like `!bg-accent`). They are separate because
with `accent` the wrapper is not the line, so a `bg-*` in `className` would tint
the box behind the rule and silently do nothing.

Two traps worth keeping in mind, both measured and fixed rather than theorised:
a scroll-triggered reveal needs `viewport={{ once: true, margin: "100000px 0px
-6% 0px" }}` — the huge top margin makes "the reader already scrolled past this"
count as seen, without which skipped rows stay at `opacity: 0` permanently, and
a bottom band larger than about `-6%` leaves rules at the document's end that
can never fire. And a transform that travels outside its container still creates
scrollable overflow: the accent segment needed `overflow-hidden` on its wrapper
or every struck page gained ~250px of horizontal scroll.

**Experience data ordering** — most recent first in `experience.ts`.
