import { TextNode } from 'lexical';

export class GhostTextNode extends TextNode {
  static getType() {
    return 'ghost-text';
  }

  static clone(node) {
    return new GhostTextNode(node.__text, node.__key);
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.className = 'text-gray-400 opacity-60 italic pointer-events-none select-none';
    return dom;
  }

  updateDOM(prevNode, dom, config) {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    dom.className = 'text-gray-400 opacity-60 italic pointer-events-none select-none';
    return isUpdated;
  }

  static importJSON(serializedNode) {
    const node = $createGhostTextNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'ghost-text',
      version: 1,
    };
  }
}

export function $createGhostTextNode(text) {
  return new GhostTextNode(text);
}

export function $isGhostTextNode(node) {
  return node instanceof GhostTextNode;
}
