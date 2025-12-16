import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const schoolId = searchParams.get('schoolId')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const status = searchParams.get('status') || 'available'
    const userOnly = searchParams.get('user') === 'true'

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

    if (schoolId && schoolId !== 'all') {
      where.schoolId = schoolId
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) }
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) }
    }

    if (userOnly && session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      if (user) {
        where.userId = user.id
      }
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        user: {
          select: {
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
        ratings: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: [
        { boosted: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 50,
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
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

    // Handle both FormData (for file uploads) and JSON
    let title, description, category, price, pricingModel, images, schoolId

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      title = formData.get('title')?.toString()
      description = formData.get('description')?.toString()
      category = formData.get('category')?.toString()
      price = formData.get('price')?.toString()
      pricingModel = formData.get('pricingModel')?.toString() || 'fixed'
      schoolId = formData.get('schoolId')?.toString()

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

      console.log('Creating service with FormData:', {
        title, description, category, price, pricingModel, schoolId,
        imageCount: images.length
      })
    } else {
      const body = await request.json()
      ;({ title, description, category, price, pricingModel, images, schoolId } = body)

      console.log('Creating service with JSON:', {
        title, description, category, price, pricingModel, images, schoolId
      })
    }

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user to get their school
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        category,
        price: pricingModel === 'free' ? 0 : (price ? parseFloat(price) : 0),
        images: images ? JSON.stringify(images) : null,
        userId: user.id,
        schoolId: schoolId || user.schoolId,
        status: 'available',
        pricingModel: pricingModel || 'fixed',
      },
      include: {
        user: {
          select: {
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

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

