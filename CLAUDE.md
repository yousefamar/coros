# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working inside the CorOS repository.

## Project Overview

CorOS is an offline-first Progressive Web App that turns a local directory of Markdown files into a spatial “digital garden.” A React Three Fiber canvas renders an infinite grid, an avatar, and interactive Markdown objects that mirror the file system. Selecting a file opens a shadcn/ui document viewer that streams the raw Markdown (via `react-markdown`) on top of the 3D scene. The experience is intentionally simple: files live on disk, spatial metadata lives in front matter, and the browser acts as the renderer.

### Core Experience Pillars
- **Spatial thinking** – an infinite orthographic canvas with smooth pan/zoom and shader-based dot grid
- **Avatar mediation** – a lightweight avatar provides presence and future movement hooks
- **File system truth** – no backend; files are read directly through the File System Access API
- **Immediate readability** – selected Markdown renders in a dialog without leaving the canvas
- **Offline-first** – handles and data persist locally via IndexedDB and browser storage

## Tech & Tooling Snapshot
- **Runtime**: React 19 + TypeScript 5.8 + Vite 7
- **3D / Rendering**: three.js 0.178, React Three Fiber, custom GLSL shaders (`src/shaders`)
- **UI**: Tailwind CSS 4, shadcn/ui primitives (`src/components/ui`), Lucide icons
- **State / Services**: Lightweight React state + service modules (`src/services`)
- **Markdown**: gray-matter for parsing front matter, react-markdown + remark-gfm for rendering
- **Package manager**: Bun (`bun.lock` present) – always prefer `bun install` / `bun run …`
- **Polyfills**: `window.Buffer` is assigned in `src/main.tsx`, and `vite.config.ts` aliases `buffer` + `@` for browser builds

## Repository Layout
- `src/App.tsx` – mounts the top-level `Canvas` experience
- `src/components/Canvas.tsx` – wires together the R3F `<Canvas>`, lighting, shader grid, avatar, controls, file system manager, and document viewer
- `src/components/{Avatar,CameraRig,CanvasControls,DotGrid}` – rendering + interaction primitives for the infinite scene
- `src/components/FileSystemManager.tsx` – requests directory access, reads Markdown via `gray-matter`, instantiates `MarkdownObject`s, and persists directory handles
- `src/components/MarkdownObject.tsx` – box + label representation of a Markdown file positioned via front matter
- `src/components/DocumentViewer.tsx` – modal document viewer built with shadcn `Dialog` and `react-markdown`
- `src/components/ui` – generated shadcn/ui primitives (button, dialog, card, scroll-area, etc.)
- `src/services/fileSystem.ts` – wrapper around the File System Access API for requesting directories and parsing Markdown files
- `src/services/persistence.ts` – IndexedDB helper that saves/query/request directory handles so sessions auto-restore
- `src/config/canvas.ts` – canonical definitions for zoom ranges, camera rig, grid, lighting, and Markdown object sizing
- `src/types/{canvas,fileSystem}.ts` – shared TypeScript contracts for canvas math and file metadata
- `src/utils/canvas.ts` & `src/lib/utils.ts` – canvas math helpers and Tailwind `cn` helper
- `src/shaders/grid.(vert|frag).glsl` – shader pair powering the adaptive dot grid
- `test-space/` – sample Markdown garden with front matter; useful for local demos without touching a real workspace
- `components.json` – shadcn generator config; update here before adding/removing UI primitives

## Development Commands

> **Use Bun.** There is already a dev server running elsewhere, so do not start another `bun run dev` unless explicitly asked.

- `bun install` – install dependencies (mirrors `package.json`)
- `bun run dev` – start Vite locally
- `bun run build` – type-check + build production bundle
- `bun run preview` – serve the production build
- `bun run lint` – run ESLint (ESLint 9 / flat config via `eslint.config.js`)

## Runtime Architecture

- `App` renders `Canvas`, which owns the Three.js scene. `Canvas` sets up ambient/directional lights, mounts `CameraRig`, `DotGrid`, and `Avatar`, and renders `FileSystemManager` + `CanvasControls`.
- `CameraRig` positions the orthographic camera at a fixed distance, rotates it 45° down, and exposes the rig under the name `cameraRig` for the controls to manipulate.
- `CanvasControls` attaches DOM listeners for mouse drag/scroll, keeping pan and zoom clamped to `ZOOM_CONFIG`.
- `FileSystemManager` drives the data layer: it requests a directory handle, reads Markdown files, filters by valid `position`, and renders `MarkdownObject`s. It also persists the granted handle via IndexedDB so refreshes auto-load the last garden.
- `MarkdownObject` instances sit directly on the grid using front matter coordinates and dispatch `onFileClick` to show content.
- `DocumentViewer` opens a shadcn dialog with Markdown rendered through `react-markdown` + `remark-gfm`, so tables, checklists, and GFM syntax work out of the box.

