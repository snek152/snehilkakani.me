# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

This codebase carries no code comments, by decision — engineering rationale,
rejected alternatives and measured numbers live here and in `DESIGN.md`
instead. If you learn something about the code worth remembering, write it
into one of these two files rather than back into a comment.

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
`border-border` edge, a `DrawnRule`, or nothing at all — never by a drop shadow
standing in for depth, and never by a corner radius above `rounded-sm`.
`--card` (`#0e0e0e`) exists for the few surfaces that need to sit a shade off
the page; it is 3 steps of lightness away from `--bg`, and that is the whole
range the design uses.

Three shadow values exist and all three are doing a job no hairline can, so
the earlier flat claim that "`shadow-*` appears nowhere" was simply false —
it was written from the convention rather than from the code. What is banned
is a shadow used as *elevation on a card*. What exists: `Sidebar`'s expanded
rail casts a real directional shadow so it reads as a panel over the page
rather than a wider strip of it; `ScrollProgressRail`'s fill carries an accent
bloom; `OrbitStage`'s node carries a 1px accent ring. Depth in this design is
expressed by DEFOCUS, not by drop shadow — see the Light section below.

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
<span aria-hidden="true" className="mt-[0.65rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-fg/40" />
```
Parent `<li>` uses `flex items-start gap-2.5` — never `items-center` or
`self-center` on the dot, which misaligns it on wrapped lines. The dot is
decorative, so it is `aria-hidden`. This used to read `bg-primary/50`, and
`--color-primary` was kept in `@theme` purely as an alias so that this line
stayed technically true; the alias is gone. The colour has since moved again
— `ExperienceList` (the one caller) now renders the dot at `bg-fg/40`, not
`bg-accent/50` — so this line is corrected to match the code rather than the
other way around.

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
from wherever the value currently is. `app/lib/motion.ts` exports two, in
Apple's two-parameter form (`bounce` is the damping ratio inverted, `duration`
is the response — how fast it reaches the target, not how long it may take):

|Spring|Values|For|
|---|---|---|
|`SPRING_UI`|`bounce 0`, `0.4`|chrome that repositions: the sidebar rail, panels|
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

**One ambient system only.** `WaveField` is the site's volumetric, flowing
background and its sole continuous animation. It carries the depth — curves
recede by going soft, not dark — without becoming a second set of interface
rules. Make the field perceptible by widening its soft bloom, never by
brightening its sharp core or adding a new moving layer above it.

`CursorGlow` is not ambience. It is precise-pointer feedback: it mounts only
after `CursorField` reports an active cursor, tracks that cursor, and disappears
for touch and reduced-motion visitors. Keep it local and input-driven; do not
give it an idle position, autonomous drift, or audio-reactive scale.

**Depth is expressed by defocus, never by a drop shadow.** `WaveField` recedes
by going soft, not dark. The interface now says depth the same way: `Lightbox`
pairs `--scrim` at `0.86` with an 18px `backdrop-blur`, so the contact sheet
behind an opened photograph is still THERE, pushed back, instead of being
erased by a near-opaque card at `0.97`. The scrim carries `data-material`, so
`prefers-reduced-transparency` swaps the blur for an opaque `--bg` through the
existing override rather than a second code path. If a surface needs to sit
behind another, defocus it.

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

## Implementation Notes

This section is where the reasoning that used to live in code comments went
when the comments were deleted. Same rule as everywhere else in this file:
every number here was read from the source, not estimated.

### Shell, routing, and the fixed transport

- `PlayerBar` renders through `createPortal` into `document.body`, and must.
  `template.tsx` animates each route's `clip-path` from `inset(0 100% 0 0%)`
  (or the mirror, depending on direction) to `inset(0 0% 0 0%)`. A `clip-path`
  clips every descendant including `position: fixed` ones, and the wrapper's
  box ends where the page content ends — rendered in place, the transport was
  clipped out of existence (not painted, not hit-testable) the moment the
  footer owned the bottom of the window. Three fixes were tried and rejected:
  dropping `clipPath` from the animation target (motion falls back to
  rendering `initial`, which clips the whole route away), overriding the clip
  via `style` (motion writes animated values imperatively after React's
  commit and wins), and animating to `none` (not interpolatable, so it is
  ignored and the settled inset stays). The rule that follows is structural:
  any other `position: fixed` UI mounted inside a route must portal out too.
  The portal reproduces its in-page layering with `z-30` — above the `z-0`
  fixed backdrops, below the scroll rail and the sidebar.
- `Footer` takes a `bottomReserve` prop (in px) rather than relying on a
  sibling spacer for the transport's footprint — a spacer made the document
  taller than the footer's own background, so max scroll ended in a band of
  empty page below the footer. `AppShell`'s `FooterWithClearance` derives the
  value from `useMusicPlayer().activeIndex` and passes `TRANSPORT_CLEARANCE`
  (`64`, `AppShell.tsx`, exactly `PlayerBar`'s pinned height) whenever a track
  is loaded, on any route.
- `AppShell`'s nav `direction` (`1` forward / `-1` back / `0` initial or
  same-route, through `navItems`) is computed synchronously during render,
  not in an effect, so it is already in context by the time the incoming
  route's `template.tsx` reads its `initial` clip position. The tracking ref
  advances in a *following* `useEffect` — this render reads the OLD ref
  value, and the effect sets it for the NEXT navigation.

### The intro gate

- `loader-gate.ts` + `app/layout.tsx` + `globals.css`: the skip decision runs
  as a synchronous `<script>` in `<head>`, not a `useEffect`, because every
  route is statically prerendered and `LoadingScreen` ships inside that HTML
  as an opaque `fixed inset-0 z-[9999]` layer — the browser paints it before
  any JS runs, so an effect-based decision leaves a returning visitor
  watching the loader until hydration finishes. `LOADER_GATE_SCRIPT` reads
  the `lastVisitTimestamp` key from `localStorage` (wrapped in `try/catch`:
  Safari private mode throws on access rather than returning `null`) and, if
  within `LOADER_INTERVAL_MS` (24h), sets `data-loader-seen="1"` on `<html>`.
  `globals.css` keys `html[data-loader-seen="1"] [data-loader] { display:
  none; }` off that attribute — `display`, not `opacity`, because the layer
  must also stop swallowing the first click during hydration. The visit is
  stamped seen by `stampLoaderSeen()` when the intro actually *finishes*, not
  when it starts, so closing the tab mid-animation does not suppress it for
  a day.
- `suppressHydrationWarning` on `<html>` in `app/layout.tsx` is required, and
  scoped to exactly that element: the gate script sets `data-loader-seen`
  before React hydrates, so server and client legitimately disagree about
  that one attribute. Moving the flag to `<body>` or a wrapper stops it
  covering the attribute that actually differs.

### Audio

- `useAudioAnalyser`'s `ensureAnalyser()` must be called synchronously
  inside the real click handler that starts playback, before `audio.play()`
  — never from an effect reacting to state, which runs several hops (state
  update, re-render, commit) removed from the gesture and can leave the
  `AudioContext` suspended, silently muting playback once output is routed
  through it. It is safe to call on every play attempt because
  `createMediaElementSource` can only be called once ever per `<audio>`
  element; the context and node are created once and reused.
- `level` — one bass-weighted scalar (0–1, resting at a true `0` in
  silence) — is the single signal lighting both `CursorGlow` and
  `PlayerBar`'s bloom, and it lives on `MusicPlayerProvider` because the
  transport is what knows the signal. Silence must cost nothing. `bars`
  (the five-band meter) rests at a visible `0.12` instead, so the idle meter
  reads as a shape rather than a gap.
- Attack/release smoothing on `level` is deliberately asymmetric (`ATTACK
  0.5`, `RELEASE 0.075`) so it reads as light glowing and fading rather than
  a twitching meter; equal attack and release reads as a gauge.
- `toggleTrack` branches on `playbackState`, not `audio.paused`: while a
  track is `loading`, `play()` has already fired but `audio.paused` can
  still read `true` until the browser actually produces frames. Branching on
  it made a button showing "Pause" fall into the play branch and restart the
  same load instead of cancelling it.
- `formatTime` (`format.ts`) returns `--:--` for any value `<= 0`, correct
  for an unknown duration and wrong for a playhead at rest. `PlayerBar`
  special-cases `currentTime > 0 ? formatTime(currentTime) : "0:00"` for the
  elapsed label so a track sitting at the start reads `0:00`, not `--:--`.

### Gallery and lightbox

- `Lightbox` preloads neighbours by rendering them hidden through the same
  `next/image` props the visible image uses (`loading="eager"` — the default
  is lazy, and a zero-opacity offscreen image is never fetched), not by
  warming the raw file URL. `next/image` actually requests
  `/_next/image?url=%2Fphotos%2Ffoo.jpg&w=...&q=75`; warming
  `/photos/foo.jpg` downloads the untouched original — up to 4.6MB in this
  gallery — competing for bandwidth with the image actually being displayed,
  and warms a URL the lightbox never requests.
- `Lightbox` uses a manual dual-layer crossfade (old frame stays opaque
  underneath, new frame mounts and fades in over it, old layer is dropped)
  instead of a nested `AnimatePresence`, because a nested `AnimatePresence`
  previously stalled the *outer* dialog's own exit — its `onExitComplete`
  never fired.
- `Lightbox` implements its own Tab focus trap because it is a portal-less
  overlay stacked on top of the page, unlike `PlayerBar`; without it, Tab
  walks straight into the page content behind the dialog.
- `getPhotoDims` (`photo-dims.ts`) throws at render on a missing entry
  rather than handing `next/image` a fallback size, which would reintroduce
  layout shift or a distorted aspect ratio for that cell. Regenerate
  `photo-dims.generated.ts` with `npm run gen:dims` after adding or removing
  photos.
- `JustifiedGrid` seeds its width synchronously via
  `el.getBoundingClientRect().width` before installing its
  `ResizeObserver`, because the observer only guarantees a callback when it
  has an observation to report — mounted inside a route already at final
  size (as `template.tsx`'s transition layer does), the first callback never
  arrives, width stays `0`, and the grid packs zero rows.
- `GalleryCell` has no viewfinder corner ticks: they were previously driven
  from React state, and the browser restoring focus to the cell's button
  when the lightbox closed fired `onFocus` and left the corner marks stuck
  on with the pointer nowhere near it. The caption lift (dim to full weight)
  is pure CSS instead, so there is no interaction state left to get stuck.
- `Lightbox` drag commit reads velocity from a short rolling history of the
  last few pointer samples, not total distance over total gesture time —
  that is what lets a slow long drag fail to commit while a fast short flick
  commits. Release velocity feeds `project(velocity)` (see Durations vs.
  springs above) to decide the projected rest position.

### Forms

- `mailto.ts`'s `buildMailtoUrl` handoff is declined outright above
  `MAILTO_MAX_SAFE_LENGTH` (`1900`) rather than attempted truncated. Real
  `mailto:` URL caps sit around 2048–2083 characters depending on OS/client;
  1900 leaves headroom under the lowest of them. Past the limit the draft
  opens silently truncated or not at all, and because the handoff is
  undetectable either way, `ContactForm` declines it entirely rather than
  telling the visitor "your mail app should have opened" about text that was
  quietly cut in half.
- `ContactForm.submit` only treats a `res.ok` response from
  `NEXT_PUBLIC_CONTACT_ENDPOINT` as delivered — a resolved `fetch` proves
  the request completed, not that the server accepted it, and a 500 that
  reported success would be exactly the lie the mailto path exists to avoid.
  The draft (name, email, message) is never cleared on either the success or
  failure path; it stays in state so the confirmation screen can show it
  back or offer it as a copyable fallback.
- Field validation runs on submit, and on blur of a field the visitor
  actually filled in — never per keystroke, which is nagging, and never on
  blur of a field left empty (that is the submit gate's job, not a reason to
  nag someone who hasn't reached it yet). Any edit clears that field's error
  immediately via `clearError`.

### Accessibility mechanics

- Two hit-slop extenders use an absolutely-positioned, contentful
  `::before` to grow the tap target without resizing the visible element or
  shifting the row: `Footer`'s icon+label links use `before:-inset-2` (8px a
  side) on a `gap-5` (20px) floor, leaving 4px of clearance between adjacent
  hit areas; `ProjectMeta`'s `ICON_LINK_CLASS` uses `before:-inset-1` (4px a
  side, lifting a 19×19 icon to a 27×27 target, clearing the WCAG 2.5.8
  24×24 floor) on a `gap-3.5` (14px) floor, leaving 6px of clearance. Both
  use opacity, not a transform, as the press signal — a transform would
  scale the `::before` extender along with the element and shrink the
  target at the exact moment a thumb is pressing it.
- `PlayerBar`'s skip buttons use `before:-inset-3.5` (14px, a 44px target
  around a 16px icon) at rest and `before:-inset-4.5` (a 52px box) at
  `active:scale-90`: 52 × 0.9 = 46.8px, which keeps the target over the 44px
  floor for the whole press, so a tap started at the edge cannot slip
  outside it before release.
- `RoleCycle` exposes the full, comma-joined role list once, statically, in
  an `sr-only` span, and never `aria-live` (which would re-announce it every
  `HOLD_MS`). Two earlier approaches failed: a single `aria-live="off"` node
  holding the churning glyphs stopped the churn being *announced* but still
  left mid-decode glyphs as the text a reader landed on; exposing only
  `ROLES[index]` fixed that but lost the cycle itself — the site's central
  "range" claim.
- `ManifestoHeading` keeps the heading's real text in the DOM as an
  `sr-only` span rather than an `aria-label` over `&nbsp;`, because
  assistive tech takes an `h1`'s accessible name from its content, not an
  attribute alone.
- `useScrambleText`'s glyph set (`0123456789#%&*+=~<>/|`) is deliberately
  letter-free. An earlier 65%-alphabetic set (`A-Z0-9#%&*`) made a
  mid-decode word read as the same word MISSPELLED rather than assembling —
  caught in the wild as `Full-Stack Developer` rendering mid-decode as
  "Full-Stack Develoler" and the Experience heading as "V488rMC56L" — which
  reads as a typo on a page whose whole job is credibility. Its
  `decodedRef` is keyed to the decoded TEXT, not a boolean: a caller that
  holds `active` true while swapping `text` (a cycling label, not a
  one-shot reveal) got its first decode and then silently displayed the
  stale string forever against a bare "has started" flag.

