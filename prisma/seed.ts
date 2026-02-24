/**
 * Prisma seed — populates the database with sample data for development.
 * Run with: npm run prisma:seed
 */
import { PrismaClient, QuestionnaireStatus, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database…')

  // ── Users ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sleepclinic.com' },
    update: {},
    create: {
      email: 'admin@sleepclinic.com',
      name: 'Admin User',
      role: 'ADMIN',
      is_premium: true,
    },
  })

  const patient = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      name: 'Alex Patient',
      role: 'USER',
      is_premium: false,
    },
  })

  console.log(`  ✓ Users: ${admin.email}, ${patient.email}`)

  // ── PSQI Questionnaire ─────────────────────────────────────────────────────
  const psqi = await prisma.questionnaire.upsert({
    where: { slug: 'psqi-assessment' },
    update: {},
    create: {
      title: 'Pittsburgh Sleep Quality Index (PSQI)',
      slug: 'psqi-assessment',
      description:
        'A standard clinical questionnaire to assess sleep quality over the past month.',
      status: QuestionnaireStatus.PUBLISHED,
      questions: {
        create: [
          // Q1 – Usual bedtime (PSQI Q1)
          {
            text: 'During the past month, what time have you usually gone to bed at night?',
            textCn: '在过去一个月里，您通常几点上床准备睡觉？',
            type: QuestionType.text,
            subType: 'exactTime',
            order: 0,
            groupId: 1,
            psqiId: '1',
            isRequired: true,
          },
          // Q2 – Sleep latency (PSQI Q2)
          {
            text: 'During the past month, how long (in minutes) has it usually taken you to fall asleep each night?',
            textCn: '在过去一个月里，您通常从上床到入睡需要多长时间（分钟）？',
            type: QuestionType.text,
            subType: 'exactNumber',
            order: 1,
            groupId: 1,
            psqiId: '2',
            isRequired: true,
          },
          // Q3 – Usual wake time (PSQI Q3)
          {
            text: 'During the past month, what time have you usually gotten up in the morning?',
            textCn: '在过去一个月里，您通常早上几点起床？',
            type: QuestionType.text,
            subType: 'exactTime',
            order: 2,
            groupId: 1,
            psqiId: '3',
            isRequired: true,
          },
          // Q4 – Sleep duration (PSQI Q4)
          {
            text: 'During the past month, how many hours of actual sleep did you get at night? (This may be different than the number of hours you spend in bed.)',
            textCn: '在过去一个月里，每天晚上您实际睡眠时间大概是多少小时？',
            type: QuestionType.text,
            subType: 'exactNumber',
            order: 3,
            groupId: 1,
            psqiId: '4',
            isRequired: true,
          },
          // Q5a – Cannot sleep within 30 min (PSQI Q5a)
          {
            text: 'During the past month, how often have you had trouble sleeping because you cannot get to sleep within 30 minutes?',
            textCn: '在过去一个月里，您是否因为不能在30分钟内入睡而出现睡眠问题？',
            type: QuestionType.mcq,
            order: 4,
            groupId: 1,
            psqiId: '5a',
            isRequired: true,
            options: {
              create: [
                { label: 'Not during the past month',  labelCn: '过去一个月内没有', value: '0', score: 0, order: 0 },
                { label: 'Less than once a week',      labelCn: '每周不足一次',     value: '1', score: 1, order: 1 },
                { label: 'Once or twice a week',       labelCn: '每周一两次',       value: '2', score: 2, order: 2 },
                { label: 'Three or more times a week', labelCn: '每周三次或更多',   value: '3', score: 3, order: 3 },
              ],
            },
          },
          // Q6 – Sleep quality (PSQI Q6)
          {
            text: 'During the past month, how would you rate your sleep quality overall?',
            textCn: '在过去一个月里，总体来说，您对自己睡眠质量的评价是？',
            type: QuestionType.mcq,
            order: 5,
            groupId: 1,
            psqiId: '6',
            isRequired: true,
            options: {
              create: [
                { label: 'Very good',   labelCn: '非常好', value: '0', score: 0, order: 0 },
                { label: 'Fairly good', labelCn: '好',     value: '1', score: 1, order: 1 },
                { label: 'Fairly bad',  labelCn: '差',     value: '2', score: 2, order: 2 },
                { label: 'Very bad',    labelCn: '非常差', value: '3', score: 3, order: 3 },
              ],
            },
          },
          // Q7 – Daytime dysfunction (PSQI Q9)
          {
            text: 'During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?',
            textCn: '在过去一个月里，您是否有过提不起劲来做事的问题？',
            type: QuestionType.mcq,
            order: 6,
            groupId: 1,
            psqiId: '9',
            isRequired: true,
            options: {
              create: [
                { label: 'No problem at all',          labelCn: '没有问题',     value: '0', score: 0, order: 0 },
                { label: 'Only a very slight problem', labelCn: '问题很轻微',   value: '1', score: 1, order: 1 },
                { label: 'Somewhat of a problem',      labelCn: '问题比较严重', value: '2', score: 2, order: 2 },
                { label: 'A very big problem',         labelCn: '问题非常严重', value: '3', score: 3, order: 3 },
              ],
            },
          },
        ],
      },
    },
  })

  console.log(`  ✓ Questionnaire: "${psqi.title}" (${psqi.id})`)

  // ── Sample Responses (patient answers to PSQI) ─────────────────────────────
  const questions = await prisma.question.findMany({
    where: { questionnaireId: psqi.id },
    include: { options: true },
    orderBy: { order: 'asc' },
  })

  for (const q of questions) {
    if (q.type === QuestionType.text) {
      await prisma.response.upsert({
        where: { userId_questionId: { userId: patient.id, questionId: q.id } },
        update: {},
        create: {
          userId: patient.id,
          questionId: q.id,
          textAnswer: q.order === 0 ? '11:30 PM' : q.order === 1 ? '25' : q.order === 2 ? '7:00 AM' : '6.5',
          score: null,
        },
      })
    } else {
      const opt = q.options[1] ?? q.options[0]
      if (opt) {
        await prisma.response.upsert({
          where: { userId_questionId: { userId: patient.id, questionId: q.id } },
          update: {},
          create: {
            userId: patient.id,
            questionId: q.id,
            optionId: opt.id,
            score: opt.score,
          },
        })
      }
    }
  }

  console.log(`  ✓ Sample responses created for ${patient.email}`)
  console.log('✅ Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
