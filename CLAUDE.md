# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CorOS is an offline-first Progressive Web App that functions as a "magical file system browser" - a digital garden where users can organize thoughts in spatial, navigable environments. The app features an infinite canvas with top-down perspective, avatar-based navigation, and direct file system integration.

In this project, we prioritise simplicity and modularity. There has to be a separation of concerns between the UI and the logic.

## Key Architecture Principles

- **Offline-First**: All data stored locally using the file system, no remote dependencies required
- **PWA Architecture**: Progressive Web App with responsive design and installability
- **Infinite Canvas**: Smooth pan/zoom functionality with spatial object positioning
- **File System Integration**: Direct mapping between app objects and local files/directories
- **Metadata Management**: Hidden `.coros` files store spatial positioning and interaction metadata
- **Avatar-Based UX**: User moves an avatar through spaces rather than traditional navigation

## Core Content Primitives

- **Markdown Text**: Rich text editing and rendering
- **Images/Media**: Visual content with spatial positioning
- **Directories**: Nested spaces and hierarchical organization
- **Custom Objects**: Extensible system for new content types

## Development Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run preview` - Preview production build

Note: This project uses **bun** as the package manager, not npm.

## File System Architecture

### Metadata Approach
- **Front Matter Metadata**: Markdown files use YAML front matter for spatial positioning
- **Required Fields**: `position: { x: number, y: number }` - files without valid positions are hidden
- **Optional Fields**: `title` (display name), `visible` (show/hide flag)

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

### Directory Persistence
- **File System Access API**: Browser-native file system integration
- **IndexedDB Storage**: Directory handles persisted across sessions
- **Permission Management**: Automatic re-request of file system permissions on page load
- **Auto-loading**: Previously selected directories load automatically on startup

## Technical Constraints & Solutions

### Requirements
- Must work completely offline
- No external API dependencies for core functionality
- File system access via modern browser APIs (File System Access API)
- Responsive design for mobile and desktop
- Canvas rendering performance optimization required

### Browser Compatibility Solutions
- **Buffer Polyfill**: Added `buffer` package for gray-matter compatibility in browser
- **Global Buffer**: Exposed via `window.Buffer` in main.tsx
- **Vite Configuration**: Custom resolve aliases and optimization settings
- **IndexedDB**: Native browser storage for directory handle persistence

## Future Considerations

- Multiplayer synchronization architecture (planned for later phases)
- AI agent integration capabilities
- Export/import functionality for spaces
- Plugin/extension system for custom primitives

## Current Architecture Implementation

### Coordinate System
- **Z-Up Convention**: Z axis points up (vertical), X and Y are horizontal
- **Canvas Plane**: Grid and objects exist on the X-Y plane at Z=0
- **Camera Position**: Orthographic camera at 45-degree angle looking down
- **Object Positioning**: Front matter coordinates map directly to X-Y world positions

### Canvas System
- **True 2D Infinite Canvas**: Orthographic camera with custom controls
- **Adaptive Grid System**: Shader-based dot grid with dynamic density based on zoom
- **Performance Optimized**: GPU-accelerated rendering for smooth panning and zooming
- **45-Degree View**: Isometric-style perspective for spatial awareness

### File System Integration
- **Markdown Object Rendering**: Files appear as 3D boxes with labels on the canvas
- **Front Matter Parsing**: Uses `gray-matter` library (with Buffer polyfill for browser)
- **Interactive Objects**: Click handlers and hover effects on file objects
- **Directory Management**: Component-based file system manager with state management
- **Persistence Layer**: IndexedDB storage for directory handles (`src/services/persistence.ts`)

### Code Organization
- **Components**: Canvas, CanvasControls, DotGrid, Avatar, MarkdownObject, FileSystemManager
- **Services**: fileSystem.ts (File System API), persistence.ts (IndexedDB)
- **Types**: canvas.ts, fileSystem.ts - comprehensive TypeScript interfaces
- **Configuration**: Centralized config in `src/config/canvas.ts`
- **Utilities**: canvas.ts - reusable helper functions

### Key Design Patterns
- **Separation of Concerns**: UI components, services, and configuration clearly separated
- **Configuration-Driven**: All constants and settings centralized and adjustable
- **Type-First Development**: Strong TypeScript interfaces guide implementation
- **Service Layer**: File system and persistence logic isolated from UI components
- **Event Propagation**: `stopPropagation()` pattern for interactive objects

### Canvas Controls Implementation
- **Custom 2D Pan/Zoom**: Mouse-based controls on X-Y plane
- **Adaptive Grid Spacing**: Shader algorithm maintains visual consistency at all zoom levels
- **Interactive Click Handling**: Event propagation management for object interactions
- **Zoom Constraints**: Configurable min/max zoom (10-1000) with smooth transitions

## Development Philosophy

Focus on creating an intuitive, magical experience where file management feels natural and spatial. Every technical decision should serve the core metaphor of "navigating your thoughts through space."

### Code Style Guidelines
- **No Comments**: Clean, self-documenting code with descriptive names
- **Modular Architecture**: Small, focused components with single responsibilities
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Configuration-Driven**: Centralized config files for easy customization

## Current Implementation Status

### ✅ Phase 1 Complete - Core Infrastructure
- Infinite canvas with orthographic camera
- Adaptive dot grid system
- Custom pan/zoom controls
- Z-up coordinate system
- Avatar rendering

### ✅ Phase 2 Complete - File System Integration
- File System Access API integration
- Front matter-based metadata parsing
- Markdown file rendering as spatial objects
- IndexedDB directory handle persistence
- Auto-loading on page refresh
- Interactive file objects (click/hover)

### 🔄 Phase 3 In Progress - Content Primitives
- Basic markdown object visualization ✅
- File editing capabilities (pending)
- Rich content rendering (pending)
- Image/media support (pending)

### 📋 Future Phases
- **Phase 4**: Multiplayer and synchronization
- **Phase 5**: AI agent integration
- **Phase 6**: Plugin system and extensibility