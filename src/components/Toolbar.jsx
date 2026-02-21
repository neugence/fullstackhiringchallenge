import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";

function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div style={styles.toolbar}>
      <button onClick={undo} style={styles.button}>Undo</button>
      <button onClick={redo} style={styles.button}>Redo</button>
      <button onClick={formatBold} style={styles.button}>Bold</button>
      <button onClick={formatItalic} style={styles.button}>Italic</button>
    </div>
  );
}

const styles = {
  toolbar: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
  },
  button: {
    padding: "6px 12px",
    cursor: "pointer",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    borderRadius: "4px",
  },
};

export default Toolbar;