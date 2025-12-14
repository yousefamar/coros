import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial, OrthographicCamera, Mesh, DoubleSide } from "three";
import { GRID_CONFIG } from "../config/canvas";
import vertexShader from "../shaders/grid.vert.glsl?raw";
import fragmentShader from "../shaders/grid.frag.glsl?raw";

if (import.meta.hot) {
  import.meta.hot.accept(
    ["../shaders/grid.vert.glsl", "../shaders/grid.frag.glsl"],
    () => {
      console.log("Shaders updated - HMR triggered");
    }
  );
}

export function DotGrid() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.vertexShader = vertexShader;
      materialRef.current.fragmentShader = fragmentShader;
      materialRef.current.needsUpdate = true;
    }
  }, [vertexShader, fragmentShader]);

  useFrame(() => {
    if (!materialRef.current || !meshRef.current) return;

    const zoom = (camera as OrthographicCamera).zoom || 1;
    materialRef.current.uniforms.uZoom.value = zoom;

    const parent = meshRef.current.parent;
    if (parent) {
      meshRef.current.position.x = 0;
      meshRef.current.position.y = 0;
    }
  });

  const hexToVec3 = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  return (
    <mesh ref={meshRef} position-z={-0.01}>
      <planeGeometry args={[GRID_CONFIG.planeSize, GRID_CONFIG.planeSize]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
        transparent
        uniforms={{
          uGridSize: { value: GRID_CONFIG.baseSize },
          uDotRadius: { value: 0.05 },
          uDotColor: { value: hexToVec3(GRID_CONFIG.color) },
          uZoom: { value: 50 },
        }}
      />
    </mesh>
  );
}
