/**
 * Service for persisting editor state to localStorage.
 * Simulated as an async API for future scalability.
 */

const STORAGE_KEY = 'lexical_editor_content';

export const documentService = {
  async saveDocument(content: string): Promise<void> {
    return new Promise((resolve) => {
      // Simulate API latency
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, content);
        resolve();
      }, 100);
    });
  },

  async loadDocument(): Promise<string | null> {
    return new Promise((resolve) => {
      // Simulate API latency
      setTimeout(() => {
        const content = localStorage.getItem(STORAGE_KEY);
        resolve(content);
      }, 100);
    });
  }
};
