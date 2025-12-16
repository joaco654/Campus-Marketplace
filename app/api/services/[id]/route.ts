import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            major: true,
          },
        },
        school: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Add pricingModel to the response if it doesn't exist (for backward compatibility)
    const serviceWithPricing = {
      ...service,
      pricingModel: service.pricingModel || 'fixed',
    }

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
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
  console.log('PATCH request received for service:', params.id)
  try {
    const session = await getServerSession(authOptions)
    console.log('Session check:', { hasSession: !!session, email: session?.user?.email })

    if (!session?.user?.email) {
      console.log('Unauthorized: no session or email')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current user
    console.log('Looking up user:', session.user.email)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    console.log('User found:', { id: user?.id, exists: !!user })

    if (!user) {
      console.log('User not found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get existing service
    console.log('Looking up service:', params.id)
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
    })
    console.log('Service found:', { exists: !!existingService, userId: existingService?.userId })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if user owns the service
    if (existingService.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Handle both FormData (for file uploads) and JSON
    let title, description, category, price, pricingModel, images

    const contentType = request.headers.get('content-type') || ''
    console.log('Content type:', contentType)

    if (contentType.includes('multipart/form-data')) {
      console.log('Processing FormData upload')
      const formData = await request.formData()
      title = formData.get('title')?.toString()
      description = formData.get('description')?.toString()
      category = formData.get('category')?.toString()
      price = formData.get('price')?.toString()
      pricingModel = formData.get('pricingModel')?.toString() || 'fixed'

      // Handle image uploads - only add new images, don't replace existing
      const imageFiles: File[] = []
      for (let i = 0; ; i++) {
        const imageFile = formData.get(`image_${i}`) as File
        if (!imageFile || imageFile.size === 0) break
        imageFiles.push(imageFile)
      }

      // Process new images and merge with existing
      let existingImages = []
      try {
        existingImages = existingService.images ? JSON.parse(existingService.images) : []
      } catch (error) {
        console.error('Error parsing existing images:', error)
        existingImages = []
      }

      // Add new images to existing ones
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
        console.log('Processing file:', { name: file.name, size: file.size, path: filePath })

        // Convert file to buffer and save
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Ensure directory exists
        const fs = require('fs').promises
        const path = require('path')
        const dirPath = path.dirname(filePath)
        console.log('Checking directory:', dirPath)

        try {
          await fs.access(dirPath)
          console.log('Directory exists')
        } catch {
          console.log('Creating directory')
          await fs.mkdir(dirPath, { recursive: true })
        }

        console.log('Writing file to disk')
        await fs.writeFile(filePath, buffer)
        console.log('File written successfully')
        existingImages.push(`/uploads/${fileNameClean}`)
        console.log('Added to existing images array')
      }

      images = JSON.stringify(existingImages)
    } else {
      const body = await request.json()
      ;({ title, description, category, price, pricingModel, images } = body)
    }

    // Handle JSON updates (for admin features like status/boosting)
    let statusUpdate, boosted, boostedUntil
    if (!contentType.includes('multipart/form-data')) {
      const body = await request.json()
      ;({ title, description, category, price, pricingModel, images, status: statusUpdate, boosted, boostedUntil } = body)
    }

    // Update the service
    console.log('Updating service with data:', {
      title, description, category, price, pricingModel,
      hasImages: !!images, statusUpdate, boosted, boostedUntil
    })

    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(price && { price: pricingModel === 'free' ? 0 : parseFloat(price) }),
        ...(pricingModel && { pricingModel }),
        ...(images && { images }),
        ...(statusUpdate && { status: statusUpdate }),
        ...(boosted !== undefined && { boosted }),
        ...(boostedUntil && { boostedUntil: new Date(boostedUntil) }),
        updatedAt: new Date(),
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

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
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

    // Check if user owns the service
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: { user: true },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (service.userId !== user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the service
    await prisma.service.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

