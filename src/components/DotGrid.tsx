import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial, OrthographicCamera, Mesh, DoubleSide } from "three";
import { GRID_CONFIG } from "../config/canvas";

const vertexShader = `
  varying vec2 vWorldPos;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xy;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform float uGridSize;
  uniform float uDotRadius;
  uniform vec3 uDotColor;
  uniform float uZoom;

  varying vec2 vWorldPos;

  float getGridLevel(float zoom) {
    if (zoom > 50.0) return 1.0;
    if (zoom > 25.0) return 2.0;
    if (zoom > 10.0) return 4.0;
    if (zoom > 5.0) return 8.0;
    return 16.0;
  }

  void main() {
    float gridLevel = getGridLevel(uZoom);
    float spacing = uGridSize * gridLevel;

    vec2 gridPos = mod(vWorldPos + spacing * 0.5, spacing) - spacing * 0.5;
    float dist = length(gridPos);

    float radius = uDotRadius * gridLevel;
    float edge = fwidth(dist) * 1.5;
    float dot = 1.0 - smoothstep(radius - edge, radius + edge, dist);

    if (dot < 0.01) discard;

    gl_FragColor = vec4(uDotColor, dot);
  }
`;

export function DotGrid() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const { camera } = useThree();

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
