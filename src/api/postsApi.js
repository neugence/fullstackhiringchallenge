const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'API request failed')
  }

  return response.status === 204 ? null : response.json()
}

export const postsApi = {
  list: () => request('/posts/'),
  createDraft: () =>
    request('/posts/', {
      method: 'POST',
      body: JSON.stringify({ title: 'Untitled draft' }),
    }),
  update: (id, payload) =>
    request(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  publish: (id) =>
    request(`/posts/${id}/publish`, {
      method: 'POST',
    }),
  generateSummary: (content) =>
    request('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ task: 'summary', content }),
    }),
}
