import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
} from 'lexical'
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
} from '@lexical/list'
import { $getNearestNodeOfType } from '@lexical/utils'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { useState, useCallback } from 'react'

const LowPriority = 1

function Divider() {
    return <div className="w-px h-6 bg-gray-300 mx-1" />
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext()
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [blockType, setBlockType] = useState('paragraph')

    const updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))

            // Update block type
            const anchorNode = selection.anchor.getNode()
            const element =
                anchorNode.getKey() === 'root'
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow()

            const elementKey = element.getKey()
            const elementDOM = editor.getElementByKey(elementKey)

            if (elementDOM !== null) {
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode)
                    const type = parentList ? parentList.getTag() : element.getTag()
                    setBlockType(type)
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType()
                    setBlockType(type)
                }
            }
        }
    }, [editor])

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar()
            })
        })
    }, [editor, updateToolbar])

    const formatText = (format) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
    }

    const formatHeading = (headingSize) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                    const node = $createHeadingNode(headingSize)
                    selection.insertNodes([node])
                }
            })
        }
    }

    const formatList = (listType) => {
        if (listType === 'ul') {
            if (blockType !== 'ul') {
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)
            } else {
                editor.dispatchCommand(REMOVE_LIST_COMMAND)
            }
        } else {
            if (blockType !== 'ol') {
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)
            } else {
                editor.dispatchCommand(REMOVE_LIST_COMMAND)
            }
        }
    }

    return (
        <div className="toolbar">
            <button
                onClick={() => formatText('bold')}
                className={`toolbar-button ${isBold ? 'active' : ''}`}
                aria-label="Format Bold"
            >
                <strong>B</strong>
            </button>
            <button
                onClick={() => formatText('italic')}
                className={`toolbar-button ${isItalic ? 'active' : ''}`}
                aria-label="Format Italic"
            >
                <em>I</em>
            </button>
            <button
                onClick={() => formatText('underline')}
                className={`toolbar-button ${isUnderline ? 'active' : ''}`}
                aria-label="Format Underline"
            >
                <u>U</u>
            </button>

            <Divider />

            <button
                onClick={() => formatHeading('h1')}
                className={`toolbar-button ${blockType === 'h1' ? 'active' : ''}`}
                aria-label="Heading 1"
            >
                H1
            </button>
            <button
                onClick={() => formatHeading('h2')}
                className={`toolbar-button ${blockType === 'h2' ? 'active' : ''}`}
                aria-label="Heading 2"
            >
                H2
            </button>
            <button
                onClick={() => formatHeading('h3')}
                className={`toolbar-button ${blockType === 'h3' ? 'active' : ''}`}
                aria-label="Heading 3"
            >
                H3
            </button>

            <Divider />

            <button
                onClick={() => formatList('ul')}
                className={`toolbar-button ${blockType === 'ul' ? 'active' : ''}`}
                aria-label="Bulleted List"
            >
                • List
            </button>
            <button
                onClick={() => formatList('ol')}
                className={`toolbar-button ${blockType === 'ol' ? 'active' : ''}`}
                aria-label="Numbered List"
            >
                1. List
            </button>
        </div>
    )
}
