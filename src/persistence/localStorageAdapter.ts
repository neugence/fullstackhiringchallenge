import type { PersistenceAdapter } from './types'

const STORAGE_KEY = 'quantus-editor'

/** localStorage adapter. Replace with API adapter when backend exists. */
export function createLocalStorageAdapter(): PersistenceAdapter {
  return {
    async load() {
      try {
        return window.localStorage.getItem(STORAGE_KEY)
      } catch {
        return null
      }
    },
    async save(content: string) {
      try {
        window.localStorage.setItem(STORAGE_KEY, content)
      } catch (e) {
        console.warn('[Persistence] Save failed', e)
      }
    },
  }
}
