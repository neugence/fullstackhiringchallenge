import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import type { JSX } from 'react';

export default function EditorErrorBoundary(props: { children: JSX.Element; onError: (error: Error) => void }): JSX.Element {
    return (
        <LexicalErrorBoundary
            onError={(error) => {
                props.onError(error);
                console.error('Lexical Error:', error);
            }}
        >
            {props.children}
        </LexicalErrorBoundary>
    );
}
