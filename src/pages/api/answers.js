import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { prisma } from '~/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(404).send({ error: 'does not exist' })

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).send({ error: 'Unauthorized' })

    const { email, answers } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).send({ error: 'User not found' })

    // Upsert each answer into the responses table
    for (const answer of answers) {
      const isOption = answer.selected && answer.selected !== ''
      await prisma.response.upsert({
        where: {
          userId_questionId: { userId: user.id, questionId: answer.qid },
        },
        update: {
          optionId: isOption ? answer.selected : null,
          textAnswer: !isOption ? (answer.answer || null) : null,
          score: answer.score ?? null,
        },
        create: {
          userId: user.id,
          questionId: answer.qid,
          optionId: isOption ? answer.selected : null,
          textAnswer: !isOption ? (answer.answer || null) : null,
          score: answer.score ?? null,
        },
      })
    }

    return res.status(200).json({ result: 'submitted' })
  } catch (error) {
    console.log('submit answers error', error)
    return res.status(500).send({ error: 'failed to submit data' })
  }
}
