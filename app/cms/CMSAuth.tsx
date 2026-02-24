'use client'

import { useState, useEffect } from 'react'

interface CMSAuthProps {
  children: React.ReactNode
}

export function CMSAuth({ children }: CMSAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('cmsAuth')
      if (auth === 'true') {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'ew@2026') {
      localStorage.setItem('cmsAuth', 'true')
      setIsAuthenticated(true)
      setError('')
      setUsername('')
      setPassword('')
    } else {
      setError('Invalid username or password')
      setPassword('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pagebg-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pagebg-100 px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md ring-1 ring-black/5">
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-excellent-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-6 w-6">
                <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.061ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Sleep CMS</h1>
            <p className="mt-1 text-sm text-gray-500">Admin Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors placeholder:text-gray-400 focus:border-excellent-500 focus:outline-none focus:ring-1 focus:ring-excellent-500"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors placeholder:text-gray-400 focus:border-excellent-500 focus:outline-none focus:ring-1 focus:ring-excellent-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-excellent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
