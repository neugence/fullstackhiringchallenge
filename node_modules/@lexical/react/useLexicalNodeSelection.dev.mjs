/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isNodeSelection, $createNodeSelection, $setSelection, $getNodeByKey } from 'lexical';
import { useState, useEffect, useCallback } from 'react';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function isNodeSelected(editor, key) {
  return editor.getEditorState().read(() => {
    const node = $getNodeByKey(key);
    if (node === null) {
      return false;
    }
    return node.isSelected();
  });
}
function useLexicalNodeSelection(key) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(() => isNodeSelected(editor, key));
  useEffect(() => {
    let isMounted = true;
    const unregister = editor.registerUpdateListener(() => {
      if (isMounted) {
        setIsSelected(isNodeSelected(editor, key));
      }
    });
    return () => {
      isMounted = false;
      unregister();
    };
  }, [editor, key]);
  const setSelected = useCallback(selected => {
    editor.update(() => {
      let selection = $getSelection();
      if (!$isNodeSelection(selection)) {
        selection = $createNodeSelection();
        $setSelection(selection);
      }
      if ($isNodeSelection(selection)) {
        if (selected) {
          selection.add(key);
        } else {
          selection.delete(key);
        }
      }
    });
  }, [editor, key]);
  const clearSelected = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isNodeSelection(selection)) {
        selection.clear();
      }
    });
  }, [editor]);
  return [isSelected, setSelected, clearSelected];
}

export { useLexicalNodeSelection };
