import {
    TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    COMMAND_PRIORITY_LOW,
    createCommand,
    type LexicalCommand,
    CLICK_COMMAND,
} from 'lexical';
import { useEffect } from 'react';
import { mergeRegister } from '@lexical/utils';

export const INSERT_LINK_COMMAND: LexicalCommand<string | null> = createCommand<string | null>('INSERT_LINK_COMMAND');

export function CustomLinkPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                INSERT_LINK_COMMAND,
                (url: string | null) => {
                    if (!url) {
                        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                        return true;
                    }

                    // Validate URL - add https:// if missing protocol
                    let validUrl = url;
                    if (!/^(https?:\/\/|mailto:|tel:)/i.test(url)) {
                        validUrl = 'https://' + url;
                    }

                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, validUrl);
                    return true;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                CLICK_COMMAND,
                (payload) => {
                    const event = payload;
                    const target = event.target as HTMLElement;

                    // Simple check for A tag to avoid expensive Lexical lookups if not needed
                    const closestLink = target.closest('a');
                    if (!closestLink) return false;

                    // Open link directly
                    window.open(closestLink.href, '_blank');
                    return true;
                },
                COMMAND_PRIORITY_LOW
            )
        )
    }, [editor]);

    return null;
}
