# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository. Use it as your living runbook before touching any code.

## Project Overview

CorOS is an offline-first Progressive Web App that behaves like a "magical file system browser"—a spatial, avatar-driven digital garden where local markdown files become objects you can walk around. The app runs entirely on the client, renders an infinite orthographic canvas powered by React Three Fiber, and mirrors the user's directory using the File System Access API.

In this project we prioritise simplicity, modularity, and a clean separation between UI concerns (React/shadcn components) and logic (services, config, and types).

## Tech & Tooling Snapshot

- **Runtime stack**: React 19, TypeScript 5.8, Vite 7, Bun (use `bun` for every script)
- **3D canvas**: Three.js + React Three Fiber + drei helpers with custom GLSL shaders for the adaptive dot grid
- **UI system**: Tailwind CSS v4 (via `@tailwindcss/vite`), shadcn-generated primitives backed by Radix UI, Lucide icons
- **Content rendering**: `react-markdown` + `remark-gfm` for GitHub-flavoured markdown inside modal viewers
- **Persistence**: File System Access API for real files and IndexedDB for remembering directory handles
- **Polyfills**: `buffer` is shimmed globally (`window.Buffer`) and `global` is aliased to `globalThis` inside `vite.config.ts`

## Repository Layout

- `src/main.tsx` bootstraps React, injects the Buffer polyfill, and mounts `<App />`
- `src/App.tsx` renders the top-level `<Canvas />` component containing the entire 3D scene
- `src/components/` hosts scene primitives (Avatar, DotGrid, CameraRig, CanvasControls, MarkdownObject) plus UI bridges (DocumentViewer, FileSystemManager)
- `src/components/ui/` contains shadcn-style wrappers (button, card, dialog, scroll-area) generated from `components.json`
- `src/config/` + `src/types/` store strongly-typed configuration for zoom, lighting, grid, file metadata, etc.
- `src/services/` isolates browser APIs (`fileSystem.ts` for directory + markdown parsing, `persistence.ts` for IndexedDB handles)
- `src/shaders/` contains the GLSL dot-grid programs consumed via `?raw` imports
- `src/utils/` and `src/lib/` provide shared helpers (e.g., clamp, class merging)
- `test-space/` is a miniature workspace of markdown files with valid front matter for local smoke-testing
- Root-level `components.json`, `tailwind` config, and `bun.lock` capture design system and dependency state; never edit them manually unless regenerating UI primitives

## Key Architecture Principles

- **Offline-First**: Everything runs locally, state is persisted client-side
- **PWA Architecture**: Responsive layout, installable, with predictable asset pipeline
- **Infinite Canvas**: Smooth pan/zoom with orthographic projection and adaptive dot density
- **File System Integration**: Live view of the user's directory without server round-trips
- **Metadata Management**: Front matter (and future `.coros` indexes) store spatial data
- **Avatar-Based UX**: The user moves an avatar through space instead of clicking folders

## Core Content Primitives

- **Markdown Text**: Rendered and interactable today via `ReactMarkdown`
- **Images/Media**: Reserved for upcoming phases; keep APIs extensible
- **Directories**: Each file object maps one-to-one to a disk file inside the selected folder
- **Custom Objects**: Future extension point; maintain config-driven patterns for easy addition

## Runtime Architecture

### React entrypoint (`src/main.tsx`)
- Imports global styles (`src/index.css`), mounts `<App />`, and exposes `window.Buffer = Buffer` before any gray-matter parsing occurs
- Creates the React root in `#root` with `StrictMode` enabled

### Canvas pipeline (`src/components/Canvas.tsx`)
- Wraps `<Canvas />` from React Three Fiber (`@react-three/fiber`) to create a single orthographic scene
- Injects ambient + directional lighting from `CANVAS_CONFIG`
- Hosts the `CameraRig` (z-up pivoted rig at 45°), `DotGrid` shader plane, spinning `Avatar`, `FileSystemManager`, and imperative `CanvasControls`
- Manages `selectedFile` React state so clicking a MarkdownObject opens the modal viewer without leaking into scene controls

### Camera & controls
- `CameraRig` attaches the R3F orthographic camera to an invisible pivot, sets rotation (`Math.PI/4`) and default zoom, and keeps projection matrices in sync
- `CanvasControls` manually wires mouse events to pan (`cameraRig.position`) and zoom (`OrthographicCamera.zoom`) so we avoid orbit controls and can clamp ranges defined in `ZOOM_CONFIG`
- `DotGrid` streams custom GLSL shaders, keeping dots evenly spaced as zoom changes

### File system lifecycle
- `FileSystemManager` orchestrates directory selection, uses `requestDirectoryAccess()` to gate the File System Access API behind explicit user action, and displays neutral 3D boxes for loading/error states to keep UX consistent inside the scene
- `readMarkdownFiles()` iterates handles, parses YAML front matter with gray-matter, and only surfaces files that declare numeric `position.x/y`
- `persistence.ts` stores a serialized directory handle inside IndexedDB so the workspace reloads automatically after permission revalidation (`queryPermission`/`requestPermission`)

