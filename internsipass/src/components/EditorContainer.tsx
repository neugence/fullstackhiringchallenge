import LexicalEditor from '../editor/LexicalEditor';

/**
 * EditorContainer
 *
 * Top-level layout wrapper. Separates layout concerns
 * from editor internals. Can later add sidebar, footer, etc.
 */
export default function EditorContainer() {
    return (
        <div className="editor-container">
            <header className="editor-header">
                <h1 className="editor-title">📝 Document Editor</h1>
            </header>
            <main className="editor-main">
                <LexicalEditor />
            </main>
        </div>
    );
}
