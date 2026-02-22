const STORAGE_KEY = 'document-editor-content';

/**
 * Persistence layer: save/load as JSON.
 * Structured so this could be replaced with real API calls
 * (e.g. saveDocument could POST, loadDocument could GET).
 */

export function saveDocument(json) {
  try {
    localStorage.setItem(STORAGE_KEY, json);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e };
  }
}

export function loadDocument() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}
