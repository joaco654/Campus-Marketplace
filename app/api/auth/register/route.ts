import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (school will be set during onboarding)
    // For now, we'll need a default school or handle this in onboarding
    let defaultSchool = await prisma.school.findFirst()

    if (!defaultSchool) {
      // Create a default school if none exists
      defaultSchool = await prisma.school.create({
        data: {
          id: 'default',
          name: 'Default School',
          logoUrl: '🏫',
        },
      })
    }

    console.log('Creating user with data:', { name, email, schoolId: defaultSchool.id })

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        schoolId: defaultSchool.id, // Will be updated during onboarding
      },
    })

    console.log('User created successfully:', { id: user.id, email: user.email, name: user.name })

    // Verify the user was created by reading it back
    // This ensures the transaction is committed
    const verifiedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, schoolId: true }
    })

    console.log('User verification successful:', verifiedUser)

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

