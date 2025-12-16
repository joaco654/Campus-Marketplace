import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as ical from 'ical'

export async function POST(request: Request) {
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

    const body = await request.json()
    const { feedUrl, feedType = 'ical' } = body

    if (!feedUrl) {
      return NextResponse.json(
        { error: 'feedUrl is required' },
        { status: 400 }
      )
    }

    console.log(`Syncing ${feedType} feed: ${feedUrl}`)

    let eventsCreated = 0
    let eventsUpdated = 0
    let eventsSkipped = 0

    try {
      if (feedType === 'ical') {
        // Fetch and parse iCal feed
        const response = await fetch(feedUrl, {
          headers: {
            'User-Agent': 'Campus-Marketplace/1.0',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch iCal feed: ${response.status}`)
        }

        const icalData = await response.text()
        const parsedData = ical.parseICS(icalData)

        // Process each event
        for (const key in parsedData) {
          const item = parsedData[key]

          // Skip non-events
          if (item.type !== 'VEVENT') continue

          // Skip events without start date
          if (!item.start) continue

          // Check if event already exists (by title and start date)
          const existingEvent = await prisma.event.findFirst({
            where: {
              title: item.summary,
              startDate: new Date(item.start),
              schoolId: user.schoolId,
              eventType: 'university-official',
            },
          })

          const eventData = {
            title: item.summary || 'Untitled Event',
            description: item.description || '',
            category: 'academic', // Default category for university events
            eventType: 'university-official' as const,
            startDate: new Date(item.start),
            endDate: item.end ? new Date(item.end) : null,
            location: item.location || null,
            isAllDay: !item.start || item.start.getHours() === 0,
            maxAttendees: null,
            cost: null,
            registrationUrl: null,
            contactInfo: null,
            tags: null,
            images: null,
            visibility: 'public' as const,
            userId: null, // University events don't have a specific user
            schoolId: user.schoolId,
          }

          if (existingEvent) {
            // Update existing event
            await prisma.event.update({
              where: { id: existingEvent.id },
              data: eventData,
            })
            eventsUpdated++
          } else {
            // Create new event
            await prisma.event.create({
              data: eventData,
            })
            eventsCreated++
          }
        }
      } else if (feedType === 'rss') {
        // For RSS feeds, we could implement XML parsing
        // This would be more complex and university-specific
        return NextResponse.json(
          { error: 'RSS feed sync not implemented yet' },
          { status: 501 }
        )
      } else {
        return NextResponse.json(
          { error: 'Unsupported feed type. Use "ical" or "rss"' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Sync completed. Created: ${eventsCreated}, Updated: ${eventsUpdated}, Skipped: ${eventsSkipped}`,
        stats: {
          created: eventsCreated,
          updated: eventsUpdated,
          skipped: eventsSkipped,
        },
      })

    } catch (syncError) {
      console.error('Sync error:', syncError)
      return NextResponse.json(
        { error: `Sync failed: ${syncError instanceof Error ? syncError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error syncing events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to list available sync sources (for admin)
export async function GET(request: Request) {
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
      include: { school: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return suggested sync sources based on school
    const suggestedSources = []

    // This would be customized per university
    // For now, return a generic structure
    suggestedSources.push({
      name: `${user.school.name} Academic Calendar`,
      type: 'ical',
      url: '', // Would need to be configured per university
      description: 'Official academic calendar with important dates, deadlines, and events.',
    })

    suggestedSources.push({
      name: `${user.school.name} Events Calendar`,
      type: 'ical',
      url: '', // Would need to be configured per university
      description: 'Student events, clubs, and campus activities.',
    })

    return NextResponse.json({
      school: user.school.name,
      suggestedSources,
      note: 'Feed URLs need to be configured by administrators. Contact your campus IT department for official calendar feed URLs.',
    })

  } catch (error) {
    console.error('Error fetching sync sources:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