### Motion details beyond the general rule

- `MusicPage`'s row stagger caps at `Math.min(position, 6) * beats(0.04)`.
  The previous grid (0.05-beat step, capped at ten) put `0.33s` between the
  first and last row landing, long enough to watch rows queue up; the
  smaller step and lower cap roughly halve the span to `0.16s`.
- `ExperienceList` rows keep their own `-6%` bottom `viewport` margin and
  deliberately do NOT match `DrawnRule`'s `240px` `DRAW_LEAD` — matching
  them would couple a structural rule to a content reveal just to force
  lockstep. The huge top margin (`100000px 0px -6% 0px`) fixes a measured
  bug: 10 skill chips invisible on desktop and 15 on mobile after jumping to
  the foot of the page.
- `ExperienceList` rows stagger in exactly two steps — the date column,
  then the company-plus-bullets column as one unit `beats(0.1)` behind it —
  not three; a third step (splitting heading from bullets) reads as a
  cascade rather than "when, then what".
- `DrawnRule`'s `DRAW_LEAD` is `240` (px, deliberately not `%`: a percentage
  root margin resolves against the root's *width*, meaningless for a
  vertical lead), tuned from two rejected values: `-6%` (~54px, too low to
  be watched) and a positive `72px` (started the draw below the fold, so it
  finished before the rule ever appeared). A rule within `DRAW_LEAD` of the
  end of the document is detected on mount and resize and rendered simply
  present rather than stuck at `scaleX: 0` forever — measured as six
  permanently undrawn separators at the foot of `/music` before the
  fallback existed. Deliberately not a `ResizeObserver` per rule: static
  image imports already reserve their aspect ratio, so a window resize pass
  is enough.
