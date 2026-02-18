import type { AuthResponse, Post } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const parseJSON = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(payload.detail ?? 'Request failed')
  }
  return response.json() as Promise<T>
}

const withAuthHeaders = (token: string | null, init?: RequestInit): RequestInit => ({
  ...init,
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers ?? {}),
  },
})

export const authApi = {
  signup: (email: string, password: string) =>
    fetch(`${API_BASE}/api/auth/signup`, withAuthHeaders(null, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })).then((res) => parseJSON<AuthResponse>(res)),

  login: (email: string, password: string) =>
    fetch(`${API_BASE}/api/auth/login`, withAuthHeaders(null, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })).then((res) => parseJSON<AuthResponse>(res)),
}

export const postsApi = {
  list: (token: string) =>
    fetch(`${API_BASE}/api/posts/`, withAuthHeaders(token)).then((res) => parseJSON<Post[]>(res)),

  create: (token: string) =>
    fetch(`${API_BASE}/api/posts/`, withAuthHeaders(token, {
      method: 'POST',
      body: JSON.stringify({ title: 'Untitled', lexical_state: {}, text_content: '' }),
    })).then((res) => parseJSON<Post>(res)),

  update: (
    token: string,
    postId: string,
    payload: Partial<Pick<Post, 'title' | 'lexical_state' | 'text_content'>>,
  ) =>
    fetch(`${API_BASE}/api/posts/${postId}`, withAuthHeaders(token, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })).then((res) => parseJSON<Post>(res)),

  publish: (token: string, postId: string) =>
    fetch(`${API_BASE}/api/posts/${postId}/publish`, withAuthHeaders(token, {
      method: 'POST',
    })).then((res) => parseJSON<Post>(res)),

  remove: async (token: string, postId: string) => {
    const response = await fetch(`${API_BASE}/api/posts/${postId}`, withAuthHeaders(token, {
      method: 'DELETE',
    }))

    if (response.status === 404) {
      return
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ detail: 'Delete failed' }))
      throw new Error(payload.detail ?? 'Delete failed')
    }
  },
}

export const aiApi = {
  async generate(
    token: string,
    mode: 'summary' | 'grammar',
    text: string,
    onChunk: (chunk: string) => void,
  ) {
    const response = await fetch(`${API_BASE}/api/ai/generate`, withAuthHeaders(token, {
      method: 'POST',
      body: JSON.stringify({ mode, text }),
    }))

    if (!response.ok || !response.body) {
      const payload = await response.json().catch(() => ({ detail: 'Unable to stream AI response' }))
      throw new Error(payload.detail ?? 'Unable to stream AI response')
    }

    const decoder = new TextDecoder()
    const reader = response.body.getReader()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() ?? ''

      events.forEach((event) => {
        if (!event.startsWith('data: ')) return
        const chunk = event.replace('data: ', '').trim()
        if (chunk && chunk !== '[DONE]') {
          onChunk(chunk)
        }
      })
    }
  },
}
