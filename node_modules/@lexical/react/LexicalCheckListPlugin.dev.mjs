/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { INSERT_CHECK_LIST_COMMAND, insertList, $isListItemNode, $isListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister, $findMatchingParent, isHTMLElement, calculateZoomLevel } from '@lexical/utils';
import { COMMAND_PRIORITY_LOW, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_UP_COMMAND, KEY_ESCAPE_COMMAND, KEY_SPACE_COMMAND, $getNearestNodeFromDOMNode, KEY_ARROW_LEFT_COMMAND, $getSelection, $isRangeSelection, $isElementNode, getNearestEditorFromDOMNode } from 'lexical';
import { useEffect } from 'react';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function CheckListPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return mergeRegister(editor.registerCommand(INSERT_CHECK_LIST_COMMAND, () => {
      insertList(editor, 'check');
      return true;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ARROW_DOWN_COMMAND, event => {
      return handleArrownUpOrDown(event, editor, false);
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ARROW_UP_COMMAND, event => {
      return handleArrownUpOrDown(event, editor, true);
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ESCAPE_COMMAND, event => {
      const activeItem = getActiveCheckListItem();
      if (activeItem != null) {
        const rootElement = editor.getRootElement();
        if (rootElement != null) {
          rootElement.focus();
        }
        return true;
      }
      return false;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_SPACE_COMMAND, event => {
      const activeItem = getActiveCheckListItem();
      if (activeItem != null && editor.isEditable()) {
        editor.update(() => {
          const listItemNode = $getNearestNodeFromDOMNode(activeItem);
          if ($isListItemNode(listItemNode)) {
            event.preventDefault();
            listItemNode.toggleChecked();
          }
        });
        return true;
      }
      return false;
    }, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ARROW_LEFT_COMMAND, event => {
      return editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const {
            anchor
          } = selection;
          const isElement = anchor.type === 'element';
          if (isElement || anchor.offset === 0) {
            const anchorNode = anchor.getNode();
            const elementNode = $findMatchingParent(anchorNode, node => $isElementNode(node) && !node.isInline());
            if ($isListItemNode(elementNode)) {
              const parent = elementNode.getParent();
              if ($isListNode(parent) && parent.getListType() === 'check' && (isElement || elementNode.getFirstDescendant() === anchorNode)) {
                const domNode = editor.getElementByKey(elementNode.__key);
                if (domNode != null && document.activeElement !== domNode) {
                  domNode.focus();
                  event.preventDefault();
                  return true;
                }
              }
            }
          }
        }
        return false;
      });
    }, COMMAND_PRIORITY_LOW), editor.registerRootListener((rootElement, prevElement) => {
      if (rootElement !== null) {
        rootElement.addEventListener('click', handleClick);
        rootElement.addEventListener('pointerdown', handlePointerDown);
      }
      if (prevElement !== null) {
        prevElement.removeEventListener('click', handleClick);
        prevElement.removeEventListener('pointerdown', handlePointerDown);
      }
    }));
  });
  return null;
}
function handleCheckItemEvent(event, callback) {
  const target = event.target;
  if (target === null || !isHTMLElement(target)) {
    return;
  }

  // Ignore clicks on LI that have nested lists
  const firstChild = target.firstChild;
  if (firstChild != null && isHTMLElement(firstChild) && (firstChild.tagName === 'UL' || firstChild.tagName === 'OL')) {
    return;
  }
  const parentNode = target.parentNode;

  // @ts-ignore internal field
  if (!parentNode || parentNode.__lexicalListType !== 'check') {
    return;
  }
  const rect = target.getBoundingClientRect();
  const pageX = event.pageX / calculateZoomLevel(target);
  if (target.dir === 'rtl' ? pageX < rect.right && pageX > rect.right - 20 : pageX > rect.left && pageX < rect.left + 20) {
    callback();
  }
}
function handleClick(event) {
  handleCheckItemEvent(event, () => {
    if (event.target instanceof HTMLElement) {
      const domNode = event.target;
      const editor = getNearestEditorFromDOMNode(domNode);
      if (editor != null && editor.isEditable()) {
        editor.update(() => {
          const node = $getNearestNodeFromDOMNode(domNode);
          if ($isListItemNode(node)) {
            domNode.focus();
            node.toggleChecked();
          }
        });
      }
    }
  });
}
function handlePointerDown(event) {
  handleCheckItemEvent(event, () => {
    // Prevents caret moving when clicking on check mark
    event.preventDefault();
  });
}
function getActiveCheckListItem() {
  const activeElement = document.activeElement;
  return activeElement != null && activeElement.tagName === 'LI' && activeElement.parentNode != null &&
  // @ts-ignore internal field
  activeElement.parentNode.__lexicalListType === 'check' ? activeElement : null;
}
function findCheckListItemSibling(node, backward) {
  let sibling = backward ? node.getPreviousSibling() : node.getNextSibling();
  let parent = node;

  // Going up in a tree to get non-null sibling
  while (sibling == null && $isListItemNode(parent)) {
    // Get li -> parent ul/ol -> parent li
    parent = parent.getParentOrThrow().getParent();
    if (parent != null) {
      sibling = backward ? parent.getPreviousSibling() : parent.getNextSibling();
    }
  }

  // Going down in a tree to get first non-nested list item
  while ($isListItemNode(sibling)) {
    const firstChild = backward ? sibling.getLastChild() : sibling.getFirstChild();
    if (!$isListNode(firstChild)) {
      return sibling;
    }
    sibling = backward ? firstChild.getLastChild() : firstChild.getFirstChild();
  }
  return null;
}
function handleArrownUpOrDown(event, editor, backward) {
  const activeItem = getActiveCheckListItem();
  if (activeItem != null) {
    editor.update(() => {
      const listItem = $getNearestNodeFromDOMNode(activeItem);
      if (!$isListItemNode(listItem)) {
        return;
      }
      const nextListItem = findCheckListItemSibling(listItem, backward);
      if (nextListItem != null) {
        nextListItem.selectStart();
        const dom = editor.getElementByKey(nextListItem.__key);
        if (dom != null) {
          event.preventDefault();
          setTimeout(() => {
            dom.focus();
          }, 0);
        }
      }
    });
  }
  return false;
}

export { CheckListPlugin };
