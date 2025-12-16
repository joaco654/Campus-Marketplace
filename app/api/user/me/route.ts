import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    console.log('User API called with userId:', userId)

    if (userId) {
      // Get another user's info by ID
      console.log('Looking up user by ID:', userId)
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          image: true,
        },
      })

      console.log('User lookup result:', user ? { id: user.id, name: user.name } : 'null')

      if (!user) {
        console.error('User not found for ID:', userId)
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(user)
    } else {
      // Get current user's info
      const session = await getServerSession(authOptions)

      console.log('Getting current user info, session:', session?.user)

      if (!session?.user?.email) {
        console.error('No session or email found')
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      console.log('Looking up current user by email:', session.user.email)
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      })

      console.log('Current user lookup result:', user ? { id: user.id, name: user.name, email: user.email } : 'null')

      if (!user) {
        console.error('Current user not found for email:', session.user.email)
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(user)
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

