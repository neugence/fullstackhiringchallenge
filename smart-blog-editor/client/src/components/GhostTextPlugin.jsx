import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createTextNode,
  COMMAND_PRIORITY_HIGH,
  KEY_TAB_COMMAND,
  KEY_DOWN_COMMAND
} from 'lexical';
import { $createGhostTextNode, $isGhostTextNode } from '../nodes/GhostTextNode';
import { streamAutocomplete } from '../services/aiService';

export default function GhostTextPlugin() {
  const [editor] = useLexicalComposerContext();
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);
  // Counter no longer needed — Tab acceptance is tagged 'accept-ghost'
  const justAcceptedRef = useRef(0);

  // Helper to clear existing ghost node from editor
  const clearGhostNode = () => {
    editor.update(() => {
      const root = $getRoot();
      root.getChildren().forEach((child) => {
        if (child.getChildren) {
          child.getChildren().forEach((node) => {
            if ($isGhostTextNode(node)) {
              node.remove();
            }
          });
        }
      });
    }, { tag: 'skip-collab' });
  };

  // Helper to abort active stream
  const abortStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    // Command listener for TAB key to accept ghost text
    const unregisterTab = editor.registerCommand(
      KEY_TAB_COMMAND,
      (event) => {
        // Read-only check: is there a ghost node to accept?
        let hasGhost = false;
        editor.getEditorState().read(() => {
          const root = $getRoot();
          root.getChildren().forEach((child) => {
            if (child.getChildren) {
              child.getChildren().forEach((node) => {
                if ($isGhostTextNode(node) && node.getTextContent()) {
                  hasGhost = true;
                }
              });
            }
          });
        });

        if (!hasGhost) return false;

        event.preventDefault();
        abortStream();
        // Clear any pending debounce
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
        // Set flag BEFORE editor.update() — Lexical may flush the update
        // synchronously inside the command dispatch, so the flag must be
        // true before the update listener has a chance to fire.
        // Use a counter of 2 to absorb both the ghost-removal and
        // regular-insertion dirty updates Lexical may emit separately.
        // (Now also tagged 'accept-ghost' so the update listener skips it by tag.)
        justAcceptedRef.current = 2;

        editor.update(() => {
          const root = $getRoot();
          root.getChildren().forEach((child) => {
            if (child.getChildren) {
              child.getChildren().forEach((node) => {
                if ($isGhostTextNode(node)) {
                  const text = node.getTextContent();
                  if (text) {
                    const regularNode = $createTextNode(text);
                    node.replace(regularNode);
                    // Move cursor to end of the accepted text
                    regularNode.select(text.length, text.length);
                  } else {
                    node.remove();
                  }
                }
              });
            }
          });
        }, { tag: 'accept-ghost' });

        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    // Command listener for keydown to cancel ghost text on typing
    const unregisterKeyDown = editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        if (event.key !== 'Tab') {
          abortStream();
          clearGhostNode();
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );

    // Editor update listener for debouncing stream requests
    const unregisterUpdate = editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves, tags }) => {
      // Skip updates caused by ghost text (skip-collab) or Tab acceptance (accept-ghost)
      if (tags.has('skip-collab') || tags.has('accept-ghost') || tags.has('collaboration') || tags.has('historic')) {
        return;
      }

      // Skip pure selection / cursor moves — only react to actual content edits
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
        return;
      }

      // User typed something new — abort any running stream and clear stale ghost text
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      abortStream();
      clearGhostNode();

      debounceTimerRef.current = setTimeout(async () => {
        let currentText = '';
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchor = selection.anchor;
            const node = anchor.getNode();
            currentText = node.getTextContent().substring(0, anchor.offset);
          } else {
            currentText = $getRoot().getTextContent();
          }
        });

        if (!currentText.trim()) return;

        abortStream();
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
          await streamAutocomplete(currentText, abortController.signal, (accumulatedGhostText) => {
            editor.update(() => {
              let foundGhost = false;
              const root = $getRoot();
              root.getChildren().forEach((child) => {
                if (child.getChildren) {
                  child.getChildren().forEach((node) => {
                    if ($isGhostTextNode(node)) {
                      node.setTextContent(accumulatedGhostText);
                      foundGhost = true;
                    }
                  });
                }
              });

              if (!foundGhost) {
                const root = $getRoot();
                const lastChild = root.getLastChild();
                const ghostNode = $createGhostTextNode(accumulatedGhostText);
                if (lastChild && typeof lastChild.append === 'function') {
                  lastChild.append(ghostNode);
                } else {
                  root.append(ghostNode);
                }
              }
            }, { tag: 'skip-collab' });
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Ghost text streaming error:', err);
          }
        }
      }, 1200);
    });

    return () => {
      unregisterTab();
      unregisterKeyDown();
      unregisterUpdate();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      abortStream();
    };
  }, [editor]);

  return null;
}
