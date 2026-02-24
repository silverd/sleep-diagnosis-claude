'use client'

import { useRouter } from 'next/navigation'

export function CMSLogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('cmsAuth')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200 transition-colors hover:bg-pagebg-100 hover:text-gray-900"
    >
      Logout
    </button>
  )
}
