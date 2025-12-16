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

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get all unique conversations
    const sentMessages = await prisma.message.findMany({
      where: { senderId: currentUser.id },
      select: { receiverId: true },
      distinct: ['receiverId'],
    })

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: currentUser.id },
      select: { senderId: true },
      distinct: ['senderId'],
    })

    const allUserIds = new Set<string>()
    sentMessages.forEach((m) => allUserIds.add(m.receiverId))
    receivedMessages.forEach((m) => allUserIds.add(m.senderId))

    const conversations = await Promise.all(
      Array.from(allUserIds).map(async (otherUserId) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: currentUser.id, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: currentUser.id },
            ],
          },
          orderBy: { createdAt: 'desc' },
          include: {
            service: {
              select: {
                title: true,
              },
            },
          },
        })

        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: currentUser.id,
            read: false,
          },
        })

        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            name: true,
            image: true,
          },
        })

        return {
          otherUserId,
          otherUserName: otherUser?.name || 'Unknown',
          otherUserImage: otherUser?.image || null,
          lastMessage: lastMessage?.content || '',
          lastMessageTime: lastMessage?.createdAt || new Date(),
          serviceTitle: lastMessage?.service?.title || null,
          unreadCount,
        }
      })
    )

    // Sort by last message time
    conversations.sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    )

    // Calculate total unread messages for the current user
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

    return NextResponse.json({
      conversations,
      totalUnread
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

