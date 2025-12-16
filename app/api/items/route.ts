import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const condition = searchParams.get('condition')
    const schoolId = searchParams.get('schoolId')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const status = searchParams.get('status') || 'available'

    const where: any = {
      status,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (condition && condition !== 'all') {
      where.condition = condition
    }

    if (schoolId && schoolId !== 'all') {
      where.schoolId = schoolId
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) }
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) }
    }

    const items = await prisma.item.findMany({
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
        { createdAt: 'desc' },
      ],
      take: 50,
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
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

    // Handle both FormData (for file uploads) and JSON
    let title, description, category, condition, price, images

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      title = formData.get('title')?.toString()
      description = formData.get('description')?.toString()
      category = formData.get('category')?.toString()
      condition = formData.get('condition')?.toString() || 'good'
      price = formData.get('price')?.toString()

      // Handle image uploads
      const imageFiles: File[] = []
      for (let i = 0; ; i++) {
        const imageFile = formData.get(`image_${i}`) as File
        if (!imageFile || imageFile.size === 0) break
        imageFiles.push(imageFile)
      }

      // Process images and save to disk with basic content protection
      images = []
      const inappropriateKeywords = ['nsfw', 'adult', 'porn', 'naked', 'sex', 'explicit']

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]

        // Basic content protection checks
        const fileName = file.name.toLowerCase()
        const hasInappropriateContent = inappropriateKeywords.some(keyword =>
          fileName.includes(keyword)
        )

        if (hasInappropriateContent) {
          throw new Error(`Image ${i + 1} appears to contain inappropriate content. Please choose different images.`)
        }

        // Additional basic checks
        if (file.size === 0) {
          throw new Error(`Image ${i + 1} appears to be empty or corrupted.`)
        }

        const fileNameClean = `${Date.now()}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = `./public/uploads/${fileNameClean}`

        // Convert file to buffer and save
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Ensure directory exists
        const fs = require('fs').promises
        const path = require('path')
        const dirPath = path.dirname(filePath)
        try {
          await fs.access(dirPath)
        } catch {
          await fs.mkdir(dirPath, { recursive: true })
        }

        await fs.writeFile(filePath, buffer)
        images.push(`/uploads/${fileNameClean}`)
      }

      images = JSON.stringify(images)
    } else {
      const body = await request.json()
      ;({ title, description, category, condition, price, images } = body)
    }

    if (!title || !description || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        condition: condition || 'good',
        price: parseFloat(price),
        images: images || null,
        userId: user.id,
        schoolId: user.schoolId,
        status: 'available',
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

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}



