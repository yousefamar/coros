# CorOS - Digital Garden Operating System

**A magical file system browser that transforms your thoughts into navigable spaces.**

CorOS is an offline-first, responsive Progressive Web App that reimagines how we organize and interact with our digital thoughts. Named after Plato's concept of *chōra* (the realm of becoming), CorOS creates a harmonious chorus of your ideas in an infinite canvas.

## Vision

CorOS is fundamentally a magical file system browser that allows you to:

- **Navigate** your thoughts in an infinite, top-down canvas
- **Organize** files and ideas as spatial objects in virtual spaces
- **Interact** with an avatar that moves through your digital garden
- **Create** rich content using primitives like markdown, images, and directories
- **Collaborate** with others and AI agents in shared spaces (future)

## Core Philosophy

| Dimension         | Why It Works                                                     |
| ----------------- | ---------------------------------------------------------------- |
| **Philosophical** | Plato, Chōra, Chorus → structured becoming, inner realm          |
| **Emotional**     | "Cor" = heart/core → personal, essential                         |
| **Technical**     | "OS" = operating system → smart, scalable, system-level thinking |
| **Linguistic**    | Short, elegant, international                                    |
| **Brand**         | Unique, stylish, memorable, extensible                           |
| **Metaphor**      | Inner harmony, mental operating system, a chorus of thoughts     |

## Architecture Principles

- **Offline-First**: Works completely offline using the file system for storage
- **Progressive Web App**: Responsive, installable, and fast
- **Infinite Canvas**: Zoom and pan infinitely through your thought spaces
- **Avatar-Based Navigation**: Move through spaces with a personal avatar
- **File System Integration**: Direct mapping to your local file system
- **Metadata Storage**: Hidden `.coros` files store spatial and interaction metadata

## Content Primitives

- **Markdown Text**: Rich text editing and display
- **Images/Media**: Visual content with spatial positioning
- **Directories**: Nested spaces and organization
- **Custom Objects**: Extensible primitive system

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Three.js** + **React Three Fiber** for infinite canvas
- **shadcn/ui** + **Tailwind CSS** for UI components
- **File System Access API** for offline-first file management

## Getting Started

```bash
npm install
npm run dev
```

## Development

```bash
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Current Status

✅ **Phase 1 Complete** - Core offline-first architecture and infinite canvas

### Implemented Features

- **Infinite Canvas**: True 2D infinite panning and zooming with orthographic projection
- **Adaptive Dot Grid**: Fixed-size dots with dynamic density based on zoom level
- **Custom Camera Controls**: Mouse-based pan and zoom without artificial constraints
- **Modular Architecture**: Clean separation of concerns with TypeScript interfaces
- **Performance Optimized**: InstancedMesh rendering for thousands of grid dots

### Technical Implementation

- **Canvas System**: Custom 2D controls replacing traditional 3D orbit controls
- **Grid Rendering**: Adaptive spacing algorithm that maintains visual consistency
- **Type Safety**: Comprehensive TypeScript interfaces for all canvas operations
- **Configuration Management**: Centralized config system for easy customization
- **Utility Functions**: Reusable helpers for coordinate transformations and calculations

## Roadmap

1. ✅ **Phase 1**: Core offline-first architecture and infinite canvas
2. 🔄 **Phase 2**: Avatar movement and basic content primitives
3. **Phase 3**: File system integration and metadata management
4. **Phase 4**: Multiplayer and synchronization capabilities
5. **Phase 5**: AI agent integration and advanced collaboration

---

*CorOS: Where your thoughts find their space.*