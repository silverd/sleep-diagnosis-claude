'use client'

import { useState, useTransition } from 'react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { useUsers, useExportUserCsv, useCacheInvalidation } from '~/hooks/useQueries'
import { useUIState } from '~/store/useUIState'
import { toggleUserPremium } from '~/app/actions/cms'
import { UserDashboard } from '~/components/UserDashboard'

export function UsersClient() {
  const {
    userSearch,
    userPremiumFilter,
    userPage,
    setUserSearch,
    setUserPremiumFilter,
    setUserPage,
  } = useUIState()

  const { invalidateUsers } = useCacheInvalidation()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const exportCsv = useExportUserCsv()
  const [isPending, startTransition] = useTransition()

  const { data, isLoading, isError } = useUsers({
    page: userPage,
    pageSize: 15,
    is_premium: userPremiumFilter,
    search: userSearch,
  })

  function handleTogglePremium(userId: string, currentPremium: boolean) {
    startTransition(async () => {
      const result = await toggleUserPremium(userId, !currentPremium)
      if (result.success) {
        toast.success(
          result.data.is_premium ? 'User upgraded to Premium.' : 'Premium removed.',
        )
        invalidateUsers()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleExport(userId: string) {
    exportCsv.mutate(userId, {
      onSuccess: () => toast.success('CSV downloaded.'),
      onError: (err) => toast.error(err.message),
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left: users table */}
      <div className="space-y-4 lg:col-span-2">
        {/* Filters */}
        <div className="flex flex-col gap-2">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-excellent-500 focus:outline-none focus:ring-1 focus:ring-excellent-500"
          />
          <select
            value={String(userPremiumFilter)}
            onChange={(e) => {
              const v = e.target.value
              setUserPremiumFilter(v === '' ? '' : v === 'true')
            }}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-excellent-500 focus:outline-none"
          >
            <option value="">All users</option>
            <option value="true">Premium</option>
            <option value="false">Free</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          {isLoading ? (
            <div className="flex justify-center py-14">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-excellent-500 border-t-transparent" />
            </div>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-verypoor-500">Failed to load users.</p>
          ) : data?.data.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">No users found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {data?.data.map((user) => (
                <li
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id === selectedUserId ? null : user.id)}
                  className={clsx(
                    'cursor-pointer px-5 py-3.5 transition-colors',
                    selectedUserId === user.id
                      ? 'bg-excellent-50'
                      : 'hover:bg-pagebg-100',
                    isPending && 'opacity-60',
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-excellent-500 text-sm font-bold text-white">
                      {(user.name ?? user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {user.name ?? '—'}
                      </p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {user.is_premium ? (
                        <span className="inline-flex rounded-full bg-excellent-50 px-2 py-0.5 text-xs font-semibold text-excellent-500">
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                          Free
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {user._count.responses} responses
                      </span>
                    </div>
                  </div>

                  {/* Row actions (shown when selected) */}
                  {selectedUserId === user.id && (
                    <div
                      className="mt-3 flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleTogglePremium(user.id, user.is_premium)}
                        disabled={isPending}
                        className={clsx(
                          'rounded-lg px-2.5 py-1 text-xs font-medium ring-1 disabled:opacity-50',
                          user.is_premium
                            ? 'text-gray-600 ring-gray-200 hover:bg-gray-50'
                            : 'text-excellent-500 ring-excellent-500 hover:bg-excellent-50',
                        )}
                      >
                        {user.is_premium ? 'Remove Premium' : 'Upgrade to Premium'}
                      </button>
                      <button
                        onClick={() => handleExport(user.id)}
                        disabled={exportCsv.isPending || user._count.responses === 0}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200 hover:bg-pagebg-100 disabled:opacity-40"
                      >
                        {exportCsv.isPending ? '…' : 'Export CSV'}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{data.total} users total</p>
            <div className="flex gap-2">
              <button
                onClick={() => setUserPage(userPage - 1)}
                disabled={userPage <= 1}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200 hover:bg-pagebg-100 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="flex items-center px-2 text-xs text-gray-500">
                {userPage} / {data.totalPages}
              </span>
              <button
                onClick={() => setUserPage(userPage + 1)}
                disabled={userPage >= data.totalPages}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200 hover:bg-pagebg-100 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: user dashboard detail */}
      <div className="lg:col-span-3">
        {selectedUserId ? (
          <UserDashboard userId={selectedUserId} />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-400">
            Select a user to view their dashboard →
          </div>
        )}
      </div>
    </div>
  )
}
