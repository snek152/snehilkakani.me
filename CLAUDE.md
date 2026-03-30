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
