import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { id, name, logoUrl, stateCode, stateName } = await request.json()

    if (!id || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if school already exists
    const existingSchool = await prisma.school.findUnique({
      where: { id },
    })

    if (existingSchool) {
      // Update state info if provided and not already set
      if ((stateCode || stateName) && (!existingSchool.stateCode || !existingSchool.stateName)) {
        const updated = await prisma.school.update({
          where: { id },
          data: {
            stateCode: stateCode || existingSchool.stateCode,
            stateName: stateName || existingSchool.stateName,
          },
        })
        return NextResponse.json(updated, { status: 200 })
      }
      return NextResponse.json(existingSchool, { status: 200 })
    }

    // Create school
    const school = await prisma.school.create({
      data: {
        id,
        name,
        logoUrl: logoUrl || null,
        stateCode: stateCode || null,
        stateName: stateName || null,
      },
    })

    return NextResponse.json(school, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      const body = await request.json()
      const school = await prisma.school.findUnique({
        where: { name: body.name },
      })
      return NextResponse.json(school, { status: 200 })
    }
    console.error('School creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(schools)
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

