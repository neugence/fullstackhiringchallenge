/**
 * ToolbarPlugin.jsx
 *
 * Reads editor selection state on every change and syncs it
 * to the UI store. This plugin does NOT render any toolbar UI —
 * it is purely a state synchronization layer between Lexical and Zustand.
 *
 * The actual toolbar buttons live in the Toolbar component.
 */
import { useEffect, useCallback } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    $getSelection,
    $isRangeSelection,
    $isRootOrShadowRoot,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
} from 'lexical'
import { $isHeadingNode } from '@lexical/rich-text'
import { $isListNode, ListNode } from '@lexical/list'
import { $getNearestNodeOfType, mergeRegister, $findMatchingParent } from '@lexical/utils'
import { useUIStore } from '../store/uiStore'

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext()
    const setFormats = useUIStore((s) => s.setFormats)
    const setBlockType = useUIStore((s) => s.setBlockType)

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
            // Text format flags
            setFormats({
                isBold: selection.hasFormat('bold'),
                isItalic: selection.hasFormat('italic'),
                isUnderline: selection.hasFormat('underline'),
                isStrikethrough: selection.hasFormat('strikethrough'),
                isCode: selection.hasFormat('code'),
            })

            // Block type detection: walk up to find the top-level element
            const anchorNode = selection.anchor.getNode()
            let element =
                anchorNode.getKey() === 'root'
                    ? anchorNode
                    : $findMatchingParent(anchorNode, (e) => {
                        const parent = e.getParent()
                        return parent !== null && $isRootOrShadowRoot(parent)
                    })

            if (element === null) {
                element = anchorNode.getTopLevelElementOrThrow()
            }

            const elementKey = element.getKey()
            const elementDOM = editor.getElementByKey(elementKey)

            if (elementDOM !== null) {
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode)
                    const type = parentList ? parentList.getListType() : element.getListType()
                    setBlockType(type)
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType()
                    setBlockType(type)
                }
            }
        }
    }, [editor, setFormats, setBlockType])

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar()
                })
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    // SELECTION_CHANGE_COMMAND fires inside an update context
                    updateToolbar()
                    return false
                },
                COMMAND_PRIORITY_CRITICAL
            )
        )
    }, [editor, updateToolbar])

    // This plugin renders nothing — it just syncs state
    return null
}
