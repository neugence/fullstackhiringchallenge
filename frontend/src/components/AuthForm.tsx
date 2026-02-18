import { FormEvent, useState } from 'react'

import { useAuthStore } from '../store/authStore'

export const AuthForm = () => {
  const mode = useAuthStore((state) => state.mode)
  const setMode = useAuthStore((state) => state.setMode)
  const submit = useAuthStore((state) => state.submit)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submit(email, password)
  }

  return (
    <div className="mx-auto mt-24 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Smart Blog Editor</h1>
      <p className="mt-1 text-sm text-zinc-500">{mode === 'login' ? 'Login to continue' : 'Create your account'}</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign up'}
        </button>
      </form>

      <button
        className="mt-4 text-sm text-zinc-600 underline"
        type="button"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
      >
        {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
      </button>
    </div>
  )
}
