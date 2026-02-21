/**
 * Toolbar.jsx
 *
 * Editor toolbar UI. Reads formatting/block-type state from Zustand
 * and dispatches Lexical commands. Has no direct access to editor
 * state — all state syncing is handled by ToolbarPlugin.
 *
 * Icon paths are imported from utils/icons.js to keep this file
 * focused on behavior rather than SVG strings.
 */
import React from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
} from 'lexical'
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical'
import { $createCodeNode } from '@lexical/code'
import { useUIStore } from '../store/uiStore'
import { useEditorStore } from '../store/editorStore'
import { INSERT_TABLE_COMMAND } from '../plugins/TableActionPlugin'
import icons from '../utils/icons'

// Shared SVG renderer — accepts a path `d` from utils/icons.js
const Icon = ({ d, size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d={d} />
    </svg>
)


const ToolbarButton = ({ onClick, active, title, children, disabled }) => (
    <button
        className={`toolbar-btn ${active ? 'toolbar-btn--active' : ''} ${disabled ? 'toolbar-btn--disabled' : ''}`}
        onClick={onClick}
        title={title}
        disabled={disabled}
        aria-pressed={active}
        type="button"
    >
        {children}
    </button>
)

const Divider = () => <div className="toolbar-divider" />

export default function Toolbar() {
    const [editor] = useLexicalComposerContext()

    const {
        isBold, isItalic, isUnderline, isStrikethrough, isCode,
        blockType, openTableModal, openMathModal, setEditingMathNode,
    } = useUIStore((s) => ({
        isBold: s.isBold,
        isItalic: s.isItalic,
        isUnderline: s.isUnderline,
        isStrikethrough: s.isStrikethrough,
        isCode: s.isCode,
        blockType: s.blockType,
        openTableModal: s.openTableModal,
        openMathModal: s.openMathModal,
        setEditingMathNode: s.setEditingMathNode,
    }))

    const { saveDocument, isSaving } = useEditorStore((s) => ({
        saveDocument: s.saveDocument,
        isSaving: s.isSaving,
    }))

    const formatBlock = (type) => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                if (type === 'paragraph') {
                    $setBlocksType(selection, () => $createParagraphNode())
                } else if (type === 'h1' || type === 'h2' || type === 'h3') {
                    $setBlocksType(selection, () => $createHeadingNode(type))
                } else if (type === 'quote') {
                    $setBlocksType(selection, () => $createQuoteNode())
                } else if (type === 'code') {
                    $setBlocksType(selection, () => $createCodeNode())
                }
            }
        })
    }

    const toggleList = (type) => {
        if (type === 'bullet') {
            if (blockType === 'bullet') {
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            } else {
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            }
        } else {
            if (blockType === 'number') {
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            } else {
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            }
        }
    }

    const handleInsertMath = () => {
        setEditingMathNode(null) // null means "inserting new"
        openMathModal()
    }

    return (
        <div className="toolbar" role="toolbar" aria-label="Editor toolbar">
            {/* History */}
            <ToolbarButton title="Undo (Ctrl+Z)" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
                <Icon d={icons.undo} />
            </ToolbarButton>
            <ToolbarButton title="Redo (Ctrl+Y)" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
                <Icon d={icons.redo} />
            </ToolbarButton>

            <Divider />

            {/* Block type selector */}
            <select
                className="toolbar-select"
                value={blockType}
                onChange={(e) => {
                    const val = e.target.value
                    if (val === 'bullet' || val === 'number') {
                        toggleList(val)
                    } else {
                        formatBlock(val)
                    }
                }}
                aria-label="Block type"
            >
                <option value="paragraph">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="quote">Quote</option>
                <option value="code">Code</option>
                <option value="bullet">Bullet List</option>
                <option value="number">Numbered List</option>
            </select>

            <Divider />

            {/* Text formatting */}
            <ToolbarButton active={isBold} title="Bold (Ctrl+B)" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
                <Icon d={icons.bold} />
            </ToolbarButton>
            <ToolbarButton active={isItalic} title="Italic (Ctrl+I)" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
                <Icon d={icons.italic} />
            </ToolbarButton>
            <ToolbarButton active={isUnderline} title="Underline (Ctrl+U)" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
                <Icon d={icons.underline} />
            </ToolbarButton>
            <ToolbarButton active={isStrikethrough} title="Strikethrough" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>
                <Icon d={icons.strikethrough} />
            </ToolbarButton>
            <ToolbarButton active={isCode} title="Inline Code" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}>
                <Icon d={icons.code} />
            </ToolbarButton>

            <Divider />

            {/* Alignment */}
            <ToolbarButton title="Align Left" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}>
                <Icon d={icons.alignLeft} />
            </ToolbarButton>
            <ToolbarButton title="Align Center" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}>
                <Icon d={icons.alignCenter} />
            </ToolbarButton>
            <ToolbarButton title="Align Right" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}>
                <Icon d={icons.alignRight} />
            </ToolbarButton>

            <Divider />

            {/* Insert: Table */}
            <ToolbarButton title="Insert Table" onClick={openTableModal}>
                <Icon d={icons.table} />
                <span className="toolbar-btn__label">Table</span>
            </ToolbarButton>

            {/* Insert: Math */}
            <ToolbarButton title="Insert Math Expression" onClick={handleInsertMath}>
                <Icon d={icons.math} />
                <span className="toolbar-btn__label">Math</span>
            </ToolbarButton>

            <Divider />

            {/* Save */}
            <ToolbarButton title="Save Document" onClick={saveDocument} disabled={isSaving}>
                <Icon d={icons.save} />
                <span className="toolbar-btn__label">{isSaving ? 'Saving…' : 'Save'}</span>
            </ToolbarButton>
        </div>
    )
}
