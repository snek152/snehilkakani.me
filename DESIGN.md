---
name: Instrument Panel
description: A near-black, hairline-ruled engineering surface for a software/music/photography portfolio — one continuous ambient field behind flat, orthogonal UI, timed to a BPM-92 grid.
colors:
  bg: "#080808"
  card: "#0e0e0e"
  fg: "#efefef"
  dim: "#a8a8a8"
  dim2: "#7d7d7d"
  accent: "#2563eb"
  accentText: "#4478ee"
  border: "rgba(255, 255, 255, 0.07)"
  rule: "rgba(255, 255, 255, 0.15)"
  scrim: "rgba(4, 4, 4, 0.86)"
  seamLensStart: "#5575d9"
  seamLensEnd: "#8b66c9"
typography:
  display: "{typography.clashDisplay}"
  sans: "{typography.switzer}"
  displayXl: "clamp(3.2rem, 8.5vw, 7.4rem)"
  displayLg: "clamp(2.5rem, 5vw, 4rem)"
  displayMd: "clamp(1.5rem, 2.2vw, 1.85rem)"
  displaySm: "clamp(0.95rem, 1.1vw, 1.15rem)"
  lead: "1.0625rem"
  body: "1rem"
  meta: "0.875rem"
  micro: "0.8125rem"
rounded:
  max: "sm"
spacing:
  railThin: "52px"
  railFull: "176px"
components:
  borderedControl:
    backgroundColor: transparent
    textColor: "{colors.dim}"
    typography: "{typography.meta}"
    rounded: none
    padding: "0.45rem 0.875rem"
  input:
    backgroundColor: transparent
    textColor: "{colors.fg}"
    typography: "{typography.body}"
    rounded: none
  transport:
    backgroundColor: "rgb(8 8 8 / 0.95)"
    textColor: "{colors.fg}"
    typography: "{typography.meta}"
    rounded: none
  skillTag:
    backgroundColor: transparent
    textColor: "{colors.dim}"
    typography: "{typography.meta}"
    rounded: none
---

## Overview

**"Instrument panel"**: a near-black engineering surface, hairline-ruled, that reads like the flat, orthogonal chrome around a piece of equipment rather than a stack of paper cards. One continuous ambient field (`WaveField`) breathes behind it — the only thing in the whole interface that has depth, perspective, or blur — and everything sitting in front of it is deliberately flat: opacity, `y`, `scaleX/Y`, `clipPath`. Every reveal, stagger, and transport pulse is timed off a single BPM-92 grid instead of a component's own guessed duration, a quiet structural nod to the site's music-production half rather than a literal audio cue.

The density is high but never cramped: text sizes are a four-role scale (`lead`/`body`/`meta`/`micro`), not nine near-identical literals, and every prose block carries a measure cap so a line never runs past what an eye can track back from. Colour is rationed to three greys and one blue, and the blue itself is split by role — shapes get `--accent`, words get the brighter `--accent-text` — so restraint is enforced by contrast math, not taste alone.

Philosophically: nothing here is decoration for its own sake. A shadow exists only where it does a job a hairline cannot (a rail that must read as a panel, a fill that must read as charged). A rule draws instead of fading because the site is built out of hairlines and having them draw turns the page's own structure into the animation. Motion resolves out of defocus, echoing the one ambient system's own optical language, rather than sliding flat rectangles around.

**Key Characteristics:**
- **Flat and orthogonal in the foreground, volumetric in one background layer only** — `WaveField` is the sole place depth, blur, and continuous motion live.
- **Hairlines, not cards** — no elevation system, no corner radius above `rounded-sm`, no drop shadow standing in for depth.
- **Three greys, one blue, split by role** — `--accent` for shapes, `--accent-text` for words, enforced by measured contrast ratios.
- **One shared timing grid** — `beats()` off BPM 92, not per-component durations.
- **Depth by defocus** — surfaces recede by going soft, never by going dark or gaining a shadow.

**Confirmed anti-references** — both were built, measured, and deliberately deleted; do not reintroduce either:
- The earlier `#2b2b2b` page with an `#fbfbfb` surface, Domine and IBM Plex, gradient-pill skill tags, `rounded-xl` cards with `shadow-lg`. None of it exists in the codebase.
- A second ambient animated layer behind the content — full-height `DraftingGrid` construction lines plus a `SchematicLayer` of scroll-bound draughtsman's figures (compass arcs, axonometric boxes, hatching), driven by GSAP. Two independent line systems fought each other and the figures had no relationship to the content. `WaveField` is the site's only continuous ambient motion; a second one is a defect, not an option.

## Colors

