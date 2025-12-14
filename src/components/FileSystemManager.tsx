import { useState, useEffect } from "react";
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

export function FileSystemManager() {
  const [state, setState] = useState<FileSystemState>({
    directoryHandle: null,
    files: [],
    isLoading: false,
    error: null,
  });

  const loadDirectory = async (directoryHandle: FileSystemDirectoryHandle) => {
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
  };

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
  }, []);

  const handleFileClick = (file: MarkdownFile) => {
    console.log("Clicked file:", file);
  };

  return (
    <>
      {state.files.map((file) => (
        <MarkdownObject
          key={file.path}
          file={file}
          onClick={handleFileClick}
        />
      ))}

      {!state.directoryHandle && (
        <group>
          <mesh
            position={[0, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDirectory();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onPointerEnter={(e) => {
              e.stopPropagation();
              (e.object as any).material.color.set("#667eea");
              document.body.style.cursor = "pointer";
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              (e.object as any).material.color.set("#4a5568");
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
