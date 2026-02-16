import { useEffect, useCallback, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from 'lexical';

import EditorToolbar from './EditorToolbar';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useBlogStore, Post } from '@/stores/useBlogStore';

function RestorePlugin({ content }: { content: any }) {
  const [editor] = useLexicalComposerContext();
  const hasRestored = useRef(false);

  useEffect(() => {
    if (content && !hasRestored.current) {
      hasRestored.current = true;
      const editorState = editor.parseEditorState(JSON.stringify(content));
      editor.setEditorState(editorState);
    }
  }, [content, editor]);

  return null;
}

function AutoSavePlugin({ postId }: { postId: string }) {
  const [editor] = useLexicalComposerContext();
  const { debouncedSave } = useAutoSave(postId);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const json = editorState.toJSON();
        const html = $generateHtmlFromNodes(editor);
        debouncedSave({ content: json, html_content: html });
      });
    },
    [editor, debouncedSave]
  );

  return <OnChangePlugin onChange={handleChange} ignoreSelectionChange />;
}

interface BlogEditorProps {
  post: Post;
}

export default function BlogEditor({ post }: BlogEditorProps) {
  const updatePost = useBlogStore(state => state.updatePost);
  const { debouncedSave } = useAutoSave(post.id);

  const initialConfig = {
    namespace: 'BlogEditor',
    theme: {
      root: 'editor-input',
      paragraph: '',
      heading: {
        h1: '',
        h2: '',
        h3: '',
      },
      list: {
        ul: '',
        ol: '',
        listitem: '',
      },
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    onError: (error: Error) => console.error(error),
  };

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <input
        type="text"
        defaultValue={post.title}
        onChange={(e) => debouncedSave({ title: e.target.value })}
        placeholder="Post title..."
        className="text-4xl font-serif font-bold bg-transparent border-none outline-none px-8 pt-8 pb-4 text-foreground placeholder:text-muted-foreground"
      />

      {/* Editor */}
      <LexicalComposer initialConfig={initialConfig} key={post.id}>
        <EditorToolbar />
        <div className="flex-1 px-8 py-6 bg-editor relative">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={
              <div className="editor-placeholder">Start writing your story...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <AutoSavePlugin postId={post.id} />
          {post.content && <RestorePlugin content={post.content} />}
        </div>
      </LexicalComposer>
    </div>
  );
}
