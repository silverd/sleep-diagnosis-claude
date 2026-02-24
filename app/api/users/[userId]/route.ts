import { NextResponse } from 'next/server'
import { prisma } from '~/lib/prisma'

interface RouteParams {
  params: { userId: string }
}

// GET /api/users/[userId]  — full detail with responses joined to questions and options
export async function GET(
  _request: Request,
  { params }: RouteParams,
): Promise<NextResponse> {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    // Select only safe fields — never expose accounts/sessions/tokens
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      is_premium: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      responses: {
        select: {
          id: true,
          score: true,
          textAnswer: true,
          updatedAt: true,
          question: {
            select: {
              id: true,
              text: true,
              type: true,
              order: true,
              questionnaireId: true,
              questionnaire: { select: { title: true, slug: true } },
            },
          },
          option: { select: { label: true, value: true, score: true } },
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  return NextResponse.json(user)
}
