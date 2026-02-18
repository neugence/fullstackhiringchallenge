import { useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

function useEditorText() {
    const [editor] = useLexicalComposerContext();

    const getText = useCallback(() => {
        let text = "";
        editor.getEditorState().read(() => {
            text = $getRoot().getTextContent();
        });
        return text;
    }, [editor]);

    return getText;
}

export default useEditorText;