## File System & Metadata Model

- **Front matter is the single source of truth**. There are no `.coros` sidecars yet; everything rides inside each Markdown file.
- Required front matter: a `position` object with numeric `x`/`y` values. Missing positions mean the file is skipped.
- Optional front matter: `title` to override the label, `visible` to reserve future toggles.

Example:
```markdown
---
title: Daily Log
position:
  x: 12
  y: -4
visible: true
---

# 2025-12-15
- Meeting notes…
```

- Files are parsed client-side with `gray-matter`. Because the browser lacks Node’s `Buffer`, we polyfill it in `src/main.tsx` and alias `buffer/` via Vite.
- The File System Access API requires a user gesture. `FileSystemManager` renders an introductory box mesh that handles the permission prompts.
- Granted directory handles are saved in IndexedDB (`src/services/persistence.ts`). On load we attempt to rehydrate the handle and re-request permissions if necessary.

## UI System & Styling

- Tailwind CSS 4 powers styling; `src/index.css` defines the base theme, dark mode variants, and CSS variables that shadcn/ui components read.
- UI primitives live under `src/components/ui`. Generate new components with shadcn and commit the updated `components.json`.
- Global radius/color tokens are defined once and reused across the entire scene (e.g., document viewer dialog).

## Technical Constraints & Solutions

- **Offline-only** – everything happens in-browser. Ensure new dependencies are bundlable and don’t rely on servers.
- **Browser APIs** – only modern Chromium-based browsers expose the File System Access API. Provide clear errors if permissions fail.
- **Performance** – keep canvas work lightweight; shader grid + instanced meshes avoid expensive DOM nodes.
- **Global polyfills** – `vite.config.ts` defines `globalThis` and aliases `buffer` to keep libraries like `gray-matter` functional.
- **Permission & error handling** – `FileSystemManager` keeps explicit loading/error states, retries persisted handles, and renders visible error meshes if permissions are denied so the user understands what failed.

## Security & Compatibility

- **Principle of local-only data** – Markdown contents and directory handles never leave the browser; we only persist opaque handles inside IndexedDB and never transmit file data to a server. New code must preserve this guarantee.
- **Scope permissions** – Always request the smallest directory scope that satisfies the feature. The File System Access API only works in secure contexts (https / localhost) and after a user gesture; handle `AbortError` gracefully.
- **Permission lifecycle** – Users can revoke handles at any time. `loadDirectoryHandle()` already re-requests `read` access; keep this pattern when adding write/edit flows and surface actionable UI when access is lost.
- **Browser support** – The File System Access API currently ships in Chromium-based browsers (Chrome/Edge/Brave v86+). Safari/Firefox users should see an explanatory prompt rather than a broken canvas. Feature-detect `showDirectoryPicker` before invoking it.
- **Error messaging** – When APIs are unavailable or permissions are denied, show the neutral box mesh with instructions or fall back to a static read-only mode. Never spam permission dialogs; wait for an explicit user action.

## Development Philosophy

- **Separation of concerns** – React components focus on presentation, `services/` own browser APIs, `config/` centralizes tweakable values.
- **Type-first** – always extend `src/types` before wiring new data through React.
- **Minimal comments** – prefer descriptive naming; add comments only when behavior is non-obvious (e.g., math-heavy sections).
- **Configuration-driven** – camera distance, zoom ranges, dot sizes, and colors belong in `src/config/canvas.ts`.
- **Event safety** – stop event propagation inside Three.js meshes so the canvas controls keep working.

## Current Implementation Status

### ✅ Phase 1 – Core Infrastructure
- Orthographic camera rig + avatar + lighting baseline
- Reactive shader-based dot grid with adaptive density
- Custom mouse pan/zoom controls (no OrbitControls dependency)

### ✅ Phase 2 – File System Integration
- File System Access API request flow
- Front matter parsing + validation with `gray-matter`
- IndexedDB persistence of directory handles
- Interactive Markdown objects rendered in-scene
- Document viewer dialog using shadcn/ui + `react-markdown`

### 🔄 Phase 3 – Rich Content Primitives
- ✅ Basic Markdown visualization
- ▢ Bi-directional editing / saving back to disk
- ▢ Media + directory primitives
- ▢ Metadata editing UI

### 📋 Future Phases
- **Phase 4**: Multiplayer + synchronization primitives
- **Phase 5**: AI/agent integrations
- **Phase 6**: Plugin system & extensibility hooks

Stay aligned with the “magical file system browser” metaphor—ship features only if they sharpen the spatial thinking experience and keep everything running offline.