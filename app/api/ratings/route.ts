import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { serviceId, rating, review } = body

    if (!serviceId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating data' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user already rated this service
    const existingRating = await prisma.rating.findUnique({
      where: {
        serviceId_userId: {
          serviceId,
          userId: user.id,
        },
      },
    })

    if (existingRating) {
      // Update existing rating
      const updated = await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          rating,
          review: review || null,
        },
      })
      return NextResponse.json(updated)
    }

    // Create new rating
    const newRating = await prisma.rating.create({
      data: {
        serviceId,
        userId: user.id,
        rating,
        review: review || null,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(newRating, { status: 201 })
  } catch (error) {
    console.error('Error creating rating:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

