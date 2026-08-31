import { API_BASE_URL } from './api';
import useStore from '../store';

/**
 * Streams autocomplete completions from the backend SSE endpoint.
 *
 * @param {string} text        Input context text
 * @param {AbortSignal} signal AbortController signal
 * @param {function(string): void} onChunk Callback fired with the accumulated ghost text on each chunk
 */
export async function streamAutocomplete(text, signal, onChunk) {
  if (!text || !text.trim()) return;

  const apiUrl = `${API_BASE_URL}/api/autocomplete`;

  // Attach auth token if available
  const token = useStore.getState().token;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text }),
      signal,
    });
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('[Ghost Text] Fetch error:', err);
    }
    return;
  }

  if (!response.ok) {
    console.error('[Ghost Text] Backend returned', response.status);
    return;
  }

  if (!response.body) {
    console.warn('[Ghost Text] No response body (SSE not supported?)');
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulatedGhostText = '';
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (signal.aborted) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE lines are separated by '\n\n' 
      const parts = buffer.split('\n\n');
      // Keep the incomplete trailing part in buffer
      buffer = parts.pop();

      for (const part of parts) {
        const lines = part.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawJson = line.slice(6).trim();
            if (rawJson) {
              try {
                const textChunk = JSON.parse(rawJson);
                if (typeof textChunk === 'string') {
                  accumulatedGhostText += textChunk;
                }
              } catch {
                // Ignore malformed JSON
              }
            }
          }
        }
      }

      if (accumulatedGhostText && !signal.aborted) {
        onChunk(accumulatedGhostText);
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('[Ghost Text] Stream read error:', err);
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}
