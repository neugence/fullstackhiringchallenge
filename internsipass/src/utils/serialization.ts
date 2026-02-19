import type { EditorState } from 'lexical';

const STORAGE_KEY = 'lexical-editor-state';

/**
 * Serialize editor state to a JSON string.
 * Pure function — no side effects.
 */
export function serializeEditorState(editorState: EditorState): string {
  return JSON.stringify(editorState.toJSON());
}

/**
 * Attempt to parse a JSON string back into a serialized editor-state object.
 * Returns null if the string is missing or malformed.
 */
export function deserializeEditorState(json: string | null): string | null {
  if (!json) return null;
  try {
    JSON.parse(json); // validate
    return json;
  } catch {
    return null;
  }
}

/**
 * Persist serialized state to localStorage.
 */
export function saveToLocalStorage(serialized: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.warn('Failed to save editor state to localStorage', e);
  }
}

/**
 * Load serialized state from localStorage.
 */
export function loadFromLocalStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to load editor state from localStorage', e);
    return null;
  }
}
