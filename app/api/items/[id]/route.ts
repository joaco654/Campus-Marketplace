import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.item.findUnique({
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
      },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching item:', error)
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

    // Get existing item
    const existingItem = await prisma.item.findUnique({
      where: { id: params.id },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    // Check if user owns the item
    if (existingItem.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Handle both FormData (for file uploads) and JSON
    let title, description, category, condition, price, status, images

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      title = formData.get('title')?.toString()
      description = formData.get('description')?.toString()
      category = formData.get('category')?.toString()
      condition = formData.get('condition')?.toString()
      price = formData.get('price')?.toString()
      status = formData.get('status')?.toString()

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
        existingImages = existingItem.images ? JSON.parse(existingItem.images) : []
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
        existingImages.push(`/uploads/${fileNameClean}`)
      }

      images = JSON.stringify(existingImages)
    } else {
      const body = await request.json()
      ;({ title, description, category, condition, price, status, images } = body)
    }

    // Update the item
    const updatedItem = await prisma.item.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(condition && { condition }),
        ...(price && { price: parseFloat(price) }),
        ...(status && { status }),
        ...(images && { images }),
        updatedAt: new Date(),
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

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating item:', error)
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get item and verify user has permission
    const item = await prisma.item.findUnique({
      where: { id: params.id },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    // Only owner can delete their item
    if (item.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the item
    await prisma.item.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



