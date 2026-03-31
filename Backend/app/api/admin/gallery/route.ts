import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/admin'

export const runtime = 'nodejs'

const createSchema = z.object({
  title: z.string().min(1).max(200),
  imageUrl: z.string().url().max(2000),
  publicId: z.string().min(1).max(500).optional().or(z.literal('')),
})

export async function GET() {
  try {
    await requireAdminSession()
    const db = await getDb()
    const items = await db
      .collection('galleryItems')
      .find({}, { projection: { title: 1, imageUrl: 1, publicId: 1, createdAt: 1 } })
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
    const data = createSchema.parse(json)

    const db = await getDb()
    const doc = {
      title: data.title,
      imageUrl: data.imageUrl,
      publicId: data.publicId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const res = await db.collection('galleryItems').insertOne(doc)
    return NextResponse.json({ ok: true, id: String(res.insertedId) })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdminSession()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 })
    }

    const db = await getDb()
    await db.collection('galleryItems').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 })
  }
}
