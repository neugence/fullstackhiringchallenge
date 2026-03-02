import { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getNodeByKey,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
} from 'lexical';
import type { LexicalCommand, LexicalEditor } from 'lexical';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import katex from 'katex';

import { $createMathNode, $isMathNode } from '../nodes/MathNode';
import {
    useEditorStore,
    selectIsMathModalOpen,
    selectMathEditPayload,
} from '../../store/editorStore';

// ---- Commands ----

export const INSERT_MATH_COMMAND: LexicalCommand<void> = createCommand(
    'INSERT_MATH_COMMAND'
);

// ---- Math Edit Modal ----

function MathModal({ editor }: { editor: LexicalEditor }) {
    const isOpen = useEditorStore(selectIsMathModalOpen);
    const payload = useEditorStore(selectMathEditPayload);
    const closeMathModal = useEditorStore((s) => s.closeMathModal);

    const [latex, setLatex] = useState('');
    const previewRef = useRef<HTMLDivElement>(null);

    // Sync local state with store payload when modal opens
    useEffect(() => {
        if (isOpen) {
            setLatex(payload?.initialLatex ?? '');
        }
    }, [isOpen, payload]);

    // Live KaTeX preview
    useEffect(() => {
        if (previewRef.current && latex.trim()) {
            try {
                katex.render(latex, previewRef.current, {
                    throwOnError: false,
                    displayMode: true,
                });
            } catch {
                if (previewRef.current) {
                    previewRef.current.textContent = latex;
                }
            }
        } else if (previewRef.current) {
            previewRef.current.textContent = '';
        }
    }, [latex]);

    const handleSave = useCallback(() => {
        if (!latex.trim()) {
            closeMathModal();
            return;
        }

        editor.update(() => {
            if (payload?.nodeKey) {
                // Edit existing MathNode
                const node = $getNodeByKey(payload.nodeKey);
                if ($isMathNode(node)) {
                    node.setLatex(latex);
                }
            } else {
                // Insert new MathNode
                const mathNode = $createMathNode(latex);
                $insertNodeToNearestRoot(mathNode);
            }
        });

        closeMathModal();
    }, [editor, latex, payload, closeMathModal]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSave();
            } else if (e.key === 'Escape') {
                closeMathModal();
            }
        },
        [handleSave, closeMathModal]
    );

    if (!isOpen) return null;

    return (
        <div className="math-modal-overlay" onClick={closeMathModal}>
            <div
                className="math-modal"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <h3>{payload ? 'Edit Math Expression' : 'Insert Math Expression'}</h3>

                <textarea
                    className="math-modal-input"
                    value={latex}
                    onChange={(e) => setLatex(e.target.value)}
                    placeholder="Enter LaTeX, e.g. E = mc^2"
                    autoFocus
                    rows={3}
                />

                <div className="math-modal-preview" ref={previewRef}>
                    {!latex && <span className="math-modal-placeholder">Preview…</span>}
                </div>

                <div className="math-modal-actions">
                    <button className="btn btn-secondary" onClick={closeMathModal}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        {payload ? 'Update' : 'Insert'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---- Main Plugin ----

export default function MathPlugin(): React.JSX.Element {
    const [editor] = useLexicalComposerContext();

    // Register INSERT_MATH_COMMAND — opens the modal for a new expression
    useEffect(() => {
        return editor.registerCommand(
            INSERT_MATH_COMMAND,
            () => {
                useEditorStore.getState().openMathModal();
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return <MathModal editor={editor} />;
}
