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

- `npm run dev` - Start development server
- `npm run build` - Build for production 
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## File System Architecture

- Root directories map to "spaces" in the canvas
- Files become spatial objects with position metadata
- Hidden `.coros/` directories contain:
  - Spatial positioning data
  - Avatar state and location
  - Canvas view settings
  - Object interaction metadata

## Technical Constraints

- Must work completely offline
- No external API dependencies for core functionality
- File system access via modern browser APIs (File System Access API where available)
- Responsive design for mobile and desktop
- Canvas rendering performance optimization required

## Future Considerations

- Multiplayer synchronization architecture (planned for later phases)
- AI agent integration capabilities
- Export/import functionality for spaces
- Plugin/extension system for custom primitives

## Current Architecture Implementation

### Canvas System
- **True 2D Infinite Canvas**: Uses orthographic camera with custom controls instead of OrbitControls
- **Adaptive Grid System**: Dynamic dot density based on zoom level with fixed visual size
- **Performance Optimized**: InstancedMesh for rendering thousands of grid dots efficiently

### Code Organization
- **Modular Components**: Separated concerns between Canvas, CanvasControls, DotGrid, and Avatar
- **Type Safety**: Comprehensive TypeScript interfaces in `src/types/canvas.ts`
- **Configuration Management**: Centralized config in `src/config/canvas.ts`
- **Utility Functions**: Reusable helpers in `src/utils/canvas.ts`

### Key Design Patterns
- **Separation of Concerns**: UI components, logic utilities, and configuration are clearly separated
- **Configuration-Driven**: All constants and settings are centralized and easily adjustable
- **Type-First Development**: Strong TypeScript interfaces guide implementation
- **Performance-Conscious**: Optimized rendering patterns for smooth infinite canvas experience

### Canvas Controls Implementation
- **Custom 2D Pan/Zoom**: Mouse-based controls that treat the canvas as a true 2D plane
- **Adaptive Grid Spacing**: Algorithm that maintains visual consistency at all zoom levels
- **Fixed Visual Scale**: Objects maintain consistent visual size regardless of zoom level
- **Zoom Constraints**: Configurable min/max zoom levels with smooth transitions

## Development Philosophy

Focus on creating an intuitive, magical experience where file management feels natural and spatial. Every technical decision should serve the core metaphor of "navigating your thoughts through space."

### Code Style Guidelines
- **No Comments**: Clean, self-documenting code with descriptive names
- **Modular Architecture**: Small, focused components with single responsibilities  
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Configuration-Driven**: Centralized config files for easy customization
