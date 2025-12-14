import { useRef, useState } from "react";
import { Text } from "@react-three/drei";
import type { Mesh } from "three";
import type { MarkdownFile } from "../types/fileSystem";
import { MARKDOWN_OBJECT_CONFIG } from "../config/canvas";

interface MarkdownObjectProps {
  file: MarkdownFile;
  onClick?: (file: MarkdownFile) => void;
}

export function MarkdownObject({ file, onClick }: MarkdownObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { position } = file.frontMatter;
  const displayName = file.frontMatter.title || file.name.replace(".md", "");

  const color = isHovered
    ? MARKDOWN_OBJECT_CONFIG.colors.hover
    : MARKDOWN_OBJECT_CONFIG.colors.default;

  return (
    <group position={[position.x, position.y, 0.5]}>
      <mesh
        ref={meshRef}
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(file);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setIsHovered(false);
        }}
      >
        <boxGeometry
          args={[
            MARKDOWN_OBJECT_CONFIG.size.width,
            MARKDOWN_OBJECT_CONFIG.size.depth,
            MARKDOWN_OBJECT_CONFIG.size.height,
          ]}
        />
        <meshStandardMaterial color={color} />
      </mesh>

      <Text
        position={[0, 0, MARKDOWN_OBJECT_CONFIG.label.offset]}
        fontSize={MARKDOWN_OBJECT_CONFIG.label.fontSize}
        color={MARKDOWN_OBJECT_CONFIG.label.color}
        anchorX="center"
        anchorY="middle"
      >
        {displayName}
      </Text>
    </group>
  );
}
