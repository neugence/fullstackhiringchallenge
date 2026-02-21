import { OnChangePlugin as LexicalOnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useEditorStore } from "../store/editorStore";

export default function OnChangePlugin() {

  const setEditorState = useEditorStore(
    (state) => state.setEditorState
  );

  const handleChange = (editorState) => {

    editorState.read(() => {

      const json = editorState.toJSON();

    
      setEditorState(json);

      
      localStorage.setItem(
        "editorContent",
        JSON.stringify(json)
      );

    });

  };

  return (
    <LexicalOnChangePlugin
      onChange={handleChange}
    />
  );

}