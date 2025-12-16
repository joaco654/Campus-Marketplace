import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Helper function to send notification (this would be called from the client side)
const sendNotificationToUser = async (userId: string, notification: any) => {
  // This is a placeholder - in a real implementation, you'd store this in a database
  // or use a notification service. For now, we'll rely on client-side notification handling.
  console.log('Would send notification to user:', userId, notification)
}

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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
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

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: userId },
          { senderId: userId, receiverId: currentUser.id },
        ],
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        service: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: currentUser.id,
        read: false,
      },
      data: {
        read: true,
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
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
    const { receiverId, content, serviceId } = body

    console.log('Message API received:', { receiverId, content, serviceId, hasContent: !!content, hasReceiverId: !!receiverId })

    if (!receiverId || !content) {
      console.log('Missing required fields:', { receiverId: !!receiverId, content: !!content })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Looking up sender with email:', session.user.email)
    console.log('Prisma client available:', !!prisma)

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    console.log('Database query completed')

    console.log('Sender found:', { id: sender?.id, name: sender?.name })

    if (!sender) {
      console.log('Sender not found for email:', session.user.email)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('Creating message with data:', {
      senderId: sender.id,
      receiverId,
      content,
      serviceId: serviceId || null
    })

    const message = await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId,
        content,
        serviceId: serviceId || null,
      },
      include: {
        sender: {
          select: {
            name: true,
            image: true,
          },
        },
        receiver: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    console.log('Message created successfully:', { id: message.id, content: message.content })
    console.log('Message created successfully, returning response')
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
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

    // Mark messages as read
    const result = await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: currentUser.id,
        read: false,
      },
      data: {
        read: true,
      },
    })

    console.log(`Marked ${result.count} messages as read for user ${currentUser.id} from ${userId}`)

    return NextResponse.json({ success: true, updatedCount: result.count })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