### Document presentation
- `DocumentViewer` uses the shadcn `Dialog` primitive to render markdown inside a `prose` container, with GitHub-flavoured markdown enabled via `remark-gfm`
- Closing the dialog routes through `onOpenChange` so controls regain pointer focus and the canvas remains interactive

## File System & Metadata Model

### Front matter contract
- Required: `position: { x: number, y: number }`
- Optional: `title?: string`, `visible?: boolean` (non-visible files should be filtered before rendering once that flag is used)

Example markdown file:
```markdown
---
position:
  x: 5
  y: 10
title: "My Note"
---

# Content here
```

Files lacking a valid position are ignored to avoid clutter at the origin. Keep YAML types strict—only numbers survive the filter.

### Directory persistence & permissions
- Store handles in IndexedDB (`coros-db` / `directory-handles`) keyed by `workspace-directory`
- On startup, call `loadDirectoryHandle()`; if `queryPermission` returns `prompt`, call `requestPermission({ mode: 'read' })` once and bail if the user declines
- Always gate `showDirectoryPicker` behind an explicit click, never on load

### Error & fallback UX
- Loading: render the indigo progress bar mesh so users know something's happening
- Errors: swap to the red status bar mesh and surface the message in console logs; do **not** spam dialogs
- No directory selected: show the neutral grey box inviting clicks; call `e.stopPropagation()` on all pointer handlers so camera controls never swallow the interaction
- If the File System Access API is unavailable (e.g., Firefox/Safari), throw a descriptive error early and display the neutral box with guidance

## UI System & Styling

- Tailwind CSS v4 drives theming via CSS custom properties defined in `src/index.css`; `@custom-variant dark` enables `.dark` scope without extra config
- `@tailwindcss/vite` plugin handles build-time extraction—do not revert to PostCSS configs
- `components/ui/*` are shadcn wrappers using Radix primitives; follow the `class-variance-authority` pattern and keep props typed
- `DocumentViewer` and any future overlays should stay inside these primitives to preserve accessibility contracts (focus traps, aria labels)
- Use `tailwind-merge` when composing class strings and prefer tokens defined in `index.css` for colors/radii

## Security & Compatibility

- File handles and contents never leave the browser; respect that by avoiding any network calls in services
- Only request permissions in response to user intent; once denied, surface a passive instruction rather than re-prompting
- When APIs are missing, display the neutral mesh plus copy telling the user their browser needs File System Access support; Safari and Firefox currently require alternative strategies (future work)
- `baseline-browser-mapping` is available if you need to detect capability gaps; prefer capability checks over UA sniffing
- Do not assume write access exists—everything currently runs read-only; future editing features must request `{ mode: 'readwrite' }` explicitly

## Technical Constraints & Solutions

- **Offline-first**: All persistence is local (File System Access + IndexedDB)
- **No external APIs**: Keep the bundle self-contained; avoid `fetch` unless mocked to local data
- **Performance**: Use shader-based grids and avoid per-frame allocations inside `useFrame`
- **Polyfills**: `buffer` + global aliasing already configured in Vite; do not remove them or gray-matter will break

## Development Commands

- `bun install` – install dependencies (prefer Bun over npm/pnpm)
- `bun run dev` – start Vite in dev mode (only run if no one else is already running it)
- `bun run build` – type-check and create a production build
- `bun run lint` – run ESLint across the repo
- `bun run preview` – preview the production build locally

## Development Philosophy

Focus on creating an intuitive, magical experience where file management feels spatial and embodied. Every technical decision should reinforce the metaphor of "navigating your thoughts through space."

### Code Style Guidelines
- **No redundant comments**: Names should make intent obvious; reserve comments for non-obvious math or API caveats
- **Modular architecture**: Small, composable components with single responsibilities
- **Type-first development**: Define interfaces before implementation and keep props strictly typed
- **Configuration-driven**: Adjust behavior through `src/config` or constants instead of scattering literals

## Current Implementation Status

### ✅ Phase 1 Complete – Core Infrastructure
- Infinite orthographic canvas with adaptive dot grid
- Custom pan/zoom controls wired to the rigged camera
- Avatar rendering for spatial presence cues

### ✅ Phase 2 Complete – File System Integration
- File System Access API gating + directory loading
- Front matter–based metadata parsing via gray-matter
- Markdown objects rendered as interactive 3D boxes with hover states
- IndexedDB persistence for directory handles and auto-loading
- Document viewer modal powered by shadcn + ReactMarkdown

### 🔄 Phase 3 In Progress – Content Primitives
- Markdown visualization ✅
- File editing & bidirectional sync (pending)
- Rich media rendering (pending)
- Image/object textures (pending)

### 📋 Future Phases
- **Phase 4**: Multiplayer + synchronization
- **Phase 5**: AI/agent integration
- **Phase 6**: Plugin system and extensibility

## Future Considerations

- Multiplayer synchronization architecture (CRDTs or WebRTC mesh)
- AI agent hooks for summarising/creating spatial notes
- Import/export utilities for backing up `.coros` metadata
- Plugin APIs for custom content primitives and behaviors
