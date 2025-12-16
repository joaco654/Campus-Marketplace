import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const schoolId = searchParams.get('schoolId')
    const visibility = searchParams.get('visibility') || 'public'
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {
      status: 'active',
      visibility: {
        in: ['public', visibility === 'school-only' ? 'school-only' : 'public']
      }
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (schoolId) {
      where.schoolId = schoolId
    }

    if (startDate || endDate) {
      where.startDate = {}
      if (startDate) {
        where.startDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.startDate.lte = new Date(endDate)
      }
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        school: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
      orderBy: [
        { startDate: 'asc' },
      ],
      take: limit,
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const {
      title,
      description,
      category,
      eventType = 'student-organized',
      startDate,
      endDate,
      location,
      isAllDay = false,
      isRecurring = false,
      recurrenceRule,
      maxAttendees,
      cost,
      registrationUrl,
      contactInfo,
      tags,
      images,
      visibility = 'public'
    } = body

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!title || !description || !category || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, startDate' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        eventType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        isAllDay,
        isRecurring,
        recurrenceRule,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        cost: cost ? parseFloat(cost) : null,
        registrationUrl,
        contactInfo,
        tags: tags ? JSON.stringify(tags) : null,
        images: images ? JSON.stringify(images) : null,
        visibility,
        userId: user.id,
        schoolId: user.schoolId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        school: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}



