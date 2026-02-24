'use client'

import { useState } from 'react'
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR we usually want staleTime > 0 so data is not immediately
        // refetched on first client render
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  })
}

// Browser singleton — avoids creating a new client on every re-render
let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always create a fresh client so requests aren't shared
    return makeQueryClient()
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // NOTE: Avoid useState initializer here so it works with React <18 as well,
  // but getQueryClient() is safe because it creates only once per browser.
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
