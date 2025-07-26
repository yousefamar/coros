import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export function Avatar() {
  const meshRef = useRef<Mesh>(null)
  const [position] = useState([0, 0.5, 0])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  )
}