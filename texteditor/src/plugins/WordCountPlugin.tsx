import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { $getRoot } from 'lexical';

export default function WordCountPlugin() {
    const [editor] = useLexicalComposerContext();
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const root = $getRoot();
                const content = root.getTextContent();
                const words = content.trim().split(/\s+/).filter(w => w !== '').length;
                setWordCount(words);
                setCharCount(content.length);
            });
        });
    }, [editor]);

    return (
        <div className="flex items-center gap-6 text-xs font-medium text-gray-500 dark:text-gray-400 p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm">
            <span className="flex items-center gap-1.5 has-tooltip" title="Total Words">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {wordCount} Words
            </span>
            <span className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">|</span>
            <span className="flex items-center gap-1.5 has-tooltip" title="Total Characters">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                {charCount} Characters
            </span>
        </div>
    );
}
