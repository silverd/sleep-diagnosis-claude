import type { Metadata } from 'next'
import Link from 'next/link'
import { QuestionnaireListClient } from './QuestionnaireListClient'

export const metadata: Metadata = { title: 'Questionnaires' }

export default function QuestionnairesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Questionnaires</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage sleep assessment questionnaires and their questions.
          </p>
        </div>
        <Link
          href="/cms/questionnaires/new"
          className="inline-flex items-center gap-2 rounded-xl bg-excellent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New Questionnaire
        </Link>
      </div>

      {/* Interactive list (Client Component for filtering/pagination) */}
      <QuestionnaireListClient />
    </div>
  )
}
