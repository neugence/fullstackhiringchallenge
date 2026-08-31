import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { API_BASE_URL } from './api';

/**
 * Creates or retrieves a Yjs document and connects it to the WebSocket relay server.
 * Automatically resolves to ws:// for localhost and wss:// for deployed HTTPS backends.
 *
 * @param {string} id Document ID
 * @param {Map<string, Y.Doc>} yjsDocMap Yjs doc cache map
 * @returns {WebsocketProvider}
 */
export function createYjsProvider(id, yjsDocMap) {
  let doc = yjsDocMap.get(id);
  if (!doc) {
    doc = new Y.Doc();
    yjsDocMap.set(id, doc);
  }

  // Derive WebSocket URL from VITE_WS_URL or API_BASE_URL (http -> ws, https -> wss)
  const wsBaseUrl = (import.meta.env.VITE_WS_URL || API_BASE_URL)
    .replace(/^http:\/\//i, 'ws://')
    .replace(/^https:\/\//i, 'wss://')
    .replace(/\/+$/, '');

  const wsUrl = `${wsBaseUrl}/ws`;

  return new WebsocketProvider(wsUrl, id, doc, { connect: true });
}
