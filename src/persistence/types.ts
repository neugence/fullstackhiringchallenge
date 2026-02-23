/** Persistence contract. Swap adapter in persistence/index for API later. */
export type PersistenceAdapter = {
  load: () => Promise<string | null>
  save: (content: string) => Promise<void>
}
