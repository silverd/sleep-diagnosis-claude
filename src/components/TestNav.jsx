import { CheckIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import clsx from 'clsx'

export function TestNav({ current, setPage, sections = [] }) {
  const router = useRouter()
  const { locale } = router
  const total = sections.length

  return (
    <aside className="shrink-0 lg:w-72">
      {/* ── Mobile: compact progress strip ── */}
      <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Step {current} of {total}
          </span>
          <span className="max-w-[60%] truncate text-sm font-semibold text-gray-900 text-right">
            {sections[current - 1]?.title ?? ''}
          </span>
        </div>
        {/* Progress bar segments */}
        <div className="flex gap-1">
          {sections.map((_, i) => (
            <div
              key={i}
              className={clsx(
                'h-1.5 flex-1 rounded-full transition-all',
                i < current ? 'bg-bluebg-500' : 'bg-gray-200'
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop: vertical sidebar ── */}
      <nav className="hidden lg:block sticky top-8 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Sections
        </p>
        <ul role="list" className="space-y-1">
          {sections.map((item, index) => {
            const done = index < current - 1
            const active = index === current - 1
            const clickable = done

            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={clickable ? () => setPage(index + 1) : undefined}
                  title={item.title}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    active
                      ? 'bg-bluebg-50 text-bluebg-700'
                      : done
                      ? 'cursor-pointer text-gray-600 hover:bg-gray-50'
                      : 'cursor-default text-gray-400'
                  )}
                >
                  {/* Step indicator */}
                  <span
                    className={clsx(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      done
                        ? 'bg-bluebg-500 text-white'
                        : active
                        ? 'border-2 border-bluebg-500 text-bluebg-500'
                        : 'border-2 border-gray-300 text-gray-400'
                    )}
                  >
                    {done ? (
                      <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  {/* Title — truncate with tooltip via title attr on parent */}
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
