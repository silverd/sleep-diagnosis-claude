'use client'

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query'
import type {
  QuestionnaireListItem,
  QuestionnaireWithQuestions,
  UserListItem,
  UserDetailResponse,
  PaginatedResponse,
} from '~/types'

// ===========================================================================
// Query Keys (typed constants to avoid typo bugs)
// ===========================================================================

export const queryKeys = {
  questionnaires: (params?: Record<string, string | number>) =>
    ['questionnaires', params] as const,
  questionnaire: (id: string) => ['questionnaires', id] as const,
  users: (params?: Record<string, string | number>) =>
    ['users', params] as const,
  user: (userId: string) => ['users', userId] as const,
} as const

// ===========================================================================
// Generic fetcher
// ===========================================================================

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ===========================================================================
// Questionnaire Hooks
// ===========================================================================

export interface QuestionnairesParams {
  page?: number
  pageSize?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | ''
  search?: string
}

/**
 * Fetches a paginated list of questionnaires.
 * Used in the CMS questionnaire list page.
 */
export function useQuestionnaires(
  params: QuestionnairesParams = {},
): UseQueryResult<PaginatedResponse<QuestionnaireListItem>> {
  const { page = 1, pageSize = 20, status = '', search = '' } = params

  const qs = new URLSearchParams()
  qs.set('page', String(page))
  qs.set('pageSize', String(pageSize))
  if (status) qs.set('status', status)
  if (search) qs.set('search', search)

  const normalizedParams = { page, pageSize, status, search }

  return useQuery({
    queryKey: queryKeys.questionnaires(normalizedParams),
    queryFn: () =>
      fetchJson<PaginatedResponse<QuestionnaireListItem>>(
        `/api/questionnaires?${qs.toString()}`,
      ),
    placeholderData: (prev) => prev, // keep previous data while loading (like keepPreviousData)
  })
}

/**
 * Fetches a single questionnaire with all its questions and options.
 * Used in the questionnaire edit page.
 */
export function useQuestionnaire(
  id: string,
): UseQueryResult<QuestionnaireWithQuestions> {
  return useQuery({
    queryKey: queryKeys.questionnaire(id),
    queryFn: () =>
      fetchJson<QuestionnaireWithQuestions>(`/api/questionnaires/${id}`),
    enabled: Boolean(id),
  })
}

// ===========================================================================
// User Hooks
// ===========================================================================

export interface UsersParams {
  page?: number
  pageSize?: number
  is_premium?: boolean | ''
  search?: string
}

/**
 * Fetches a paginated list of users.
 * Used in the CMS users page and UserDashboard.
 */
export function useUsers(
  params: UsersParams = {},
): UseQueryResult<PaginatedResponse<UserListItem>> {
  const { page = 1, pageSize = 20, is_premium = '', search = '' } = params

  const qs = new URLSearchParams()
  qs.set('page', String(page))
  qs.set('pageSize', String(pageSize))
  if (is_premium !== '') qs.set('is_premium', String(is_premium))
  if (search) qs.set('search', search)

  const normalizedParams: Record<string, string | number> = { page, pageSize, search }
  if (is_premium !== '') normalizedParams.is_premium = String(is_premium)

  return useQuery({
    queryKey: queryKeys.users(normalizedParams),
    queryFn: () =>
      fetchJson<PaginatedResponse<UserListItem>>(`/api/users?${qs.toString()}`),
    placeholderData: (prev) => prev,
  })
}

/**
 * Fetches a single user with all their responses.
 */
export function useUser(userId: string): UseQueryResult<UserDetailResponse> {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => fetchJson<UserDetailResponse>(`/api/users/${userId}`),
    enabled: Boolean(userId),
  })
}

// ===========================================================================
// CSV Export Mutation
// ===========================================================================

/**
 * Triggers a CSV download for a user's responses.
 * Uses a mutation because it has a side-effect (file download).
 */
export function useExportUserCsv(): UseMutationResult<void, Error, string> {
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/export/${userId}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(
          (body as { error?: string }).error ?? 'Export failed.',
        )
      }

      // Trigger browser download
      const blob = await res.blob()
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const filenameMatch = disposition.match(/filename="?([^";]+)"?/)
      const filename = filenameMatch?.[1] ?? `export_${userId}.csv`

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    },
  })
}

// ===========================================================================
// Cache invalidation helpers (call after Server Action mutations)
// ===========================================================================

/**
 * Returns helpers to manually invalidate TanStack Query cache after
 * Server Actions (which bypass the query client).
 */
export function useCacheInvalidation() {
  const queryClient = useQueryClient()

  return {
    invalidateQuestionnaires: () =>
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] }),
    invalidateQuestionnaire: (id: string) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.questionnaire(id) }),
    invalidateUsers: () =>
      queryClient.invalidateQueries({ queryKey: ['users'] }),
  }
}
