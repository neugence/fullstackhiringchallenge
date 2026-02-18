import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function OnChangePlugin({ onChange }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            const json = editorState.toJSON();
            if (onChange) onChange(json);
        });
    }, [editor, onChange]);

    return null;
}

export default OnChangePlugin;
