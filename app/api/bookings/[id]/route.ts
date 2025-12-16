import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            title: true,
            category: true,
            images: true,
            description: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user is involved in this booking
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser || (booking.buyerId !== currentUser.id && booking.sellerId !== currentUser.id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, notes, location, startTime, endTime, date } = body

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get booking and verify user has permission
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only buyer and seller can update the booking
    if (booking.buyerId !== currentUser.id && booking.sellerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (status) {
      updateData.status = status
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date()
      }
    }

    if (notes !== undefined) updateData.notes = notes
    if (location !== undefined) updateData.location = location
    if (startTime !== undefined) updateData.startTime = startTime
    if (endTime !== undefined) updateData.endTime = endTime
    if (date !== undefined) updateData.date = new Date(date)

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
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

    // Send notifications based on status change
    if (status) {
      if (status === 'CONFIRMED') {
        console.log(`✅ BOOKING CONFIRMED: "${booking.title}" confirmed for ${booking.date.toDateString()} at ${booking.startTime}`)
      } else if (status === 'COMPLETED') {
        console.log(`🎉 BOOKING COMPLETED: "${booking.title}" marked as completed`)
      } else if (status === 'CANCELLED') {
        console.log(`❌ BOOKING CANCELLED: "${booking.title}" was cancelled`)
      }
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get booking and verify user has permission
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only buyer can cancel pending bookings, both can cancel after agreement
    const canCancel = (
      booking.status === 'PENDING' && booking.buyerId === currentUser.id
    ) || (
      (booking.buyerId === currentUser.id || booking.sellerId === currentUser.id) &&
      ['CONFIRMED', 'IN_PROGRESS'].includes(booking.status)
    )

    if (!canCancel) {
      return NextResponse.json(
        { error: 'Cannot cancel this booking' },
        { status: 403 }
      )
    }

    // Update status to CANCELLED instead of deleting
    const cancelledBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(cancelledBooking)
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
