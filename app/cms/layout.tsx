import type { Metadata } from 'next'
import Link from 'next/link'
import { CMSSidebar } from './CMSSidebar'

export const metadata: Metadata = {
  title: {
    default: 'CMS Dashboard',
    template: '%s | Sleep Diagnosis CMS',
  },
}

interface CMSLayoutProps {
  children: React.ReactNode
}

export default function CMSLayout({ children }: CMSLayoutProps) {
  return (
    <div className="flex min-h-screen bg-pagebg-100">
      {/* Sidebar */}
      <CMSSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
          <span className="text-sm font-semibold text-gray-900">
            Sleep Diagnosis CMS
          </span>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200 transition-colors hover:bg-pagebg-100 hover:text-gray-900"
            >
              ← Back to App
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
