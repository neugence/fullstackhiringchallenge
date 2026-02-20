import {
    DecoratorNode,
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from 'lexical';
import { lazy, Suspense } from 'react';

const VideoComponent = lazy(() => import('../components/VideoComponent'));

export interface VideoPayload {
    src: string;
    height?: number;
    width?: number;
    key?: NodeKey;
}

export type SerializedVideoNode = Spread<
    {
        src: string;
        height?: number;
        width?: number;
    },
    SerializedLexicalNode
>;

export class VideoNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __width: number;
    __height: number;

    static getType(): string {
        return 'video';
    }

    static clone(node: VideoNode): VideoNode {
        return new VideoNode(
            node.__src,
            node.__width,
            node.__height,
            node.__key,
        );
    }

    static importJSON(serializedNode: SerializedVideoNode): VideoNode {
        const { height, width, src } = serializedNode;
        return $createVideoNode({
            height,
            src,
            width,
        });
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('iframe');
        element.setAttribute('src', this.__src);
        element.setAttribute('width', this.__width.toString());
        element.setAttribute('height', this.__height.toString());
        element.setAttribute('frameborder', '0');
        element.setAttribute('allowfullscreen', 'true');
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            iframe: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('src')) {
                    return null;
                }
                return {
                    conversion: convertVideoElement,
                    priority: 1,
                };
            },
        };
    }

    constructor(
        src: string,
        width: number = 560,
        height: number = 315,
        key?: NodeKey,
    ) {
        super(key);
        this.__src = src;
        this.__width = width;
        this.__height = height;
    }

    exportJSON(): SerializedVideoNode {
        return {
            height: this.__height,
            src: this.__src,
            type: 'video',
            version: 1,
            width: this.__width,
        };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement('span');
        const theme = config.theme;
        const className = theme.image; // Reusing image theme for now
        if (className !== undefined) {
            span.className = className;
        }
        return span;
    }

    updateDOM(): boolean {
        return false;
    }

    getSrc(): string {
        return this.__src;
    }

    decorate(): JSX.Element {
        return (
            <Suspense fallback={null}>
                <VideoComponent
                    src={this.__src}
                    width={this.__width}
                    height={this.__height}
                    nodeKey={this.getKey()}
                />
            </Suspense>
        );
    }
}

function convertVideoElement(domNode: HTMLElement): null | DOMConversionOutput {
    const src = domNode.getAttribute('src');
    if (src) {
        const node = $createVideoNode({ src });
        return { node };
    }
    return null;
}

export function $createVideoNode({
    src,
    height = 315,
    width = 560,
}: VideoPayload): VideoNode {
    return new VideoNode(
        src,
        width,
        height,
    );
}

export function $isVideoNode(
    node: LexicalNode | null | undefined,
): node is VideoNode {
    return node instanceof VideoNode;
}
