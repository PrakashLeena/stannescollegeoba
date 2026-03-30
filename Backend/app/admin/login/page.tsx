'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/admin'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl,
    })

    if ((res as any)?.error) setError('Invalid credentials')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white/10 border border-white/10 p-6">
        <h1 className="text-xl font-bold text-white mb-6">Admin Login</h1>

        {error && <div className="text-red-300 text-sm mb-4">{error}</div>}

        <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/10 border border-white/20 px-3 py-2 text-white mb-4 outline-none"
          required
        />

        <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/10 border border-white/20 px-3 py-2 text-white mb-6 outline-none"
          required
        />

        <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 font-bold uppercase tracking-widest text-xs">
          Sign In
        </button>
      </form>
    </main>
  )
}