- `OrbitStage` shares one fixed `RELEASE_MS` (`1000`ms) window across every
  staggered release element: each gets a start delay and a correspondingly
  shorter duration so all reach full dissolve on the same frame. Its
  spin-in-place release dropped an old `x: -110, y: 160` translation that
  used to ride along with the spin — the assembly travelled to an offset
  with nothing at it, ending a centred composition by sliding into open
  page; it now turns and closes in place.
- `Sidebar`'s mobile nav gap ramps via an inline
  `clamp(0.75rem, calc(0.75rem + (100vw - 320px) * 0.12), 1.5rem)` — 12px at
  320px up to 24px at 420px — with the middle term wrapped in `calc()` so no
  engine treats the bare arithmetic as unparseable and drops `gap` to
  `normal`. At a fixed 24px gap the five nav labels plus the `SK` wordmark
  overflowed the document by 8px at a 320px viewport.
- `Footer`'s icon+label row measures 341px and cannot fit inside the
  footer's 24px side padding until ~420px (45px past the document edge at
  320px). Below 420px the icons drop and the labels stay: the label names
  the destination, the icon is decoration, and decoration is what gives
  way. Label-only, the row is 193px.
- `fadeUp`'s entrance blur is the one non-compositor CSS property used
  anywhere outside the wave canvas, deliberately scoped to bounded,
  one-shot entrances and never to anything continuous or gesture-driven.

