import { NextResponse } from 'next/server'
import { prisma } from '~/lib/prisma'
import type { ExportRow } from '~/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  // Wrap in quotes if the cell contains a comma, newline, or double-quote
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function rowsToCsv(headers: string[], rows: ExportRow[]): string {
  const headerLine = headers.map(escapeCsvCell).join(',')

  const dataLines = rows.map((row) =>
    [
      escapeCsvCell(row.userId),
      escapeCsvCell(row.userEmail),
      escapeCsvCell(row.userName),
      escapeCsvCell(row.questionnaireTitle),
      escapeCsvCell(row.questionText),
      escapeCsvCell(row.questionType),
      escapeCsvCell(row.answer),
      escapeCsvCell(row.score),
      escapeCsvCell(row.answeredAt),
    ].join(','),
  )

  return [headerLine, ...dataLines].join('\n')
}

// ---------------------------------------------------------------------------
// Route Handler — GET /api/export/[userId]
// ---------------------------------------------------------------------------

interface RouteParams {
  params: { userId: string }
}

export async function GET(
  _request: Request,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { userId } = params

  // Basic validation
  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'Invalid userId.' }, { status: 400 })
  }

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  // Fetch all responses with joined question + questionnaire data
  const responses = await prisma.response.findMany({
    where: { userId },
    include: {
      question: {
        include: {
          questionnaire: { select: { title: true } },
        },
      },
      option: { select: { label: true } },
    },
    orderBy: [
      { question: { questionnaire: { title: 'asc' } } },
      { question: { order: 'asc' } },
    ],
  })

  if (responses.length === 0) {
    return NextResponse.json(
      { error: 'No responses found for this user.' },
      { status: 404 },
    )
  }

  // Map to export rows
  const rows: ExportRow[] = responses.map((r) => ({
    userId: user.id,
    userEmail: user.email,
    userName: user.name ?? '',
    questionnaireTitle: r.question.questionnaire.title,
    questionText: r.question.text,
    questionType: r.question.type,
    answer:
      r.question.type === 'mcq'
        ? (r.option?.label ?? r.optionId ?? '')
        : (r.textAnswer ?? ''),
    score: r.score,
    answeredAt: r.updatedAt.toISOString(),
  }))

  const CSV_HEADERS = [
    'User ID',
    'Email',
    'Name',
    'Questionnaire',
    'Question',
    'Type',
    'Answer',
    'Score',
    'Answered At',
  ]

  const csv = rowsToCsv(CSV_HEADERS, rows)
  const filename = `responses_${userId}_${Date.now()}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
