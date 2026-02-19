import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

export default function TablePlugin(): React.JSX.Element {
    return <LexicalTablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />;
}