Three deliberate greys against near-black, plus exactly one blue, split by role so contrast is enforced rather than eyeballed.

### Primary

|Name|Value|Role|
|---|---|---|
|Accent (shapes)|`#2563eb`|Rules, fills, icons, focus rings — 3.87:1 on `--bg`, under the 4.5:1 text floor|
|Accent Text (words)|`#4478ee`|Anything read as words — 4.93:1 on `--bg`|
|Signal Light|`rgb(126 164 255)`|Non-text light on fine marks, source points, material edges — brighter than accent-text because no words rely on it|

### Neutral

|Name|Value|Role|
|---|---|---|
|Background|`#080808`|Page — the only background most of the site uses|
|Card|`#0e0e0e`|The few surfaces that need to sit one shade off the page; 3 steps of lightness from `--bg`, the whole range the design uses|
|Foreground|`#efefef`|17.42:1 — primary text|
|Dim|`#a8a8a8`|8.42:1 — secondary prose, metadata|
|Dim 2|`#7d7d7d`|4.87:1 — captions, dividers, recessive readouts|
|Border|`rgba(255,255,255,0.07)`|Card edges, inputs, nav — stays quiet|
|Rule|`rgba(255,255,255,0.15)`|`DrawnRule` only — the lines you are meant to watch arrive|
|Scrim|`rgba(4,4,4,0.86)`|Lightbox backdrop, deliberately darker than the page while leaving the contact sheet sharp|

### Material

Two stops that exist only inside gradient seams — never as a fill, never behind or as text.

|Name|Value|Role|
|---|---|---|
|Seam start|`#5575d9`|Left stop of `--seam-lens`, the coloured segment of the `/lens` header rule|
|Seam end|`#8b66c9`|Right stop of `--seam-lens`|

These two are pinned: they are the appearance the site's owner chose for that rule, and rebuilding them out of `--accent`/`--violet-rgb` shifts the hue. They live in `--seam-lens` so no callsite carries a literal hex. Do not sample them for anything else, and do not add a third stop.

**Named Rules:**

**The accent/accent-text split is load-bearing.** `#2563eb` on `#080808` is 3.87:1 — under the 4.5:1 text floor — so it is valid for shapes only: rules, fills, icons, focus rings. `#4478ee` is 4.93:1 and is required the moment the blue is read rather than seen. The brand blue may never carry a word.

**One blue in the interface.** The accent is the only blue any control, rule, icon, or word uses. The `--seam-lens` stops above are material inside one gradient, not interface colours — they name no state and carry no text. A former `--color-primary` alias existed only so a stale comment stayed technically true; it is gone.

**Never dim text with an opacity modifier.** `text-dim` and `text-dim2` are colours chosen to clear 4.5:1 on `--bg`; `text-fg/70` is a guess at one, not a measured value.

## Typography

Two self-hosted variable fonts from the Indian Type Foundry, loaded via `next/font/local` — never a CDN webfont, because the free Google catalogue is where every generated portfolio shops and its most-reached-for grotesques are why so many read alike. Sharing a foundry means the two faces sit together without being lookalikes.

- **Clash Display** (`--font-clash-display`, `font-display` token) — every display line. Variable axis **200–700**.
- **Switzer** (`--font-switzer`, `font-sans` token, document default) — body copy and all UI text. Variable axis **100–900**.
- **No mono, deliberately.** Numeric readouts (BPM, track durations, EXIF triplets, viewfinder captions) use `tabular-nums` on the sans instead of introducing a third voice.

Display tiers — one size token paired with the tracking token of the same suffix:

|Tier|Size|Tracking|Weight|Used for|
|---|---|---|---|---|
|XL|`clamp(3.2rem, 8.5vw, 7.4rem)`|`-0.025em`|`font-bold`|Hero name lockup|
|LG|`clamp(2.5rem, 5vw, 4rem)`|`-0.02em`|`font-bold`|Full-page titles (all four routes)|
|MD|`clamp(1.5rem, 2.2vw, 1.85rem)`|`-0.012em`|`font-semibold`|Card + section headings|
|SM|`clamp(0.95rem, 1.1vw, 1.15rem)`|`0em`|`font-semibold`|Small display labels (index labels, role cycler)|

Text roles — four sizes, no others:

|Role|Size|Used for|
|---|---|---|
|Lead|`1.0625rem`|The one intro paragraph per page|
|Body|`1rem`|Prose: descriptions, bullets, running copy|
|Meta|`0.875rem`|Metadata, labels, captions, nav, buttons, EXIF readouts|
|Micro|`0.8125rem`|Dense readouts: transport clock, notices|

