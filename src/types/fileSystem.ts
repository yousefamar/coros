export interface Position {
  x: number;
  y: number;
}

export interface FrontMatter {
  position: Position;
  visible?: boolean;
  title?: string;
}

export interface MarkdownFile {
  name: string;
  path: string;
  handle: FileSystemFileHandle;
  frontMatter: FrontMatter;
  content: string;
}

export interface FileSystemState {
  directoryHandle: FileSystemDirectoryHandle | null;
  files: MarkdownFile[];
  isLoading: boolean;
  error: string | null;
}
