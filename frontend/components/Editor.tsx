import { useEffect, useState } from "react";
import { useNote } from "@/app/contexts/NotesContext";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

type EditorProps = {
  setChanged: (v: boolean) => void;
};

export default function Editor({ setChanged }: EditorProps) {
  const { content, setContent, selectedNoteId } = useNote();
  const editor = useCreateBlockNote();
  const [isMounted, setIsMounted] = useState(false);

  // -----------------------------
  // Load content into editor
  // -----------------------------
  useEffect(() => {
    if (!editor) return;
    if (!content) return;
    if (isMounted) return;

    try {
      const parsed = JSON.parse(content);
      editor.replaceBlocks(editor.document, parsed);
    } catch {
      // Fallback: Only one paragraph block
      const block = {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: content || "",
          },
        ],
      };

      editor.replaceBlocks(editor.document, [block] as any);
    }
  }, [editor, content, selectedNoteId]);

  // -----------------------------
  // Handle Editor Changes
  // -----------------------------
  useEffect(() => {
    if (!editor) return;

    const unsubscribe = editor.onChange(() => {
      const json = JSON.stringify(editor.document);
      setContent(json);
      setChanged(true);
      setIsMounted(true);
    });

    return unsubscribe;
  }, [editor, setContent, setChanged]);

  useEffect(() => {
    setIsMounted(false);
  }, [selectedNoteId]);

  // -----------------------------
  // Keyboard Shortcuts (Ctrl+S)
  // -----------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const event = new CustomEvent("save_note");
        window.dispatchEvent(event);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    // Simple scrolling wrapper for the editor only
    <div className="bg-neutral-950 h-full w-full overflow-y-auto custom-scrollbar">
      <div className="p-8 max-w-5xl mx-auto min-h-full">
        <BlockNoteView
          editor={editor}
          theme="dark"
          className="bg-transparent" 
        />
      </div>
    </div>
  );
}