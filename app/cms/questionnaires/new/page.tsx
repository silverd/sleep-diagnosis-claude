import type { Metadata } from 'next'
import { QuestionnaireForm } from '../QuestionnaireForm'

export const metadata: Metadata = { title: 'New Questionnaire' }

export default function NewQuestionnairePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">New Questionnaire</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below, then add questions from the editor.
        </p>
      </div>
      <QuestionnaireForm />
    </div>
  )
}
