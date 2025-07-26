import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { Avatar } from './Avatar'
import { DotGrid } from './DotGrid'
import { CanvasControls } from './CanvasControls'
import { CANVAS_CONFIG } from '../config/canvas'

export function Canvas() {
  return (
    <div className="w-screen h-screen">
      <ThreeCanvas
        orthographic
        camera={CANVAS_CONFIG.camera}
        style={{ background: CANVAS_CONFIG.background }}
      >
        <ambientLight intensity={CANVAS_CONFIG.lighting.ambient.intensity} />
        <directionalLight 
          position={CANVAS_CONFIG.lighting.directional.position} 
          intensity={CANVAS_CONFIG.lighting.directional.intensity} 
        />
        
        <DotGrid />
        <Avatar />
        <CanvasControls />
      </ThreeCanvas>
    </div>
  )
}