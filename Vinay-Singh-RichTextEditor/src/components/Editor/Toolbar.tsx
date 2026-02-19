import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
    $getSelection,
    $isRangeSelection,
} from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Undo, Redo, Table, Sigma } from 'lucide-react';
import clsx from 'clsx';
import { INSERT_MATH_COMMAND } from '../Plugins/MathPlugin';

const LowPriority = 1;

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateToolbar();
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority,
            ),
        );
    }, [editor, updateToolbar]);

    return (
        <div className="toolbar">
            <button
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                className="toolbar-button"
                title="Undo"
            >
                <Undo size={18} />
            </button>
            <button
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                className="toolbar-button"
                title="Redo"
            >
                <Redo size={18} />
            </button>
            <div className="toolbar-divider" />
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                className={clsx('toolbar-button', isBold && 'active')}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                className={clsx('toolbar-button', isItalic && 'active')}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                className={clsx('toolbar-button', isUnderline && 'active')}
                title="Underline"
            >
                <Underline size={18} />
            </button>
            <div className="toolbar-divider" />
            <button
                onClick={() => {
                    editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3' });
                }}
                className="toolbar-button"
                title="Insert Table"
            >
                <Table size={18} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(INSERT_MATH_COMMAND, undefined);
                }}
                className="toolbar-button"
                title="Insert Math"
            >
                <Sigma size={18} />
            </button>
        </div>
    );
}
