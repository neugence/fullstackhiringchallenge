import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import { insertTable } from '../editor/utils/tableUtils';
import { INSERT_MATH_COMMAND } from '../editor/plugins/InsertMathPlugin';
import { useEditorStore } from '../store/useEditorStore';
import { loadDocument } from '../api/persistence';

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const setInitialContent = useEditorStore((s) => s.setInitialContent);
  const setLoading = useEditorStore((s) => s.setLoading);
  const setSaveSuccess = useEditorStore((s) => s.setSaveSuccess);

  const handleInsertTable = useCallback(() => {
    insertTable(editor, 3, 3, true);
  }, [editor]);

  const handleInsertMath = useCallback(() => {
    editor.dispatchCommand(INSERT_MATH_COMMAND, { latex: 'E = mc^2' });
  }, [editor]);

  const handleLoad = useCallback(() => {
    setLoading(true);
    const saved = loadDocument();
    if (saved) {
      setInitialContent(saved);
      editor.setEditorState(editor.parseEditorState(saved));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
    setLoading(false);
  }, [editor, setInitialContent, setLoading, setSaveSuccess]);

  return (
    <div className="toolbar">
      <button type="button" onClick={handleInsertTable} className="toolbar-btn">
        Insert Table
      </button>
      <button type="button" onClick={handleInsertMath} className="toolbar-btn">
        Insert Math
      </button>
      <button type="button" onClick={handleLoad} className="toolbar-btn">
        Reload from storage
      </button>
      <span className="toolbar-hint">(Content auto-saves as you type)</span>
    </div>
  );
}
