import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // In a real app, check if user is admin
    // For now, allow any authenticated user

    const [totalUsers, totalServices, totalMessages, boostedServices] = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.message.count(),
      prisma.service.count({ where: { boosted: true } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalServices,
      totalMessages,
      boostedServices,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

