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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        school: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      major: user.major,
      schoolId: user.schoolId,
      school: user.school,
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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

    // Handle both FormData (for file uploads) and JSON
    let schoolId, major, name, image

    try {
      const contentType = request.headers.get('content-type') || ''
      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData()
        schoolId = formData.get('schoolId')?.toString()
        major = formData.get('major')?.toString()
        name = formData.get('name')?.toString()
        const imageFile = formData.get('image') as File | null

        // Handle image upload
        if (imageFile && imageFile.size > 0) {
          const fileName = `${Date.now()}-${imageFile.name}`
          const filePath = `./public/uploads/${fileName}`

          // Convert the file to a buffer and save it
          const arrayBuffer = await imageFile.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          // Ensure uploads directory exists
          const fs = require('fs').promises
          const path = require('path')
          const dirPath = path.dirname(filePath)
          try {
            await fs.access(dirPath)
          } catch {
            await fs.mkdir(dirPath, { recursive: true })
          }

          // Write the file to disk
          await fs.writeFile(filePath, buffer)

          image = `/uploads/${fileName}`
        }
      } else {
        const body = await request.json()
        ;({ schoolId, major, name, image } = body)
      }
    } catch (error) {
      console.error('Error parsing request body:', error)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (schoolId !== undefined && schoolId !== '') updateData.schoolId = schoolId
    if (major !== undefined && major !== '') updateData.major = major
    if (name !== undefined && name !== '') updateData.name = name
    if (image !== undefined && image !== '') updateData.image = image

    // Handle Google OAuth user creation
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    let user
    if (!existingUser) {
      // Create user if doesn't exist (from Google OAuth)
      if (!schoolId) {
        // Get default school
        const defaultSchool = await prisma.school.findFirst()
        if (!defaultSchool) {
          return NextResponse.json(
            { error: 'No schools available' },
            { status: 500 }
          )
        }
        updateData.schoolId = defaultSchool.id
      }

      user = await prisma.user.create({
        data: {
          email: session.user.email!,
          name: session.user.name || name || 'User',
          image: session.user.image || image,
          schoolId: updateData.schoolId,
          major: major || null,
        },
        include: {
          school: true,
        },
      })
    } else {
      user = await prisma.user.update({
        where: { email: session.user.email },
        data: updateData,
        include: {
          school: true,
        },
      })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      major: user.major,
      schoolId: user.schoolId,
      school: user.school,
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

