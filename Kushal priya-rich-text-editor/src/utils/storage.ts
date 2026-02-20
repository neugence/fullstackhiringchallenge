const STORAGE_KEY = 'lexical-editor-state'

export function saveEditorState(serializedState: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, serializedState)
  } catch {
    return
  }
}

export function loadEditorState(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function clearEditorState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}