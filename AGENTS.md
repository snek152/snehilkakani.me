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
- **`dynamic()`** imports with `Suspense` + `<LoadingSpinner>` fallback for heavy components (e.g., `AboutCard`, `AllProjects`)
- **`react-intersection-observer`** for scroll-triggered entrance animations via Framer Motion (`motion` package)
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

Fonts: IBM Plex Sans (`--gfont-ibm`, default) and Domine (`--gfont-domine`, serif accents) loaded from Google Fonts.

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

**Animations** — standard entrance pattern, via the shared `Reveal` component
(`app/lib/components/shared/Reveal.tsx`):
```tsx
<Reveal>{children}</Reveal>
// equivalent to:
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.3 }}
transition={{ duration: beats(0.75), ease: EASE_OUT }}
```
`EASE_OUT` and `beats()` come from `app/lib/motion.ts` and `app/lib/tempo.ts` — a
single BPM-92 timing grid (`app/lib/tempo.ts`) every entrance duration derives
from, instead of components picking their own numbers in isolation. The shared
`fadeUp`/`staggerContainer` variants in `app/lib/motion.ts` follow the same
values for cases that need raw `variants` (e.g. a `motion.button` inside a
`.map()`) rather than `Reveal`'s wrapper-div shape. Always respect
`useMotionPreference()` (from `app/lib/components/shared/MotionPreference.tsx`)
for reduced-motion users — `Reveal` and the shared hooks already do this
internally.

**Experience data ordering** — most recent first in `experience.ts`.
