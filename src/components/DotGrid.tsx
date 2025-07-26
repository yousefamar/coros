import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'
import { CanvasCamera } from '../types/canvas'
import { GRID_CONFIG, calculateGridSpacing } from '../config/canvas'
import { calculateFixedScale, calculateGridCenter } from '../utils/canvas'

export function DotGrid() {
  const meshRef = useRef<InstancedMesh>(null)
  const { camera } = useThree()

  const { baseSize: baseGridSize, viewRadius, maxDots } = GRID_CONFIG

  const dummy = useMemo(() => new Object3D(), [])

  useFrame(() => {
    if (!meshRef.current) return

    // Get the 2D position from camera's X and Z coordinates
    const cameraX = camera.position.x
    const cameraZ = camera.position.z
    const zoom = (camera as CanvasCamera).zoom || 1

    // Adaptive grid spacing based on zoom level
    const gridSpacing = calculateGridSpacing(zoom, baseGridSize)

    // Calculate grid center based on camera position and spacing
    const centerX = calculateGridCenter(cameraX, gridSpacing)
    const centerZ = calculateGridCenter(cameraZ, gridSpacing)

    // Fixed visual dot size regardless of zoom
    const dotScale = calculateFixedScale(100, zoom)

    let index = 0
    const maxRadius = Math.floor(viewRadius / (gridSpacing / baseGridSize))

    for (let x = -maxRadius; x <= maxRadius; x++) {
      for (let z = -maxRadius; z <= maxRadius; z++) {
        if (index >= maxDots) break

        const worldX = centerX + x * gridSpacing
        const worldZ = centerZ + z * gridSpacing

        dummy.position.set(worldX, 0, worldZ)
        dummy.scale.set(dotScale, dotScale, dotScale)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(index, dummy.matrix)
        index++
      }
      if (index >= maxDots) break
    }

    // Hide unused instances
    for (let i = index; i < maxDots; i++) {
      dummy.position.set(0, -1000, 0) // Move out of view
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, maxDots]}>
      <sphereGeometry args={[GRID_CONFIG.dotRadius, 8, 8]} />
      <meshBasicMaterial color={GRID_CONFIG.color} />
    </instancedMesh>
  )
}
