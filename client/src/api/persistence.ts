import type { Post } from '../store/useStore';
import { API_URL } from '../config';

const STORAGE_KEY = 'lexical-document-editor';

export async function loadContent(docId?: string): Promise<string | null> {
  if (docId) {
    try {
      const res = await fetch(`${API_URL}/posts/${docId}`);
      if (res.ok) {
        const post: Post = await res.json();
        return post.content_json ?? null;
      }
    } catch {
      //
    }
  }
  const stored = localStorage.getItem(`${STORAGE_KEY}${docId ? `-${docId}` : ''}`);
  return stored;
}

export async function saveContent(
  contentJson: string,
  docId?: string
): Promise<boolean> {
  if (docId) {
    try {
      const res = await fetch(`${API_URL}/posts/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_json: contentJson }),
      });
      if (res.ok) return true;
    } catch {
      // Fallback to localStorage
    }
  }
  localStorage.setItem(`${STORAGE_KEY}${docId ? `-${docId}` : ''}`, contentJson);
  return true;
}