Leading rises with measure — `--leading-lead` 1.75, `--leading-body` 1.7 — because light text on near-black needs the extra step to stop lines closing up. Measure caps hold at any font size or zoom level: `--measure-lead` 56ch, `--measure-body` 66ch. Prose without a cap is a bug.

**Small dim text on this near-black surface gets `--track-text-sm` (+0.01em).** Any element at Meta or Micro size coloured `text-dim`/`text-dim2` takes it. Uppercase micro-labels keep their own positive `0.08em` instead, and `text-fg` text takes neither.

**Named Rule: every display tier is a `clamp()`, so a heading is the same size on every route at every width.** Adding an `sm:`/`lg:` size step to a display element is a defect — the token already scales.

**Named Rule: Clash Display's variable axis tops out at 700.** There is no 800, so the display tiers top out at `font-bold`; a `font-extrabold` class on a display element is browser-synthesized, not rendered. Do not reintroduce one.

**The compact, layered `152` Home mark is a shared `app/icon.png` asset.** It
appears in the desktop rail, mobile header and favicon at their native scales.

## Layout

The page shell is `flex min-h-[100dvh] flex-col lg:pl-[52px]` — the `52px` offset is the sidebar rail's collapsed (thin) width, so content clears it on desktop without the rail itself needing to reflow anything on hover. `main` is `flex-1`. On a viewport taller than the content, the resulting space above the footer is the expected sticky-footer stretch, not a spacing defect to chase.

Breakpoints follow a single-cutoff model: `lg` is the one cutoff that switches the nav between a vertical sidebar (desktop) and a top bar (mobile); `sm`/`md` scale content padding and grid columns within either nav mode. Route containers commonly step padding as `px-6 sm:px-8 lg:px-12`.

Rail widths: collapsed `52px`, expanded `176px` — the extra `124px` sits entirely on top of the page (never reflows it) and is why the expanded rail needs `data-material` plus a real directional shadow to read as a panel rather than a wider strip of background.

## Elevation & Depth

**There is no elevation system and no card component.** A surface is separated from the page by a 1px `border-border` hairline, a `DrawnRule`, or nothing — never by a drop shadow standing in for depth, and never by a corner radius above `rounded-sm`. `--card` (`#0e0e0e`) exists only for the few surfaces that need to sit one shade off the page.

Depth in this design is expressed by **defocus**, never by drop shadow: `WaveField` recedes by going soft, not dark, and the interface says depth the same way — a surface that needs to sit behind another is blurred, not shadowed.

Four legitimate shadow uses exist and each does a job a hairline cannot; nothing else is permitted:

- **`Sidebar`'s expanded-rail shadow** — `6px 0 28px -8px rgba(0,0,0,0.85)`, a real directional shadow so the expanded rail reads as a panel floating over the page rather than a wider strip of the same background.
- **`ScrollProgressRail`'s accent bloom** — `0 0 20px 2px var(--color-accent)` on the fill, so the scroll indicator reads as charged, not flat.
- **`OrbitStage`'s accent ring** — `0 0 0 1px rgb(var(--accent-rgb) / 0.18)`, a 1px zero-blur ring around the loader's orbit node.
- **`SignalRule`'s downward accent bloom** — a real offset plus blur (`0 6px 14px -7px rgb(var(--accent-rgb) / 0.14 or 0.26)`), explicitly not a zero-offset halo. A zero-offset glow is decoration; this one has a direction, so it reads as light falling rather than a sticker.

`Lightbox` uses `--scrim` at `0.86` (not the `0.97` it started at) without a backdrop blur: the dimmed contact sheet remains visible and sharp, so it reads as context rather than as a failed image load. The opened photo stays dominant without being isolated on a black card.

## Shapes

Corner radius never exceeds `rounded-sm` anywhere in the design — no `rounded-lg`, `rounded-xl`, or pill shapes.

Hairlines carry three brightness levels, each scoped to a distinct job:

- **`--border`** (`rgba(255,255,255,0.07)`) — quiet edges: card borders, inputs, nav. Deliberately dim; it is not meant to be watched.
- **`--rule`** (`rgba(255,255,255,0.15)`) — `DrawnRule` only, the lines meant to be watched arrive. `0.07` was invisible when animated; `0.2` read as loud (while a second drawn-line system was still competing with it); `0.15` is where the draw is legible without the dividers taking over the page.

`RouteSignal` draws a per-route geometric mark — a distinct SVG path, seam gradient, and terminal dot per route (`home`, `builds`, `music`, `lens`, `reach`) — as a small self-tracing signature rather than a shared generic icon.

## Components

