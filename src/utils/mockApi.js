/**
 * mockApi.js
 *
 * Simulates a REST backend using localStorage.
 * Each function is structured so a real fetch() call can replace it
 * without changing call sites in the stores.
 *
 * Document shape:
 * {
 *   id: string,
 *   title: string,
 *   content: string,   // serialized Lexical JSON
 *   preview: string,   // plain text excerpt (first ~120 chars)
 *   createdAt: string, // ISO
 *   updatedAt: string, // ISO
 * }
 */

const STORAGE_KEY = 'lexical-editor-documents'
const DELAY = 150 // ms simulated latency

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const readStore = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

const writeStore = (docs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}

/**
 * Extract a plain-text preview from a serialized Lexical editor state JSON.
 * Walks the node tree and collects text from TextNodes.
 */
export function extractPreview(serializedState, maxLength = 120) {
    try {
        const state = typeof serializedState === 'string'
            ? JSON.parse(serializedState)
            : serializedState
        const texts = []
        const walk = (node) => {
            if (node.type === 'text' && node.text) texts.push(node.text)
            if (node.children) node.children.forEach(walk)
        }
        walk(state.root)
        const full = texts.join(' ').replace(/\s+/g, ' ').trim()
        return full.length > maxLength ? full.slice(0, maxLength) + '…' : full
    } catch {
        return ''
    }
}

export const mockApi = {
    /** GET /documents — list all documents, newest first */
    async getAll() {
        await delay(DELAY)
        return readStore()
    },

    /** GET /documents/:id */
    async getOne(id) {
        await delay(DELAY)
        const docs = readStore()
        return docs.find((d) => d.id === id) || null
    },

    /** POST /documents */
    async create(payload) {
        await delay(DELAY)
        const docs = readStore()
        const doc = {
            id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            title: payload.title || 'Untitled Document',
            content: payload.content || '',
            preview: payload.content ? extractPreview(payload.content) : '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        docs.unshift(doc) // newest first
        writeStore(docs)
        return doc
    },

    /** PATCH /documents/:id */
    async update(id, payload) {
        await delay(DELAY)
        const docs = readStore()
        const idx = docs.findIndex((d) => d.id === id)
        if (idx === -1) throw new Error(`Document ${id} not found`)
        const updated = {
            ...docs[idx],
            ...payload,
            preview: payload.content ? extractPreview(payload.content) : docs[idx].preview,
            updatedAt: new Date().toISOString(),
        }
        docs[idx] = updated
        writeStore(docs)
        return updated
    },

    /** DELETE /documents/:id */
    async delete(id) {
        await delay(DELAY)
        const docs = readStore()
        writeStore(docs.filter((d) => d.id !== id))
        return { success: true }
    },
}
