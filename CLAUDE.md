# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
| `/` | `app/page.tsx` | Home — about card + experience |
| `/projects` | `app/projects/page.tsx` | Project grid + skills sidebar |
| `/music` | `app/music/page.tsx` | Beat player (wavesurfer.js) |
| `/gallery` | `app/gallery/page.tsx` | Photography portfolio |
| `/contact` | `app/contact/page.tsx` | Contact form |
| `/meta` | `app/meta/page.tsx` | Metadata/about page |

### Data Layer

All content lives in TypeScript files under `app/lib/data/`. To add or edit portfolio content, edit these files — **no CMS, no API, no markdown**:

- `projects.ts` — `Project[]` with title, description, image, skills, links
- `experience.ts` — `Experience[]` with company, role, period, bullets
- `beats.ts` — `Beat[]` with audio file path, BPM, key, streaming links
- `skills.ts` — skill objects with icon (from `@icons-pack/react-simple-icons`), label, colorClass, type
- `photos.ts` — photo metadata with EXIF-style fields (aperture, ISO, etc.)
- `navlinks.ts` — navigation items with icon pairs (outline/solid)

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

**Animations** — standard entrance pattern:
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
```
Use `whileInView` (not `animate`) for scroll-triggered elements. Always `viewport={{ once: true }}`.

**Experience data ordering** — most recent first in `experience.ts`.
