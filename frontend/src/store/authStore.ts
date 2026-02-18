import { create } from 'zustand'

import { authApi } from '../lib/api'

type AuthMode = 'login' | 'signup'

type AuthState = {
  token: string | null
  mode: AuthMode
  isLoading: boolean
  error: string | null
  setMode: (mode: AuthMode) => void
  submit: (email: string, password: string) => Promise<void>
  logout: () => void
}

const tokenFromStorage = localStorage.getItem('smart_blog_token')

export const useAuthStore = create<AuthState>((set, get) => ({
  token: tokenFromStorage,
  mode: 'login',
  isLoading: false,
  error: null,
  setMode: (mode) => set({ mode, error: null }),
  submit: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const { mode } = get()
      const response = mode === 'login'
        ? await authApi.login(email, password)
        : await authApi.signup(email, password)
      localStorage.setItem('smart_blog_token', response.access_token)
      set({ token: response.access_token, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Authentication failed',
        isLoading: false,
      })
    }
  },
  logout: () => {
    localStorage.removeItem('smart_blog_token')
    set({ token: null })
  },
}))
