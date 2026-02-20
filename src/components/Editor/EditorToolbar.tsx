import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    UNDO_COMMAND,
    REDO_COMMAND,
    createCommand,
} from 'lexical';
import {
    INSERT_TABLE_COMMAND,
    $insertTableRow__EXPERIMENTAL as $insertTableRow,
    $insertTableColumn__EXPERIMENTAL as $insertTableColumn,
    $deleteTableRow__EXPERIMENTAL as $deleteTableRow,
    $deleteTableColumn__EXPERIMENTAL as $deleteTableColumn,
    $isTableCellNode,
    TableCellNode,
} from '@lexical/table';
import { INSERT_MATH_COMMAND } from './plugins/MathPlugin';
import { Bold, Italic, Underline, Table, Sigma, Save, Check, Undo, Redo, Clock, PlusSquare, MinusSquare, Columns, Rows, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';
import { $getNearestNodeOfType } from '@lexical/utils';
import HistoryModal from './HistoryModal';

export default function EditorToolbar() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isTableActive, setIsTableActive] = useState(false);

    const isSaving = useEditorStore((state) => state.isSaving);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));

            // Check if inside table
            const node = selection.anchor.getNode();
            const tableCell = $getNearestNodeOfType(node, TableCellNode);
            setIsTableActive(tableCell !== null);
        } else {
            setIsTableActive(false);
        }
    }, []);

    useEffect(() => {
        const unregisterSelection = editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateToolbar();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );

        const unregisterUndo = editor.registerCommand(
            createCommand('CAN_UNDO_COMMAND'),
            (payload: boolean) => {
                setCanUndo(payload);
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );

        const unregisterRedo = editor.registerCommand(
            createCommand('CAN_REDO_COMMAND'),
            (payload: boolean) => {
                setCanRedo(payload);
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );

        return () => {
            unregisterSelection();
        };
    }, [editor, updateToolbar]);

    const insertTable = () => {
        const rows = prompt('Enter number of rows:', '3');
        const columns = prompt('Enter number of columns:', '3');
        if (rows && columns) {
            editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows });
        }
    };

    const insertMath = () => {
        const equation = prompt('Enter LaTeX equation:', 'e = mc^2');
        if (equation) {
            editor.dispatchCommand(INSERT_MATH_COMMAND, { equation, inline: true });
        }
    };

    return (
        <div className="editor-toolbar">
            <button
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                className="toolbar-item"
                title="Undo"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                className="toolbar-item"
                title="Redo"
            >
                <Redo size={18} />
            </button>

            <div className="divider" />

            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={`toolbar-item ${isBold ? 'active' : ''}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={`toolbar-item ${isItalic ? 'active' : ''}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={`toolbar-item ${isUnderline ? 'active' : ''}`}
                title="Underline"
            >
                <Underline size={18} />
            </button>

            <div className="divider" />

            <button onClick={insertTable} className="toolbar-item" title="Insert Table">
                <Table size={18} />
            </button>
            <button onClick={insertMath} className="toolbar-item" title="Insert Math">
                <Sigma size={18} />
            </button>

            {isTableActive && (
                <>
                    <div className="divider" />
                    <button
                        onClick={() => editor.update(() => $insertTableRow())}
                        className="toolbar-item"
                        title="Add Row Below"
                    >
                        <Rows size={18} />
                    </button>
                    <button
                        onClick={() => editor.update(() => $insertTableColumn())}
                        className="toolbar-item"
                        title="Add Column Right"
                    >
                        <Columns size={18} />
                    </button>
                    <button
                        onClick={() => editor.update(() => $deleteTableRow())}
                        className="toolbar-item delete"
                        title="Delete Row"
                    >
                        <Trash2 size={18} color="#ef4444" />
                    </button>
                    <button
                        onClick={() => editor.update(() => $deleteTableColumn())}
                        className="toolbar-item delete"
                        title="Delete Column"
                    >
                        <Trash2 size={18} color="#ef4444" style={{ transform: 'rotate(90deg)' }} />
                    </button>
                </>
            )}

            <div className="toolbar-status">
                <button
                    className="toolbar-item"
                    title="Version History"
                    onClick={() => setIsHistoryOpen(true)}
                >
                    <Clock size={18} />
                </button>
                <div className="divider" />
                {isSaving ? (
                    <span className="saving"><Save size={14} /> Saving...</span>
                ) : (
                    <span className="saved"><Check size={14} /> Saved</span>
                )}
            </div>

            <HistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </div>
    );
}
