import { useEffect } from 'react';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_LOW,
    createCommand,
    LexicalCommand,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';

export const FORMAT_COLOR_COMMAND: LexicalCommand<string> = createCommand(
    'FORMAT_COLOR_COMMAND'
);
export const FORMAT_BG_COLOR_COMMAND: LexicalCommand<string> = createCommand(
    'FORMAT_BG_COLOR_COMMAND'
);
export const FORMAT_FONT_FAMILY_COMMAND: LexicalCommand<string> = createCommand(
    'FORMAT_FONT_FAMILY_COMMAND'
);
export const FORMAT_FONT_SIZE_COMMAND: LexicalCommand<string> = createCommand(
    'FORMAT_FONT_SIZE_COMMAND'
);

export function TextFormatPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                FORMAT_COLOR_COMMAND,
                (color) => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, { color });
                    }
                    return true;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                FORMAT_BG_COLOR_COMMAND,
                (bgColor) => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, { 'background-color': bgColor });
                    }
                    return true;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                FORMAT_FONT_FAMILY_COMMAND,
                (fontFamily) => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, { 'font-family': fontFamily });
                    }
                    return true;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                FORMAT_FONT_SIZE_COMMAND,
                (fontSize) => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, { 'font-size': fontSize });
                    }
                    return true;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor]);

    return null;
}
