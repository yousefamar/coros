import { CameraPosition } from '../types/canvas'

/**
 * Converts screen movement to world movement based on zoom level
 */
export const screenToWorldMovement = (
  deltaX: number, 
  deltaY: number, 
  zoom: number
): CameraPosition => ({
  x: -deltaX / zoom,
  z: -deltaY / zoom
})

/**
 * Calculates the fixed visual scale for objects based on zoom
 * to maintain consistent visual size regardless of zoom level
 */
export const calculateFixedScale = (baseScale: number, zoom: number): number => {
  return baseScale / zoom
}

/**
 * Calculates grid center position based on camera position and spacing
 */
export const calculateGridCenter = (
  cameraPos: number, 
  spacing: number
): number => {
  return Math.floor(cameraPos / spacing) * spacing
}

/**
 * Clamps a value between min and max bounds
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}