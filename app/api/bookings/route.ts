import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Note: We'll add notification integration here when the notification system is enhanced

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId') // For getting bookings for a specific user

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get bookings where user is buyer or seller
    const where: any = {
      OR: [
        { buyerId: currentUser.id },
        { sellerId: currentUser.id },
      ],
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (userId) {
      // If userId is specified, get bookings between current user and that user
      where.OR = [
        { buyerId: currentUser.id, sellerId: userId },
        { buyerId: userId, sellerId: currentUser.id },
      ]
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            title: true,
            category: true,
            images: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
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
    const { serviceId, date, startTime, endTime, location, notes, price } = body

    if (!serviceId || !date || !startTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current user
    const buyer = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!buyer) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get service and verify it exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { user: true },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Don't allow booking your own service
    if (service.userId === buyer.id) {
      return NextResponse.json(
        { error: 'Cannot book your own service' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        buyerId: buyer.id,
        sellerId: service.userId,
        title: service.title,
        description: notes || `Booking for ${service.title}`,
        date: new Date(date),
        startTime,
        endTime,
        location,
        notes,
        price: price || service.price,
      },
      include: {
        service: {
          select: {
            title: true,
            category: true,
          },
        },
        buyer: {
          select: {
            name: true,
            image: true,
          },
        },
        seller: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    // TODO: Send notification to seller about new booking request
    console.log(`📅 NEW BOOKING REQUEST: ${buyer.name} requested booking for "${service.title}" on ${date} at ${startTime}`)

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
