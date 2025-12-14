import { useState, useEffect, useCallback } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { Mesh, MeshStandardMaterial } from "three";
import { MarkdownObject } from "./MarkdownObject";
import {
  requestDirectoryAccess,
  readMarkdownFiles,
} from "../services/fileSystem";
import {
  saveDirectoryHandle,
  loadDirectoryHandle,
} from "../services/persistence";
import type { MarkdownFile, FileSystemState } from "../types/fileSystem";

interface FileSystemManagerProps {
  onFileClick: (file: MarkdownFile) => void;
}

export function FileSystemManager({ onFileClick }: FileSystemManagerProps) {
  const [state, setState] = useState<FileSystemState>({
    directoryHandle: null,
    files: [],
    isLoading: false,
    error: null,
  });

  const loadDirectory = useCallback(
    async (directoryHandle: FileSystemDirectoryHandle) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const files = await readMarkdownFiles(directoryHandle);

        setState({
          directoryHandle,
          files,
          isLoading: false,
          error: null,
        });

        await saveDirectoryHandle(directoryHandle);
      } catch (error) {
        console.error("Error loading directory:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: (error as Error).message,
        }));
      }
    },
    [],
  );

  const handleOpenDirectory = async () => {
    try {
      const directoryHandle = await requestDirectoryAccess();

      if (!directoryHandle) {
        return;
      }

      await loadDirectory(directoryHandle);
    } catch (error) {
      console.error("Error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
    }
  };

  useEffect(() => {
    const loadSavedDirectory = async () => {
      const savedHandle = await loadDirectoryHandle();
      if (savedHandle) {
        await loadDirectory(savedHandle);
      }
    };

    loadSavedDirectory();
  }, [loadDirectory]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      {state.files.map((file) => (
        <MarkdownObject key={file.path} file={file} onClick={onFileClick} />
      ))}

      {state.isLoading && (
        <mesh position={[0, 0, 0.5]}>
          <boxGeometry args={[1.5, 0.3, 0.1]} />
          <meshStandardMaterial color="#667eea" />
        </mesh>
      )}

      {state.error && (
        <mesh position={[0, 0, 0.5]}>
          <boxGeometry args={[2, 0.4, 0.1]} />
          <meshStandardMaterial color="#e53e3e" />
        </mesh>
      )}

      {!state.directoryHandle && !state.isLoading && (
        <group>
          <mesh
            position={[0, 0, 0]}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              handleOpenDirectory();
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
            }}
            onPointerEnter={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              const mesh = e.object as Mesh;
              const material = mesh.material as MeshStandardMaterial;
              material.color.set("#667eea");
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              const mesh = e.object as Mesh;
              const material = mesh.material as MeshStandardMaterial;
              material.color.set("#4a5568");
              document.body.style.cursor = "auto";
            }}
          >
            <boxGeometry args={[2, 0.5, 1]} />
            <meshStandardMaterial color="#4a5568" />
          </mesh>
        </group>
      )}
    </>
  );
}