**Bordered control** (`BORDERED_CONTROL`, `app/lib/components/shared/controls.ts`) — the pill-free bordered button used for the Résumé download and the Reach confirmation actions. Border `border-border`, text `text-dim` rising to `text-fg` on hover, `active:scale-[0.97]` press (via the independent `scale` property, not `transform`, since Tailwind v4 compiles `scale-[...]` that way), and an explicit `focus-visible:outline-2 outline-accent` ring — a 1px border switching to `--accent` alone is not a real focus indicator at 3.87:1.

**Inputs** (`ContactForm`'s `Field`) — no visible box; the input's own bottom border is the rule. On focus, that same rule turns solid accent blue. Errors render at full-contrast `text-fg`, never a semantic red — the palette is three greys and one blue, and a semantic colour introduced for three error strings would be a new design decision, not a fix. The problem is carried by the words, position, and `aria-invalid`, never by hue alone.

**Nav (`Sidebar`)** — collapsed `52px` rail, expands to `176px` on hover via `SPRING_UI`. Collapses on every route change (`onNavigate` alone did not survive a click-through). Expanded state carries `data-material` (blur + opaque/high-contrast fallbacks from `globals.css`) plus the one directional shadow in the system, because a translucent slab the same colour as the page otherwise reads as the title being truncated rather than overlapped.

**Drawn rules** (`DrawnRule`, `SignalRule`) — a hairline that draws itself across as it enters view rather than fading, because the site is built almost entirely out of 1px rules and having each one draw turns the page's own structure into the animation. `DrawnRule` starts its draw `240px` above the fold (roughly 73% of a laptop viewport) so the ~0.8s draw finishes where the reader is actually looking, not in an unseen strip at the bottom. `SignalRule` is the header-scale relative — a quiet border with the same restrained blue cast as the transport, distinct from `DrawnRule`'s content-row role.

**Skill tags as text** (`ProjectSkills`) — a `/`-prefixed list item in `--dim2` at Body size with `--track-text-sm`. No background, no border, no radius, no hover scale — never a gradient-pill chip.

**Gallery cell** (`GalleryCell`) — the image box is sized in exact pixels from the justified grid's row packing, always its true aspect ratio. No hover zoom, no corner ticks, and no visual caption; only the aligned EXIF readout sits beneath the frame.

**Lightbox** — `--scrim` at `0.86` without backdrop blur, `data-material` for the transparency/contrast overrides. Drag-to-dismiss tracks the pointer 1:1 downward (`project()` commits on projected rest + velocity sign, never raw distance); upward has nothing behind it, so that is where `rubberband()` resistance goes.

**Transport (`PlayerBar`)** — the site's one signature component and its one persistent translucent surface (`data-material`, `bg-bg/95 backdrop-blur-xl`). Not a media-player slab: it reuses the page's own container padding and the track list's column grid, so the now-playing row sits column-for-column under the list it came from. Its top hairline *is* the progress rule — the same 1px border every row uses, filling with accent as the track plays; there is no separate scrubber floating above it. While a track plays, the signal-line fill breathes at *that track's own tempo*, not the page's BPM-92 grid — the one flourish scoped entirely inside the player.

## Do's and Don'ts

- **Do** use `text-dim` / `text-dim2` for de-emphasis. **Don't** dim text with an opacity modifier — `text-fg/70` is a guess at contrast, not a measured value.
- **Do** keep `WaveField` as the sole continuous ambient layer. **Don't** add a second animated background system, however quiet it looks in isolation — two line systems in one plane fight each other.
- **Do** separate surfaces with a hairline (`--border`, `--rule`) or nothing. **Don't** use a shadow as card elevation — the only legitimate shadows are the four named ones (`Sidebar` rail, `ScrollProgressRail` bloom, `OrbitStage` ring, `SignalRule` bloom).
- **Do** use `--accent` for shapes and `--accent-text` for words. **Don't** ever let `--accent` (`#2563eb`, 3.87:1) carry a word — it fails the 4.5:1 text floor.
- **Do** hold the type scale to four text roles and four display tiers, all sourced from `globals.css` tokens. **Don't** introduce a fifth text size or hand-pick a literal like `text-[0.93rem]` at a callsite — that is the defect the current scale replaced.
- **Do** reference the shared timing grid (`beats()`, `EASE_OUT`, the named springs). **Don't** invent a new per-component duration.
- **Do** let a section heading stand alone. **Don't** reintroduce a kicker/eyebrow label above a heading.
- **Do** cap corner radius at `rounded-sm`. **Don't** reach for `rounded-lg`/`rounded-xl` or a gradient-pill tag — that is the deleted era's vocabulary.
