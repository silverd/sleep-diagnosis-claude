import type { Metadata } from 'next'
import { UsersClient } from './UsersClient'

export const metadata: Metadata = { title: 'Users' }

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          View patient accounts, toggle premium status, and export response data.
        </p>
      </div>
      <UsersClient />
    </div>
  )
}
