import matter from "gray-matter";
import type { MarkdownFile, FrontMatter } from "../types/fileSystem";

export async function requestDirectoryAccess(): Promise<FileSystemDirectoryHandle | null> {
  try {
    if (!("showDirectoryPicker" in window)) {
      throw new Error("File System Access API not supported");
    }
    return await window.showDirectoryPicker();
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      return null;
    }
    throw error;
  }
}

export async function readMarkdownFiles(
  directoryHandle: FileSystemDirectoryHandle
): Promise<MarkdownFile[]> {
  const files: MarkdownFile[] = [];

  for await (const entry of directoryHandle.values()) {
    if (entry.kind === "file" && entry.name.endsWith(".md")) {
      try {
        const file = await entry.getFile();
        const text = await file.text();
        const parsed = matter(text);

        const frontMatter = parsed.data as FrontMatter;

        if (
          frontMatter.position &&
          typeof frontMatter.position.x === "number" &&
          typeof frontMatter.position.y === "number"
        ) {
          files.push({
            name: entry.name,
            path: entry.name,
            handle: entry,
            frontMatter,
            content: parsed.content,
          });
        }
      } catch (error) {
        console.warn(`Failed to parse ${entry.name}:`, error);
      }
    }
  }

  return files;
}
