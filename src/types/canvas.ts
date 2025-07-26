import { OrthographicCamera } from 'three'

export interface CameraPosition {
  x: number
  z: number
}

export interface MousePosition {
  x: number
  y: number
}

export interface ZoomConfig {
  min: number
  max: number
  speed: number
  default: number
}

export interface GridConfig {
  baseSize: number
  viewRadius: number
  maxDots: number
  dotRadius: number
  color: string
}

export interface CanvasConfig {
  camera: {
    position: [number, number, number]
    rotation: [number, number, number]
    zoom: number
    near: number
    far: number
  }
  background: string
  lighting: {
    ambient: {
      intensity: number
    }
    directional: {
      position: [number, number, number]
      intensity: number
    }
  }
}

export type CanvasCamera = OrthographicCamera