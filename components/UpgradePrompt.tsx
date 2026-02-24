'use client'

import { useState } from 'react'
import type { UserListItem } from '~/types'

interface UpgradePromptProps {
  user: Pick<UserListItem, 'id' | 'email' | 'name' | 'is_premium'>
  /** Called when the user dismisses the banner */
  onDismiss?: () => void
}

/**
 * UpgradePrompt — displayed only when user.is_premium is false.
 * Renders nothing for premium users.
 */
export function UpgradePrompt({ user, onDismiss }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false)

  // Guard: nothing to show for premium users
  if (user.is_premium || dismissed) return null

  function handleDismiss() {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bluebg-500 to-excellent-500 p-6 text-white shadow-lg">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss upgrade prompt"
        className="absolute right-4 top-4 rounded-full p-1 text-white/70 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>

      {/* Decorative circles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10"
      />

      {/* Content */}
      <div className="relative">
        <div className="mb-1 flex items-center gap-2">
          {/* Star icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-fair-500"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold uppercase tracking-widest text-fair-200">
            Premium Plan
          </span>
        </div>

        <h3 className="mb-2 text-xl font-display font-bold leading-tight">
          Unlock your full sleep report,{' '}
          {user.name ? user.name.split(' ')[0] : 'there'}!
        </h3>

        <p className="mb-5 max-w-sm text-sm text-white/80">
          Get personalized insights, AI-powered recommendations, and detailed
          tracking across all 12 sleep dimensions.
        </p>

        {/* Feature list */}
        <ul className="mb-6 space-y-2">
          {[
            'Full 12-dimension diagnosis report',
            'AI sleep coaching recommendations',
            'Historical trend tracking',
            'Priority email support',
          ].map((feat) => (
            <li key={feat} className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 flex-shrink-0 text-fair-300"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              {feat}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/upgrade"
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-excellent-500 shadow transition-transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            Upgrade Now
          </a>
          <button
            onClick={handleDismiss}
            className="text-sm text-white/70 underline-offset-2 hover:text-white hover:underline"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
