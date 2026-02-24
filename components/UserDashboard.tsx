'use client'

import { useState } from 'react'
import { useUser, useExportUserCsv } from '~/hooks/useQueries'
import { UpgradePrompt } from '~/components/UpgradePrompt'
import toast from 'react-hot-toast'

// ---------------------------------------------------------------------------
// Stat card sub-component
// ---------------------------------------------------------------------------

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  colorClass?: string
}

function StatCard({ label, value, sub, colorClass = 'bg-excellent-50 text-excellent-500' }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`text-3xl font-display font-bold ${colorClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Response row sub-component
// ---------------------------------------------------------------------------

interface ResponseRowProps {
  questionnaireTitle: string
  questionText: string
  answer: string
  score: number | null
  answeredAt: string
}

function ResponseRow({ questionnaireTitle, questionText, answer, score, answeredAt }: ResponseRowProps) {
  return (
    <tr className="border-t border-gray-100 hover:bg-pagebg-100 transition-colors">
      <td className="py-3 pl-4 pr-3 text-xs text-gray-500 sm:pl-6">{questionnaireTitle}</td>
      <td className="px-3 py-3 text-sm text-gray-800">{questionText}</td>
      <td className="px-3 py-3 text-sm font-medium text-excellent-500">{answer}</td>
      <td className="px-3 py-3 text-sm text-gray-500">
        {score !== null ? score.toFixed(1) : '—'}
      </td>
      <td className="py-3 pl-3 pr-4 text-xs text-gray-400 sm:pr-6">
        {new Date(answeredAt).toLocaleDateString()}
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Main UserDashboard
// ---------------------------------------------------------------------------

interface UserDashboardProps {
  userId: string
}

export function UserDashboard({ userId }: UserDashboardProps) {
  const { data: user, isLoading, isError } = useUser(userId)
  const exportCsv = useExportUserCsv()
  const [search, setSearch] = useState('')

  // ---------- Loading state ----------
  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-excellent-500 border-t-transparent" />
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-verypoor-500">
        Failed to load user data. Please try again.
      </div>
    )
  }

  // ---------- Derived stats ----------
  const responses: Array<{
    question: {
      text: string
      type: string
      questionnaire: { title: string }
    }
    option: { label: string; score: number | null } | null
    textAnswer: string | null
    score: number | null
    updatedAt: string
  }> = user.responses ?? []

  const totalAnswers = responses.length

  // Group responses by questionnaire
  const byQuestionnaire = responses.reduce<Record<string, number>>(
    (acc, r) => {
      const title = r.question.questionnaire.title
      acc[title] = (acc[title] ?? 0) + 1
      return acc
    },
    {},
  )
  const questionnairesAttempted = Object.keys(byQuestionnaire).length

  const avgScore =
    responses.length > 0
      ? responses.reduce((sum, r) => sum + (r.score ?? 0), 0) / responses.length
      : 0

  // Filter by search
  const filtered = responses.filter(
    (r) =>
      search === '' ||
      r.question.text.toLowerCase().includes(search.toLowerCase()) ||
      r.question.questionnaire.title.toLowerCase().includes(search.toLowerCase()),
  )

  function handleExport() {
    exportCsv.mutate(userId, {
      onSuccess: () => toast.success('CSV exported!'),
      onError: (err) => toast.error(err.message),
    })
  }

  return (
    <div className="space-y-6">
      {/* Upgrade prompt — only shown for non-premium users */}
      <UpgradePrompt user={user} />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {user.name ?? user.email}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-1 flex items-center gap-2">
            {user.is_premium ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-excellent-50 px-2.5 py-0.5 text-xs font-semibold text-excellent-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                  <path d="M8 1.5a.75.75 0 0 1 .69.46l1.216 2.862 3.06.243a.75.75 0 0 1 .424 1.326L11.04 8.24l.662 2.987a.75.75 0 0 1-1.117.82L8 10.29l-2.585 1.758a.75.75 0 0 1-1.117-.82l.662-2.988-2.35-1.949a.75.75 0 0 1 .424-1.326l3.06-.243L7.31 1.96A.75.75 0 0 1 8 1.5Z" />
                </svg>
                Premium
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                Free plan
              </span>
            )}
            <span className="inline-flex rounded-full bg-pagebg-100 px-2.5 py-0.5 text-xs font-medium text-bluebg-500">
              {user.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exportCsv.isPending || totalAnswers === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-excellent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exportCsv.isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Exporting…
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
              Export CSV
            </>
          )}
        </button>
      </div>

      {/* Stats grid */}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Answers"
          value={totalAnswers}
          sub="questions answered"
          colorClass="text-excellent-500"
        />
        <StatCard
          label="Questionnaires"
          value={questionnairesAttempted}
          sub="distinct assessments"
          colorClass="text-bluebg-500"
        />
        <StatCard
          label="Avg Score"
          value={avgScore.toFixed(1)}
          sub="across all answers"
          colorClass={
            avgScore >= 60
              ? 'text-good-500'
              : avgScore >= 40
                ? 'text-fair-500'
                : 'text-verypoor-500'
          }
        />
      </dl>

      {/* Responses table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h3 className="text-base font-semibold text-gray-900">Responses</h3>
          <input
            type="search"
            placeholder="Filter questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-pagebg-100 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-excellent-500 focus:outline-none focus:ring-1 focus:ring-excellent-500 sm:w-56"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            {totalAnswers === 0 ? 'No responses yet.' : 'No results match your search.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-pagebg-100">
                <tr>
                  {['Questionnaire', 'Question', 'Answer', 'Score', 'Date'].map(
                    (h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 first:pl-4 last:pr-4 sm:first:pl-6 sm:last:pr-6"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="bg-white">
                {filtered.map((r, idx) => (
                  <ResponseRow
                    key={idx}
                    questionnaireTitle={r.question.questionnaire.title}
                    questionText={r.question.text}
                    answer={
                      r.question.type === 'mcq'
                        ? (r.option?.label ?? '—')
                        : (r.textAnswer ?? '—')
                    }
                    score={r.score}
                    answeredAt={r.updatedAt}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
