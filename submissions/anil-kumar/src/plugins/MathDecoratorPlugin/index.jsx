import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createPortal } from 'react-dom';
import MathComponent from '../../nodes/MathComponent';

// Lexical's decorator nodes don't render React by default — they just
// return data from decorate(). This plugin listens for those decorators
// and uses portals to render MathComponent into each node's DOM element.
export default function MathDecoratorPlugin() {
    const [editor] = useLexicalComposerContext();
    const [decorators, setDecorators] = useState({});

    useEffect(() => {
        return editor.registerDecoratorListener((next) => {
            setDecorators({ ...next });
        });
    }, [editor]);

    return Object.entries(decorators).map(([nodeKey, data]) => {
        if (!data || data.type !== 'math') return null;

        const el = editor.getElementByKey(nodeKey);
        if (!el) return null;

        return createPortal(
            <MathComponent
                key={nodeKey}
                nodeKey={nodeKey}
                latex={data.latex}
                inline={data.inline}
                editor={editor}
            />,
            el
        );
    });
}
