import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MarkdownFile } from "@/types/fileSystem";

interface DocumentViewerProps {
  file: MarkdownFile | null;
  onClose: () => void;
}

export function DocumentViewer({ file, onClose }: DocumentViewerProps) {
  const displayName = file?.frontMatter.title || file?.name.replace(".md", "") || "";

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{displayName}</DialogTitle>
        </DialogHeader>
        <div className="prose dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {file?.content || ""}
          </ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  );
}