### Metadata and data ordering

- `routeMetadata()` (`app/lib/metadata.ts`) exists because a child
  segment's `metadata.openGraph` / `metadata.twitter` *replace* the
  parent's object outright rather than merging field by field — a route
  setting only `openGraph: { title, description }` silently drops
  `og:site_name` / `og:locale` / `og:type`, and one setting only
  `twitter: { title }` downgrades `twitter:card` from
  `summary_large_image` to `summary`. Verified against the running dev
  server, not assumed.
- Every route description is grounded in a data module and must be kept in
  step with it: `/builds` names the projects and the Innovation Quest 2nd
  place from `projects.ts`; `/lens` names the real shoot locations from
  `photos.ts`; `/music` deliberately carries no beat count, because the
  library grows and a hardcoded number goes stale; `/reach`'s "freelance
  web work" line is grounded in the live Freelance Website Developer entry
  (Jun 2021–Present) in `experience.ts`; the root title/description are
  grounded in `experience.ts`'s first (most recent) entry.
- `beats.ts`'s array order IS the running order on `/music` — nothing sorts
  at render. It is sequenced, not alphabetical (alphabetical order used to
  open on "Alien Trap" next to "Alien Trap 3", reading like a directory
  listing of variants), under three rules: no two adjacent entries share a
  `category`; the first five rows cover all five categories, so the top of
  the page demonstrates range before a visitor decides to keep scrolling;
  and name variants never sit adjacent while tempo swings between
  neighbours. `Ascension` leads deliberately, as the most immediately
  genre-legible entry (160 BPM). Reorder freely but keep the three rules —
  do not re-alphabetize.
- `RoleCycle`'s `ROLES` order is load-bearing: index 0 is what
  reduced-motion visitors see permanently and what a recruiter reads first,
  so an engineering title leads (`"Software Engineer"`); the rest are
  interleaved so no two non-engineering roles sit adjacent.
- Regenerate `photo-dims.generated.ts` with `npm run gen:dims`
  (`scripts/gen-photo-dims.mjs`) after adding or removing photos.
- `app/lib/nav.ts`'s `NavItem.end` marks the one route (`/`) that needs
  exact-match active state; every other route matches by prefix.
