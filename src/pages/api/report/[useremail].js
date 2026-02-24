import { calculateDiagnosis } from '@/utils/formula'
import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { prisma } from '~/lib/prisma'

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).send({ error: 'Unauthorized' })

    const { useremail } = req.query

    const user = await prisma.user.findUnique({ where: { email: useremail } })
    if (!user) return res.status(404).send({ error: 'User not found' })

    // Count total questions across all published questionnaires
    const totalQuestions = await prisma.question.count({
      where: { questionnaire: { status: 'PUBLISHED' } },
    })

    // Fetch all user responses for published questionnaire questions
    const responses = await prisma.response.findMany({
      where: {
        userId: user.id,
        question: { questionnaire: { status: 'PUBLISHED' } },
      },
      include: {
        option: true,
        question: { select: { psqiId: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    if (responses.length < totalQuestions) {
      return res.status(200).json({
        completed: false,
        answerCount: responses.length,
      })
    }

    // Map to the format expected by calculateDiagnosis
    const answers = responses.map((r) => ({
      psqiid: r.question.psqiId ?? r.questionId,
      score: r.score ?? 0,
      answer: r.option?.label ?? r.textAnswer ?? '',
    }))

    const result = {
      useremail,
      completed: true,
      testTime: responses[0]?.updatedAt ?? null,
      ...calculateDiagnosis(answers),
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log('get report error', error)
    return res.status(500).send({ error: 'failed to fetch data' })
  }
}
