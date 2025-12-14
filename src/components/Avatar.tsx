import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export function Avatar() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0.5]}>
      <mesh ref={meshRef} castShadow rotation-x={Math.PI / 2}>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial color="#00FF00" />
      </mesh>

      <mesh position={[0, 0, 0.8]} rotation-x={Math.PI / 2}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
}
