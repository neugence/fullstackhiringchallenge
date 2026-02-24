import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useEditorStore } from "../../store/editorStore";

export default function PersistencePlugin() {
  const setSerializedContent = useEditorStore((state) => state.setSerializedContent);
  const setSaving = useEditorStore((state) => state.setSaving);

  return (
    <OnChangePlugin
      ignoreSelectionChange
      onChange={(editorState) => {
        setSaving(true);
        const serialized = JSON.stringify(editorState.toJSON());
        setSerializedContent(serialized);
      }}
    />
  );
}
