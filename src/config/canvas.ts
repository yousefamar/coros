import { CanvasConfig, ZoomConfig, GridConfig } from '../types/canvas'

export const ZOOM_CONFIG: ZoomConfig = {
  min: 0.1,
  max: 1000,
  speed: 0.1,
  default: 50
}

export const GRID_CONFIG: GridConfig = {
  baseSize: 1,
  viewRadius: 100,
  maxDots: (100 * 2 + 1) ** 2, // (viewRadius * 2 + 1) ** 2
  dotRadius: 0.02,
  color: '#333'
}

export const CANVAS_CONFIG: CanvasConfig = {
  camera: {
    position: [0, 10, 0],
    rotation: [-Math.PI / 2, 0, 0],
    zoom: ZOOM_CONFIG.default,
    near: 0.1,
    far: 100000
  },
  background: '#0f0f23',
  lighting: {
    ambient: {
      intensity: 0.6
    },
    directional: {
      position: [10, 10, 5],
      intensity: 0.4
    }
  }
}

// Grid spacing calculation based on zoom level
export const calculateGridSpacing = (zoom: number, baseSize: number): number => {
  if (zoom > 50) return baseSize
  if (zoom > 25) return baseSize * 2
  if (zoom > 10) return baseSize * 4
  if (zoom > 5) return baseSize * 8
  return baseSize * 16
}