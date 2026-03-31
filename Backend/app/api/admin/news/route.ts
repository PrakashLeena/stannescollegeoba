import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/admin'

export const runtime = 'nodejs'

const schema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  content: z.string().max(20000).optional().or(z.literal('')),
  imageUrl: z.string().url().max(2000).optional().or(z.literal('')),
  publishedAt: z.string().optional().or(z.literal('')),
  isPublished: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAdminSession()
    const db = await getDb()
    const items = await db
      .collection('news')
      .find({}, { projection: { title: 1, slug: 1, excerpt: 1, imageUrl: 1, isPublished: 1, publishedAt: 1, createdAt: 1 } })
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
      excerpt: data.excerpt || null,
      content: data.content || null,
      imageUrl: data.imageUrl || null,
      isPublished: data.isPublished ?? false,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const res = await db.collection('news').insertOne(doc)
    return NextResponse.json({ ok: true, id: String(res.insertedId) })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}
