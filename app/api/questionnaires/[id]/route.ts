import { NextResponse } from 'next/server'
import { prisma } from '~/lib/prisma'
import type { QuestionnaireWithQuestions } from '~/types'

interface RouteParams {
  params: { id: string }
}

// GET /api/questionnaires/[id]  — full detail with questions + options
export async function GET(
  _request: Request,
  { params }: RouteParams,
): Promise<NextResponse> {
  const questionnaire = await prisma.questionnaire.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        include: { options: { orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!questionnaire) {
    return NextResponse.json(
      { error: 'Questionnaire not found.' },
      { status: 404 },
    )
  }

  return NextResponse.json(questionnaire as QuestionnaireWithQuestions)
}
