import { createLocalStorageAdapter } from './localStorageAdapter'

export type { PersistenceAdapter } from './types'

/** Editor content persistence. Single adapter; swap here for an API later. */
const persistence = createLocalStorageAdapter()

export const loadPersistedContent = (): Promise<string | null> =>
  persistence.load()

export const savePersistedContent = (content: string): Promise<void> =>
  persistence.save(content)
