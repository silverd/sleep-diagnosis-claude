import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '~/lib/prisma'
import { QuestionnaireForm } from '../QuestionnaireForm'
import { QuestionEditor } from './QuestionEditor'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const q = await prisma.questionnaire.findUnique({
    where: { id: params.id },
    select: { title: true },
  })
  return { title: q?.title ?? 'Edit Questionnaire' }
}

export default async function EditQuestionnairePage({ params }: PageProps) {
  const questionnaire = await prisma.questionnaire.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        include: { options: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!questionnaire) notFound()

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">
          {questionnaire.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Edit metadata below, then manage questions in the editor.
        </p>
      </div>

      {/* Two-column layout on large screens */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left: metadata form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="mb-5 text-base font-semibold text-gray-900">Metadata</h2>
            <QuestionnaireForm
              initial={{
                id: questionnaire.id,
                title: questionnaire.title,
                slug: questionnaire.slug,
                description: questionnaire.description,
                status: questionnaire.status,
              }}
            />
          </div>
        </div>

        {/* Right: question editor */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Questions{' '}
                <span className="ml-1 rounded-full bg-excellent-50 px-2 py-0.5 text-xs font-medium text-excellent-500">
                  {questionnaire.questions.length}
                </span>
              </h2>
            </div>
            <QuestionEditor
              questionnaireId={questionnaire.id}
              initialQuestions={questionnaire.questions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
