/**
 * Comprehensive questionnaire seed — populates all 9 questionnaires.
 * Run with: npm run prisma:seed:questionnaires
 *
 * ⚠️  Each run DELETES and RECREATES all questionnaires (cascade removes questions,
 *     options, and any linked responses).
 */
import { PrismaClient, QuestionnaireStatus, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

// ─────────────────────────────────────────────────────────────────────────────
// Option presets (label / labelCn / value / score / order)
// ─────────────────────────────────────────────────────────────────────────────

type Opt = { label: string; labelCn: string; value: string; score: number; order: number }

const freq4: Opt[] = [
  { label: 'Not during the past month',  labelCn: '过去一个月内没有',   value: '0', score: 0, order: 0 },
  { label: 'Less than once a week',      labelCn: '每周不足一次',       value: '1', score: 1, order: 1 },
  { label: 'Once or twice a week',       labelCn: '每周一两次',         value: '2', score: 2, order: 2 },
  { label: 'Three or more times a week', labelCn: '每周三次或更多',     value: '3', score: 3, order: 3 },
]

const isi5: Opt[] = [
  { label: 'None',        labelCn: '没有',     value: '0', score: 0, order: 0 },
  { label: 'Mild',        labelCn: '轻微',     value: '1', score: 1, order: 1 },
  { label: 'Moderate',    labelCn: '中度',     value: '2', score: 2, order: 2 },
  { label: 'Severe',      labelCn: '严重',     value: '3', score: 3, order: 3 },
  { label: 'Very Severe', labelCn: '非常严重', value: '4', score: 4, order: 4 },
]

const extent5: Opt[] = [
  { label: 'Not at all', labelCn: '完全没有', value: '0', score: 0, order: 0 },
  { label: 'A little',   labelCn: '有一点',   value: '1', score: 1, order: 1 },
  { label: 'Somewhat',   labelCn: '有些',     value: '2', score: 2, order: 2 },
  { label: 'Much',       labelCn: '比较多',   value: '3', score: 3, order: 3 },
  { label: 'Very much',  labelCn: '非常多',   value: '4', score: 4, order: 4 },
]

// ISI Q9 — sleep satisfaction (scores 1-4 for formula)
const satisfied4: Opt[] = [
  { label: 'Very Satisfied',    labelCn: '非常满意',   value: '1', score: 1, order: 0 },
  { label: 'Satisfied',         labelCn: '满意',       value: '2', score: 2, order: 1 },
  { label: 'Dissatisfied',      labelCn: '不满意',     value: '3', score: 3, order: 2 },
  { label: 'Very Dissatisfied', labelCn: '非常不满意', value: '4', score: 4, order: 3 },
]

const ess4: Opt[] = [
  { label: 'Would never doze',          labelCn: '从不打盹',   value: '0', score: 0, order: 0 },
  { label: 'Slight chance of dozing',   labelCn: '很少打盹',   value: '1', score: 1, order: 1 },
  { label: 'Moderate chance of dozing', labelCn: '有时打盹',   value: '2', score: 2, order: 2 },
  { label: 'High chance of dozing',     labelCn: '经常打盹',   value: '3', score: 3, order: 3 },
]

// FAS scale (1 = Never … 5 = Always)
const fas5: Opt[] = [
  { label: 'Never',     labelCn: '从不', value: '1', score: 1, order: 0 },
  { label: 'Sometimes', labelCn: '有时', value: '2', score: 2, order: 1 },
  { label: 'Regularly', labelCn: '经常', value: '3', score: 3, order: 2 },
  { label: 'Often',     labelCn: '时常', value: '4', score: 4, order: 3 },
  { label: 'Always',    labelCn: '总是', value: '5', score: 5, order: 4 },
]

const yesno: Opt[] = [
  { label: 'No',  labelCn: '否', value: '0', score: 0, order: 0 },
  { label: 'Yes', labelCn: '是', value: '1', score: 1, order: 1 },
]

const problem4: Opt[] = [
  { label: 'No problem at all',          labelCn: '没有问题',     value: '0', score: 0, order: 0 },
  { label: 'Only a very slight problem', labelCn: '问题很轻微',   value: '1', score: 1, order: 1 },
  { label: 'Somewhat of a problem',      labelCn: '问题比较严重', value: '2', score: 2, order: 2 },
  { label: 'A very big problem',         labelCn: '问题非常严重', value: '3', score: 3, order: 3 },
]

const variation4: Opt[] = [
  { label: 'Always the same time', labelCn: '总是固定时间', value: '0', score: 0, order: 0 },
  { label: 'Within ±30 minutes',   labelCn: '±30分钟以内', value: '1', score: 1, order: 1 },
  { label: 'Within ±1 hour',       labelCn: '±1小时以内',  value: '2', score: 2, order: 2 },
  { label: 'More than ±1 hour',    labelCn: '超过±1小时',  value: '3', score: 3, order: 3 },
]

const brightness4: Opt[] = [
  { label: 'Not at all bright',  labelCn: '完全不亮', value: '0', score: 0, order: 0 },
  { label: 'A little bright',    labelCn: '有点亮',   value: '1', score: 1, order: 1 },
  { label: 'Moderately bright',  labelCn: '比较亮',   value: '2', score: 2, order: 2 },
  { label: 'Very bright',        labelCn: '非常亮',   value: '3', score: 3, order: 3 },
]

// Horne MEQ — morning alertness (Q95, scores 1-4)
const horneMorning4: Opt[] = [
  { label: 'Very tired',       labelCn: '非常疲倦', value: '1', score: 1, order: 0 },
  { label: 'Fairly tired',     labelCn: '相当疲倦', value: '2', score: 2, order: 1 },
  { label: 'Fairly refreshed', labelCn: '相当清醒', value: '3', score: 3, order: 2 },
  { label: 'Very refreshed',   labelCn: '非常清醒', value: '4', score: 4, order: 3 },
]

// Horne MEQ — chronotype (Q119, MEQ scores 6/4/2/0)
const horneType4: Opt[] = [
  { label: 'Definitely a morning type',   labelCn: '完全早晨型', value: '6', score: 6, order: 0 },
  { label: 'More morning than evening',   labelCn: '偏向早晨型', value: '4', score: 4, order: 1 },
  { label: 'More evening than morning',   labelCn: '偏向晚上型', value: '2', score: 2, order: 2 },
  { label: 'Definitely an evening type',  labelCn: '完全晚上型', value: '0', score: 0, order: 3 },
]

// Sleep latency (Q2)
const sleepLatency4: Opt[] = [
  { label: '≤ 15 minutes',        labelCn: '≤15分钟',   value: '0', score: 0, order: 0 },
  { label: '16–30 minutes',       labelCn: '16-30分钟', value: '1', score: 1, order: 1 },
  { label: '31–60 minutes',       labelCn: '31-60分钟', value: '2', score: 2, order: 2 },
  { label: 'More than 60 minutes', labelCn: '>60分钟',  value: '3', score: 3, order: 3 },
]

const chronicity5: Opt[] = [
  { label: 'Less than 1 month', labelCn: '少于1个月', value: '0', score: 0, order: 0 },
  { label: '1–3 months',        labelCn: '1到3个月',  value: '1', score: 1, order: 1 },
  { label: '3–6 months',        labelCn: '3到6个月',  value: '2', score: 2, order: 2 },
  { label: '6–12 months',       labelCn: '6到12个月', value: '3', score: 3, order: 3 },
  { label: 'More than 1 year',  labelCn: '超过一年',  value: '4', score: 4, order: 4 },
]

const comfort4: Opt[] = [
  { label: 'Very comfortable',       labelCn: '非常舒适',   value: '0', score: 0, order: 0 },
  { label: 'Mostly comfortable',     labelCn: '比较舒适',   value: '1', score: 1, order: 1 },
  { label: 'Somewhat uncomfortable', labelCn: '有些不舒适', value: '2', score: 2, order: 2 },
  { label: 'Very uncomfortable',     labelCn: '非常不舒适', value: '3', score: 3, order: 3 },
]

const gender3: Opt[] = [
  { label: 'Male',   labelCn: '男',  value: '0', score: 0, order: 0 },
  { label: 'Female', labelCn: '女',  value: '1', score: 1, order: 1 },
  { label: 'Other',  labelCn: '其他', value: '2', score: 2, order: 2 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

type QuestionDef = {
  psqiId: string
  text: string
  textCn: string
  type: QuestionType
  subType?: string
  order: number
  groupId: number
  header?: string
  headerCn?: string
  isRequired?: boolean
  options?: Opt[]
}

async function upsertQuestionnaire(data: {
  title: string
  slug: string
  description: string
  questions: QuestionDef[]
}) {
  // Delete existing (cascades to questions → options → responses)
  await prisma.questionnaire.deleteMany({ where: { slug: data.slug } })

  const q = await prisma.questionnaire.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      status: QuestionnaireStatus.PUBLISHED,
    },
  })

  for (const qn of data.questions) {
    await prisma.question.create({
      data: {
        questionnaireId: q.id,
        psqiId: qn.psqiId,
        text: qn.text,
        textCn: qn.textCn,
        type: qn.type,
        subType: qn.subType ?? null,
        order: qn.order,
        groupId: qn.groupId,
        header: qn.header ?? null,
        headerCn: qn.headerCn ?? null,
        isRequired: qn.isRequired ?? true,
        options: qn.options
          ? { create: qn.options.map((o) => ({ label: o.label, labelCn: o.labelCn, value: o.value, score: o.score, order: o.order })) }
          : undefined,
      },
    })
  }

  console.log(`  ✓ "${data.title}" — ${data.questions.length} questions`)
  return q
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding questionnaires…\n')

  // ── 1. PSQI ──────────────────────────────────────────────────────────────
  await upsertQuestionnaire({
    title: 'Pittsburgh Sleep Quality Index (PSQI)',
    slug: 'psqi-assessment',
    description: 'A standard clinical questionnaire to assess sleep quality over the past month.',
    questions: [
      // ── Group 3 – Sleep Quality / Satisfaction ──
      {
        psqiId: '9',
        text: 'How SATISFIED/DISSATISFIED are you with your current sleep pattern?',
        textCn: '您对自己目前的睡眠模式有多满意或不满意？',
        type: QuestionType.mcq, order: 1, groupId: 3,
        header: 'During the past month:', headerCn: '在过去的一个月里:',
        options: satisfied4,
      },
      // ── Group 4 – Sleep Timing & Duration ──
      {
        psqiId: '1',
        text: 'On weekdays, when have you usually gone to bed at night?',
        textCn: '您通常几点上床睡觉？',
        type: QuestionType.text, subType: 'exactTime', order: 1, groupId: 4,
        header: 'For these next few questions, consider THE PAST MONTH:',
        headerCn: '对于以下问题，请考虑过去一个月:',
      },
      {
        psqiId: '135',
        text: 'On weekends, when have you usually gone to bed at night?',
        textCn: '在周末，您晚上通常几点上床睡觉？',
        type: QuestionType.text, subType: 'exactTime', order: 2, groupId: 4,
      },
      {
        psqiId: '2',
        text: 'How long has it usually taken you to fall asleep each night?',
        textCn: '在关灯以后，您通常需要多久睡着？',
        type: QuestionType.mcq, order: 3, groupId: 4,
        options: sleepLatency4,
      },
      {
        psqiId: '3',
        text: 'On weekdays, when have you usually gotten up in the morning?',
        textCn: '早上，您通常几点起床？',
        type: QuestionType.text, subType: 'exactTime', order: 4, groupId: 4,
      },
      {
        psqiId: '136',
        text: 'On weekends, when have you usually gotten up in the morning?',
        textCn: '在周末的早上，您通常几点起床？',
        type: QuestionType.text, subType: 'exactTime', order: 5, groupId: 4,
      },
      {
        psqiId: '4',
        text: 'How many hours of actual sleep did you get at night? (This may be different from the number of hours you spend in bed.)',
        textCn: '您每晚实际睡眠的时间有多少？',
        type: QuestionType.text, subType: 'exactNumber', order: 6, groupId: 4,
      },
      // ── Group 5 – Sleep Disturbances ──
      {
        psqiId: '5a',
        text: 'How often have you had trouble sleeping because you were not able to get to sleep within 30 minutes?',
        textCn: '您有多少次因为不能在30分钟内入睡而睡眠不好？',
        type: QuestionType.mcq, order: 1, groupId: 5,
        header: 'During the past month:', headerCn: '在过去的一个月里:',
        options: freq4,
      },
      {
        psqiId: '5b',
        text: 'How often have you had trouble sleeping because you woke up in the middle of the night or early morning?',
        textCn: '您有多少次因为在晚上睡眠中醒来或早醒而睡眠不好？',
        type: QuestionType.mcq, order: 2, groupId: 5,
        options: freq4,
      },
      {
        psqiId: '5c',
        text: 'How often have you had trouble sleeping because you had to get up to use the bathroom?',
        textCn: '您有多少次因为晚上起床上洗手间而睡眠不好？',
        type: QuestionType.mcq, order: 3, groupId: 5,
        options: freq4,
      },
      {
        psqiId: '5d',
        text: 'How often have you had trouble sleeping because you could not breathe comfortably?',
        textCn: '您有多少次因为呼吸不舒服而睡眠不好？',
        type: QuestionType.mcq, order: 4, groupId: 5,
        options: freq4,
      },
      {
        psqiId: '5e',
        text: 'How often have you had trouble sleeping because you coughed or snored loudly?',
        textCn: '您有多少次因为咳嗽或打鼾声而睡眠不好？',
        type: QuestionType.mcq, order: 5, groupId: 5,
        options: freq4,
      },
      {
        psqiId: '5f',
        text: 'How often have you had trouble sleeping because you felt too cold or too hot?',
        textCn: '您有多少次因为感到太冷或太热而睡眠不好？',
        type: QuestionType.mcq, order: 6, groupId: 5,
        options: freq4,
      },
      {
        psqiId: '5h',
        text: 'How often have you had trouble sleeping because you had bad dreams?',
        textCn: '您有多少次因为做不好的梦而睡眠不好？',
        type: QuestionType.mcq, order: 7, groupId: 5,
        options: freq4,
      },
      {
        psqiId: '5i',
        text: 'How often have you had trouble sleeping because you had pain?',
        textCn: '您有多少次因为身体疼痛而睡眠不好？',
        type: QuestionType.mcq, order: 8, groupId: 5,
        options: freq4,
      },
      // ── Group 8 – Daytime Dysfunction ──
      {
        psqiId: '8',
        text: 'How often have you had trouble staying awake while driving, eating meals, or engaging in social activity?',
        textCn: '您觉得自己会在开车、吃饭或参加社会活动时，难以保持清醒状态？',
        type: QuestionType.mcq, order: 5, groupId: 8,
        header: 'For these next few questions, consider THE PAST MONTH:',
        headerCn: '对于以下问题，请考虑过去一个月:',
        options: freq4,
      },
      {
        psqiId: '6',
        text: 'How much of a problem has it been for you to keep up enough enthusiasm to get things done?',
        textCn: '您认为自己在保持足够的热情来完成某项任务，是有困难的？',
        type: QuestionType.mcq, order: 6, groupId: 8,
        options: problem4,
      },
      // ── Group 9 – Sleep Medication ──
      {
        psqiId: '7',
        text: 'How often did you take medicine to help you sleep (prescribed or over the counter)?',
        textCn: '您是否需要经常服药才能入睡？（医生处方或药店购买）',
        type: QuestionType.mcq, order: 1, groupId: 9,
        header: 'During the past month:', headerCn: '在过去的一个月里:',
        options: freq4,
      },
    ],
  })

  // ── 2. ISI ───────────────────────────────────────────────────────────────
  await upsertQuestionnaire({
    title: 'Insomnia Severity Index (ISI)',
    slug: 'isi-assessment',
    description: 'Assesses the nature, severity, and impact of insomnia over the past month.',
    questions: [
      // ── Group 2 – Severity & Extent ──
      {
        psqiId: '14a',
        text: 'How SEVERE was your difficulty falling asleep?',
        textCn: '您有入睡困难吗？',
        type: QuestionType.mcq, order: 1, groupId: 2,
        header: 'During the past month:', headerCn: '在过去的一个月里:',
        options: isi5,
      },
      {
        psqiId: '14b',
        text: 'How SEVERE was your difficulty staying asleep?',
        textCn: '您入睡以后，睡眠状态难以维持吗？',
        type: QuestionType.mcq, order: 2, groupId: 2,
        options: isi5,
      },
      {
        psqiId: '14c',
        text: 'How SEVERE was your problem of waking up too early?',
        textCn: '您的过早清醒有多严重？',
        type: QuestionType.mcq, order: 3, groupId: 2,
        options: isi5,
      },
      {
        psqiId: '14f',
        text: 'To what extent do you think that you sleep too much at night?',
        textCn: '您认为自己晚上睡得太多吗？',
        type: QuestionType.mcq, order: 4, groupId: 2,
        options: extent5,
      },
      {
        psqiId: '14d',
        text: 'To what extent do you think that you have difficulty waking up in the morning?',
        textCn: '您认为自己早上醒来有多困难？',
        type: QuestionType.mcq, order: 5, groupId: 2,
        options: extent5,
      },
      {
        psqiId: '14e',
        text: 'To what extent do you feel sleepy during the daytime?',
        textCn: '您觉得自己白天有多困倦？',
        type: QuestionType.mcq, order: 6, groupId: 2,
        options: extent5,
      },
      {
        psqiId: '14g',
        text: 'To what extent do you sleep during the daytime?',
        textCn: '您在白天睡觉吗？',
        type: QuestionType.mcq, order: 7, groupId: 2,
        options: extent5,
      },
      // ── Group 3 – Impact & Concern ──
      {
        psqiId: '15',
        text: 'How WORRIED/DISTRESSED are you about your sleep problem?',
        textCn: '您对目前的睡眠问题的担心或痛苦程度如何？',
        type: QuestionType.mcq, order: 2, groupId: 3,
        options: extent5,
      },
      {
        psqiId: '91',
        text: 'How NOTICEABLE to others do you think your sleep problem is in terms of impairing the quality of your life?',
        textCn: '您的失眠问题影响了您的生活质量，您觉得在别人眼中您的失眠情况如何？',
        type: QuestionType.mcq, order: 3, groupId: 3,
        options: extent5,
      },
      {
        psqiId: '134',
        text: 'To what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g. daytime fatigue, mood, ability to function at work, concentration, memory)?',
        textCn: '您认为您的睡眠问题，在多大程度上影响了您的日常功能？（如：疲劳、情绪、工作能力、注意力、记忆力等）',
        type: QuestionType.mcq, order: 4, groupId: 3,
        options: extent5,
      },
      {
        psqiId: '132',
        text: 'Before going to bed, how CONCERNED do you get about not being able to fall asleep?',
        textCn: '在上床睡觉之前，您有多担心自己无法入睡？',
        type: QuestionType.mcq, order: 5, groupId: 3,
        options: problem4,
      },
      {
        psqiId: '83',
        text: 'How long have you had this sleep pattern?',
        textCn: '您的这种睡眠情况持续多久了？',
        type: QuestionType.mcq, order: 6, groupId: 3,
        options: chronicity5,
      },
    ],
  })

  // ── 3. ESS ───────────────────────────────────────────────────────────────
  await upsertQuestionnaire({
    title: 'Epworth Sleepiness Scale (ESS)',
    slug: 'ess-assessment',
    description: 'Measures daytime sleepiness by asking about likelihood of dozing in various situations.',
    questions: [
      {
        psqiId: '97',
        text: 'Sitting and reading',
        textCn: '坐着看书',
        type: QuestionType.mcq, order: 1, groupId: 6,
        header: 'How likely are you to doze off or fall asleep in the following situations, in contrast to just feeling tired?',
        headerCn: '在以下情况中，您打瞌睡或睡着的可能性有多大？（与单纯感到疲倦相比）',
        options: ess4,
      },
      {
        psqiId: '98',
        text: 'Watching TV',
        textCn: '看电视',
        type: QuestionType.mcq, order: 2, groupId: 6,
        options: ess4,
      },
      {
        psqiId: '99',
        text: 'Sitting inactive in a public place (e.g. theatre or a meeting)',
        textCn: '在公共场合静坐（如：剧院、会议）',
        type: QuestionType.mcq, order: 3, groupId: 6,
        options: ess4,
      },
      {
        psqiId: '100',
        text: 'As a passenger in a car for an hour without a break',
        textCn: '连续乘车一个小时没有休息',
        type: QuestionType.mcq, order: 4, groupId: 6,
        options: ess4,
      },
      {
        psqiId: '101',
        text: 'Lying down to rest in the afternoon when circumstances permit',
        textCn: '在环境允许的情况下，在午后躺下休息',
        type: QuestionType.mcq, order: 5, groupId: 6,
        options: ess4,
      },
      {
        psqiId: '102',
        text: 'Sitting quietly after lunch without alcohol',
        textCn: '在用过午饭后静坐（没有饮酒）',
        type: QuestionType.mcq, order: 6, groupId: 6,
        options: ess4,
      },
      {
        psqiId: '103',
        text: 'Sitting and talking to someone',
        textCn: '坐着与别人谈话',
        type: QuestionType.mcq, order: 7, groupId: 6,
        options: ess4,
      },
      {
        psqiId: '104',
        text: 'In a car, while stopped for a few minutes in traffic',
        textCn: '乘车遇到交通堵塞时',
        type: QuestionType.mcq, order: 8, groupId: 6,
        options: ess4,
      },
    ],
  })

  // ── 4. FAS ───────────────────────────────────────────────────────────────
  await upsertQuestionnaire({
    title: 'Fatigue Assessment Scale (FAS)',
    slug: 'fas-assessment',
    description: 'Measures physical and mental fatigue over the past month.',
    questions: [
      {
        psqiId: '120',
        text: 'I am bothered by fatigue',
        textCn: '我对乏力感到烦恼',
        type: QuestionType.mcq, order: 2, groupId: 7,
        header: 'For these next few questions, consider THE PAST MONTH:',
        headerCn: '对于以下问题，请考虑过去一个月:',
        options: fas5,
      },
      {
        psqiId: '121',
        text: 'I get tired very quickly',
        textCn: '我很快感到疲倦',
        type: QuestionType.mcq, order: 3, groupId: 7,
        options: fas5,
      },
      {
        psqiId: '123',
        text: 'I have enough energy for everyday life',
        textCn: '我每天有足够的精力生活',
        type: QuestionType.mcq, order: 4, groupId: 7,
        options: fas5,
      },
      {
        psqiId: '122',
        text: 'I do not do much during the day',
        textCn: '一天内，我做不了许多事情',
        type: QuestionType.mcq, order: 5, groupId: 7,
        options: fas5,
      },
      {
        psqiId: '130',
        text: 'Physically, I feel exhausted',
        textCn: '我觉得身体上精疲力竭',
        type: QuestionType.mcq, order: 6, groupId: 7,
        options: fas5,
      },
      {
        psqiId: '131',
        text: 'I have problems starting things',
        textCn: '我觉得开始做事时有困难',
        type: QuestionType.mcq, order: 7, groupId: 7,
        options: fas5,
      },
      {
        psqiId: '126',
        text: 'I have problems thinking clearly',
        textCn: '我很难认真仔细的思考',
        type: QuestionType.mcq, order: 8, groupId: 7,
        options: fas5,
      },
      {
        psqiId: '127',
        text: 'I feel no desire to do anything',
        textCn: '我对做任何事都提不起兴致',
        type: QuestionType.mcq, order: 9, groupId: 7,
        options: fas5,
      },
      {
        psqiId: '128',
        text: 'Mentally, I feel exhausted',
        textCn: '我觉得精神不振',
        type: QuestionType.mcq, order: 10, groupId: 7,
        options: fas5,
      },
      {
        psqiId: '129',
        text: 'When I am doing something, I can concentrate quite well',
        textCn: '当我做事时，我可以做到专心致志',
        type: QuestionType.mcq, order: 11, groupId: 7,
        options: fas5,
      },
    ],
  })

  // ── 5. Circadian Rhythm ──────────────────────────────────────────────────
  await upsertQuestionnaire({
    title: 'Circadian Rhythm Assessment',
    slug: 'circadian-rhythm-assessment',
    description: 'Assesses chronotype (Horne-Östberg), social jet lag, and sleep/wake regularity.',
    questions: [
      {
        psqiId: '18',
        text: 'Is your wake time fixed or variable?',
        textCn: '您的起床时间是固定的还是不固定的？',
        type: QuestionType.mcq, order: 1, groupId: 12,
        header: 'For these next few questions, consider THE PAST MONTH:',
        headerCn: '对于以下问题，请考虑过去一个月:',
        options: variation4,
      },
      {
        psqiId: '16',
        text: 'Is your bedtime fixed or variable?',
        textCn: '您的上床睡觉的时间是固定的还是不固定的？',
        type: QuestionType.mcq, order: 2, groupId: 12,
        options: variation4,
      },
      {
        psqiId: '72',
        text: 'Do you have unusual (e.g. night shifts) or irregular working hours?',
        textCn: '您的工作时间是否异常（如：夜班）或不规律？',
        type: QuestionType.mcq, order: 3, groupId: 12,
        options: yesno,
      },
      {
        psqiId: '96',
        text: 'Have you recently jet-traveled across at least two time zones?',
        textCn: '您最近是否旅行横跨至少两个时区？',
        type: QuestionType.mcq, order: 4, groupId: 12,
        options: yesno,
      },
      {
        psqiId: '73',
        text: 'During the past month, how often have you had at least three separate sleep episodes during a 24-hour period (more than one hour each)?',
        textCn: '在过去的一个月里，您有多少次在24小时中，睡着过三次，每次超过至少一个小时的情况？',
        type: QuestionType.mcq, order: 5, groupId: 12,
        options: freq4,
      },
      {
        psqiId: '94',
        text: 'Considering only your "feeling best" rhythm, at what time would you get up if you were entirely free to plan your day?',
        textCn: '如果您自由的安排日程，只考虑"感觉舒服"的规律，您会选择在一天当中的什么时间起床？',
        type: QuestionType.text, subType: 'exactTime', order: 6, groupId: 12,
      },
      {
        psqiId: '95',
        text: 'During the first half-hour after waking up in the morning, how tired do you feel?',
        textCn: '在刚醒来的半小时里，您觉得自己感觉到多疲惫？',
        type: QuestionType.mcq, order: 7, groupId: 12,
        options: horneMorning4,
      },
      {
        psqiId: '117',
        text: 'At what time in the evening do you feel tired and in need of sleep?',
        textCn: '在晚上的什么时间，您会觉得累，因此需要睡觉？',
        type: QuestionType.text, subType: 'exactTime', order: 8, groupId: 12,
      },
      {
        psqiId: '118',
        text: 'At what time do you think you reach your "feeling best" peak?',
        textCn: '在白天，您认为什么时间，是您自我感觉最佳状态的峰值？',
        type: QuestionType.text, subType: 'exactTime', order: 9, groupId: 12,
      },
      {
        psqiId: '119',
        text: 'One hears about "morning" and "evening" types of people. Which one of these types do you consider yourself to be?',
        textCn: '"早晨型"或"晚上型"，您觉得自己更靠近哪种类型？',
        type: QuestionType.mcq, order: 10, groupId: 12,
        options: horneType4,
      },
      {
        psqiId: '44',
        text: 'Do you sleep in during the weekend?',
        textCn: '您在周末会睡懒觉吗？',
        type: QuestionType.mcq, order: 12, groupId: 12,
        options: yesno,
      },
      {
        psqiId: '45',
        text: 'How many more hours of sleep do you get on the weekend compared to the rest of the week on average?',
        textCn: '与周内的平均睡眠时间相比，您周末多睡了几个小时？',
        type: QuestionType.text, subType: 'exactNumber', order: 13, groupId: 12,
      },
    ],
  })

  // ── 6. Breathing Function ────────────────────────────────────────────────
  await upsertQuestionnaire({
    title: 'Breathing & Sleep Apnea Assessment',
    slug: 'breathing-function-assessment',
    description: 'Screens for sleep-related breathing disorders and apnea risk factors.',
    questions: [
      {
        psqiId: '26',
        text: 'Have you had loud snoring (observed by yourself or someone else)?',
        textCn: '您有没有打鼾？（自己或别人的观察）',
        type: QuestionType.mcq, order: 1, groupId: 8,
        header: 'During the past month:', headerCn: '在过去的一个月里:',
        options: freq4,
      },
      {
        psqiId: '27',
        text: 'Have you had long pauses between breaths while asleep (observed by yourself or someone else)?',
        textCn: '在您睡觉时，呼吸之间有没有长时间的停顿？（自己或别人的观察）',
        type: QuestionType.mcq, order: 2, groupId: 8,
        options: yesno,
      },
      {
        psqiId: '28',
        text: 'Have you had leg twitching or cramping while asleep (observed by yourself or someone else)?',
        textCn: '在您睡觉时，您的腿是否有抽动或痉挛的现象？（自己或别人的观察）',
        type: QuestionType.mcq, order: 3, groupId: 8,
        options: yesno,
      },
      {
        psqiId: '31',
        text: 'How often did you wake up with a dry mouth or sore throat?',
        textCn: '当您醒来时，您感觉到嘴巴干或喉咙干燥？',
        type: QuestionType.mcq, order: 4, groupId: 8,
        options: freq4,
      },
      {
        psqiId: '93',
        text: 'Have you been diagnosed with high blood pressure?',
        textCn: '您是否被诊断患有高血压？',
        type: QuestionType.mcq, order: 2, groupId: 11,
        options: yesno,
      },
    ],
  })

  // ── 7. Synchronizers ────────────────────────────────────────────────────
  await upsertQuestionnaire({
    title: 'Circadian Synchronizers',
    slug: 'synchronizers-assessment',
    description: 'Assesses morning light exposure, melatonin factors, breakfast timing, and exercise as circadian cues.',
    questions: [
      {
        psqiId: '133',
        text: 'How bright is your light environment in the 3 hours before bedtime?',
        textCn: '在睡前的三小时内，您房间的灯光有多亮？',
        type: QuestionType.mcq, order: 2, groupId: 10,
        header: 'For these next few questions, consider THE PAST MONTH:',
        headerCn: '对于以下问题，请考虑过去一个月:',
        options: brightness4,
      },
      {
        psqiId: '41',
        text: 'How often did you expose yourself to natural light in the morning for at least 15 minutes?',
        textCn: '您有多频繁的在早上晒至少15分钟的太阳？',
        type: QuestionType.mcq, order: 12, groupId: 9,
        header: 'For these next few questions, consider THE PAST MONTH. How often did you…',
        headerCn: '对于以下问题，请考虑过去一个月，您有多频繁地…',
        options: freq4,
      },
      {
        psqiId: '137',
        text: 'During the past month, do you take breakfast upon awakening?',
        textCn: '在过去的一个月里，您会在早上醒来之后吃早餐吗？',
        type: QuestionType.mcq, order: 14, groupId: 12,
        options: freq4,
      },
      {
        psqiId: '138',
        text: 'During the past month, do you have physical activity in the morning?',
        textCn: '在过去的一个月里，您会在早上进行身体活动吗？',
        type: QuestionType.mcq, order: 15, groupId: 12,
        options: freq4,
      },
    ],
  })

  // ── 8. Sleep Hygiene & Stress ────────────────────────────────────────────
  await upsertQuestionnaire({
    title: 'Sleep Hygiene & Stress',
    slug: 'sleep-hygiene-stress-assessment',
    description: 'Evaluates sleep habits, bedroom environment, substance use, and pre-sleep stress behaviours.',
    questions: [
      // ── Group 9 – Habits / Medication ──
      {
        psqiId: '38',
        text: 'How often did you take any medicine to remain awake?',
        textCn: '您是否需要经常服药才能保持清醒？',
        type: QuestionType.mcq, order: 2, groupId: 9,
        header: 'For these next few questions, consider THE PAST MONTH. How often did you…',
        headerCn: '对于以下问题，请考虑过去一个月，您有多频繁地…',
        options: freq4,
      },
      {
        psqiId: '40',
        text: 'How often did you use alcohol to help you sleep or to relax before bedtime?',
        textCn: '您有多频繁的饮用酒精饮料，使自己入睡或睡前放松？',
        type: QuestionType.mcq, order: 3, groupId: 9,
        options: freq4,
      },
      {
        psqiId: '105',
        text: 'How often did you take medicine that promotes sleep as a side effect (e.g. some antihistamines)?',
        textCn: '您有多频繁的服用一些副作用是促进睡眠的药物？（如：部分抗过敏药物等）',
        type: QuestionType.mcq, order: 4, groupId: 9,
        options: freq4,
      },
      {
        psqiId: '46',
        text: 'How often did you do physical exercise in the 4 hours before bedtime?',
        textCn: '您有多频繁会在睡前的四个小时内进行身体锻炼？',
        type: QuestionType.mcq, order: 5, groupId: 9,
        options: freq4,
      },
      {
        psqiId: '49',
        text: 'How often did you do any activity on your bed except sleeping and sex? (e.g. watch TV, play video games, work/study, eat, read…)',
        textCn: '除去睡觉和性行为，您多频繁的在床上进行其他行为活动？',
        type: QuestionType.mcq, order: 6, groupId: 9,
        options: freq4,
      },
      {
        psqiId: '50',
        text: 'How often did you watch a screen in the 2 hours before sleeping?',
        textCn: '您有多频繁的在睡前两小时看电子屏幕？（如：电视、电脑、手机）',
        type: QuestionType.mcq, order: 7, groupId: 9,
        options: freq4,
      },
      {
        psqiId: '51',
        text: 'How often did you use stimulant products in the 6 hours before bedtime? (e.g. caffeine, energy drinks, some cold medicines)',
        textCn: '您有多频繁的使用含有兴奋作用的产品，在睡前的6小时内？（如：咖啡因、苏打饮料）',
        type: QuestionType.mcq, order: 8, groupId: 9,
        options: freq4,
      },
      {
        psqiId: '52',
        text: 'How often did you take a nap?',
        textCn: '您多频繁的打一次盹？',
        type: QuestionType.mcq, order: 9, groupId: 9,
        options: freq4,
      },
      {
        psqiId: '106',
        text: 'How often did you allow yourself to have mental activities in bed (e.g. thinking, planning, reminiscing)?',
        textCn: '您多频繁的让自己在床上进行一次思想活动？（如：思考、计划、回忆）',
        type: QuestionType.mcq, order: 10, groupId: 9,
        options: freq4,
      },
      {
        psqiId: '66',
        text: 'How often did you engage in emotionally intense activities in the 2 hours before bedtime? (e.g. competitive gaming)',
        textCn: '您多频繁的进行情绪紧张的活动，在睡前的两小时以内？（如：竞技游戏）',
        type: QuestionType.mcq, order: 11, groupId: 9,
        options: freq4,
      },
      // ── Group 10 – Sleep Environment ──
      {
        psqiId: '62',
        text: 'Do you consider your bed comfortable?',
        textCn: '您觉得您的床舒适吗？',
        type: QuestionType.mcq, order: 3, groupId: 10,
        header: 'For these next few questions, consider THE PAST MONTH:',
        headerCn: '对于以下问题，请考虑过去一个月:',
        options: comfort4,
      },
      {
        psqiId: '81',
        text: 'Do you feel like your bedroom is cluttered?',
        textCn: '您觉得您的卧室杂乱吗？',
        type: QuestionType.mcq, order: 4, groupId: 10,
        options: yesno,
      },
      {
        psqiId: '84',
        text: 'Do you consider your sleep environment noisy?',
        textCn: '您认为您的睡眠环境嘈杂吗？',
        type: QuestionType.mcq, order: 5, groupId: 10,
        options: yesno,
      },
      {
        psqiId: '59',
        text: 'Is your bedroom bright while you sleep (either at night or in the morning)?',
        textCn: '无论是白天或晚上，您入睡时，您的卧室环境明亮吗？',
        type: QuestionType.mcq, order: 6, groupId: 10,
        options: brightness4,
      },
      {
        psqiId: '63',
        text: 'Does your bed partner disturb your sleep?',
        textCn: '您的床伴会影响您的睡眠吗？',
        type: QuestionType.mcq, order: 7, groupId: 10,
        options: yesno,
      },
      {
        psqiId: '76',
        text: 'Is it easier to fall asleep outside of your bedroom? (e.g. on the couch)',
        textCn: '您是否觉得您更容易在卧室以外的地方入睡？（如：沙发）',
        type: QuestionType.mcq, order: 8, groupId: 10,
        options: yesno,
      },
      {
        psqiId: '60',
        text: 'What is your bedroom temperature?',
        textCn: '您卧室的室温是多少度？',
        type: QuestionType.text, subType: 'exactNumber', order: 9, groupId: 10,
      },
    ],
  })

  // ── 9. Demographics & Medical ────────────────────────────────────────────
  await upsertQuestionnaire({
    title: 'Demographics & Medical History',
    slug: 'demographics-medical-assessment',
    description: 'Collects biometric data and medical history relevant to sleep disorder diagnosis.',
    questions: [
      // ── Group 1 – Biometrics ──
      {
        psqiId: '10',
        text: 'What is your gender?',
        textCn: '您的性别',
        type: QuestionType.mcq, order: 1, groupId: 1,
        options: gender3,
      },
      {
        psqiId: '11',
        text: 'When were you born?',
        textCn: '您的出生日期',
        type: QuestionType.text, subType: 'exactYear', order: 2, groupId: 1,
      },
      {
        psqiId: '12',
        text: 'How tall are you?',
        textCn: '您的身高',
        type: QuestionType.text, subType: 'exactHeight', order: 3, groupId: 1,
      },
      {
        psqiId: '13',
        text: 'What is your weight?',
        textCn: '您的体重',
        type: QuestionType.text, subType: 'exactWeight', order: 4, groupId: 1,
      },
      // ── Group 7 – Hypersomnia / Sleep Attacks ──
      {
        psqiId: '78',
        text: 'Do you ever have "sleep attacks," defined as unintended sleep in inappropriate situations?',
        textCn: '您有没有觉得，在不恰当的场合里，您受"非预期的入睡"的困扰？',
        type: QuestionType.mcq, order: 1, groupId: 7,
        options: yesno,
      },
      // ── Group 11 – Medical History ──
      {
        psqiId: '79',
        text: 'Do you sometimes experience sudden muscle weakness triggered by strong (usually positive) emotions?',
        textCn: '您是否经历过，在强烈的情绪起伏过后，突然的肌肉无力现象？',
        type: QuestionType.mcq, order: 1, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '70',
        text: 'Have you been diagnosed with any other medical or mental disorder?',
        textCn: '您是否被诊断患有其他医学疾病或精神障碍？',
        type: QuestionType.mcq, order: 3, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '107',
        text: 'Cardiovascular Disease or Dysfunction',
        textCn: '心血管疾病或功能障碍',
        type: QuestionType.mcq, order: 4, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '108',
        text: 'Metabolic Disorder (e.g. Diabetes, Renal insufficiency, Hepatic encephalopathy, Pancreatic insufficiency)',
        textCn: '代谢紊乱（如：糖尿病、肾功能不全、肝性脑病、胰腺功能不全）',
        type: QuestionType.mcq, order: 5, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '109',
        text: 'Gastroesophageal Reflux Disease',
        textCn: '胃食管反流性疾病',
        type: QuestionType.mcq, order: 6, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '110',
        text: 'Breathing Difficulty (e.g. Asthma, Chronic obstructive pulmonary disease)',
        textCn: '呼吸困难（如：哮喘、慢性阻塞性肺病）',
        type: QuestionType.mcq, order: 7, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '111',
        text: 'Thyroid Disease',
        textCn: '甲状腺疾病',
        type: QuestionType.mcq, order: 8, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '112',
        text: 'Parkinson Disease',
        textCn: '帕金森病',
        type: QuestionType.mcq, order: 9, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '114',
        text: 'Central Nervous System Disorder (e.g. stroke, head trauma, epilepsy, inflammatory brain disease)',
        textCn: '中枢神经系统疾病（如：中风、头部创伤、癫痫、脑部炎症性疾病）',
        type: QuestionType.mcq, order: 10, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '115',
        text: 'Chronic Pain (e.g. Arthritis)',
        textCn: '慢性疼痛（如：关节炎）',
        type: QuestionType.mcq, order: 11, groupId: 11,
        options: yesno,
      },
      {
        psqiId: '116',
        text: 'Cancer',
        textCn: '癌症',
        type: QuestionType.mcq, order: 12, groupId: 11,
        options: yesno,
      },
    ],
  })

  console.log('\n✅ All questionnaires seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
