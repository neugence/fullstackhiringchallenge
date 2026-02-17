import { 
  $createParagraphNode, 
  COMMAND_PRIORITY_LOW, 
  KEY_ENTER_COMMAND,
  $getSelection, 
  $isRangeSelection, 
  $isTextNode
} from 'lexical';
import { $isCodeNode } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export function CodeBlockExitPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return false;
        }

        const anchor = selection.anchor;
        const node = anchor.getNode();
        
        // Find the nearest CodeNode parent
        const codeNode = node.getNodesBetween(node).find($isCodeNode) || 
                         node.getParentKeys().map(key => editor.getEditorState()._nodeMap.get(key)).find($isCodeNode);

        if ($isCodeNode(codeNode)) {
          const textContent = codeNode.getTextContent();
          const selectionIndex = anchor.offset;

          // LOGIC: If the user hits Enter at the very end of the code block 
          // AND the last character is a newline (meaning they hit enter twice)
          if (selectionIndex === textContent.length && textContent.endsWith('\n')) {
            event?.preventDefault(); // Stop Lexical from adding another newline
            
editor.update(() => {
  const children = codeNode.getChildren();
  const lastChild = children[children.length - 1];

  // Use the Lexical type guard to narrow the type to TextNode
  if ($isTextNode(lastChild)) {
    const text = lastChild.getTextContent();
    if (text.endsWith('\n')) {
      lastChild.setTextContent(text.slice(0, -1));
    }
  }

  const newParagraph = $createParagraphNode();
  codeNode.insertAfter(newParagraph);
  newParagraph.select();
});
            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}