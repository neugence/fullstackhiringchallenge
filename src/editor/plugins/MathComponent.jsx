import { useCallback, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import katex from 'katex';
import { MathNode } from '../nodes/MathNode';
import 'katex/dist/katex.min.css';

export function MathComponent({ latex, nodeKey }) {
  const [editor] = useLexicalComposerContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(latex);

  const handleClick = useCallback(() => {
    setEditValue(latex);
    setIsEditing(true);
  }, [latex]);

  const handleSave = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node && node instanceof MathNode) {
        node.setLatex(editValue);
      }
    });
    setIsEditing(false);
  }, [editor, nodeKey, editValue]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        setEditValue(latex);
        setIsEditing(false);
      }
    },
    [handleSave, latex]
  );

  let rendered = null;
  try {
    rendered = katex.renderToString(latex || ' ', {
      throwOnError: false,
      displayMode: false,
      output: 'html',
    });
  } catch (_) {
    rendered = `<span class="math-error">${latex || '?'}</span>`;
  }

  if (isEditing) {
    return (
      <span className="math-editor-wrap" contentEditable={false}>
        <input
          className="math-editor-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          data-testid="math-input"
        />
        <button type="button" className="math-editor-save" onClick={handleSave}>
          Done
        </button>
      </span>
    );
  }

  return (
    <span
      className="math-inline"
      onClick={handleClick}
      onFocus={handleClick}
      role="button"
      tabIndex={0}
      contentEditable={false}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
