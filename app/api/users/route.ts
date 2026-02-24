import { NextResponse } from 'next/server'
import { prisma } from '~/lib/prisma'
import type { PaginatedResponse, UserListItem } from '~/types'

// GET /api/users?page=1&pageSize=20&is_premium=true&search=jane
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)

  const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const pageSize = Math.min(
    100,
    Math.max(1, Number(searchParams.get('pageSize') ?? '20')),
  )
  const isPremiumParam = searchParams.get('is_premium')
  const search = searchParams.get('search') ?? ''

  const where = {
    ...(isPremiumParam !== null && { is_premium: isPremiumParam === 'true' }),
    ...(search && {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        is_premium: true,
        role: true,
        createdAt: true,
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  const data: UserListItem[] = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }))

  const response: PaginatedResponse<UserListItem> = {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }

  return NextResponse.json(response)
}
