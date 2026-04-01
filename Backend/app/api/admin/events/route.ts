import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/admin'

export const runtime = 'nodejs'

const schema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  section: z.enum(['activities', 'upcoming']).optional(),
  description: z.string().max(20000).optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url().max(2000).optional().or(z.literal('')),
  isPublished: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAdminSession()
    const db = await getDb()
    const items = await db
      .collection('events')
      .find(
        {},
        {
          projection: {
            title: 1,
            slug: 1,
            section: 1,
            location: 1,
            startDate: 1,
            endDate: 1,
            imageUrl: 1,
            isPublished: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray()
    return NextResponse.json({ ok: true, items })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminSession()
    const json = await req.json()
    const data = schema.parse(json)

    const db = await getDb()
    const doc = {
      title: data.title,
      slug: data.slug,
      section: data.section || 'activities',
      description: data.description || null,
      location: data.location || null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      imageUrl: data.imageUrl || null,
      isPublished: data.isPublished ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const res = await db.collection('events').insertOne(doc)
    return NextResponse.json({ ok: true, id: String(res.insertedId) })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}
