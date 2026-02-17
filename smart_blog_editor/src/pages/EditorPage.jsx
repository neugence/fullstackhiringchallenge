import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

import Toolbar from "../editor/Toolbar";
import AutoSavePlugin from "../editor/AutoSavePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEditorStore } from "../store/editorStore";
import { useEffect } from "react";

const editorConfig = {
  namespace: "SmartEditor",
  onError(error) {
    throw error;
  },
};

function SyncPlugin() {
  const [editor] = useLexicalComposerContext();
  const setEditorState = useEditorStore((s) => s.setEditorState);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      setEditorState(editorState);
    });
  }, [editor]);

  return null;
}

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative max-w-4xl mx-auto px-4">

        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-violet-500/10 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-[-160px] right-[-80px] w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full"></div>
        </div>

        <div className="mb-4">
          <Toolbar />
        </div>

        <div className="relative rounded-3xl bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 shadow-2xl shadow-black/50 transition-all duration-300 focus-within:ring-1 focus-within:ring-violet-500/30">

          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/5 pointer-events-none"></div>

          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input min-h-[520px] p-12 outline-none text-[17px] leading-relaxed tracking-wide text-neutral-200"
              />
            }
            placeholder={
              <div className="absolute top-12 left-12 text-gray-100 pointer-events-none select-none">
                Start writing your story...
              </div>
            }
          />

          <HistoryPlugin />
          <SyncPlugin />
          <AutoSavePlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
