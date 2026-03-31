import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/admin'

export const runtime = 'nodejs'

const createSchema = z.object({
  text: z.string().min(1).max(500),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAdminSession()
    const db = await getDb()
    const items = await db
      .collection('newsTicker')
      .find({}, { projection: { text: 1, isActive: 1, order: 1, createdAt: 1 } })
      .sort({ order: 1, createdAt: -1 })
      .limit(500)
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

    const last = await db.collection('newsTicker').find({}, { projection: { order: 1 } }).sort({ order: -1 }).limit(1).toArray()
    const nextOrder = (last?.[0]?.order ?? 0) + 1

    const doc = {
      text: data.text,
      isActive: data.isActive ?? true,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const res = await db.collection('newsTicker').insertOne(doc)
    return NextResponse.json({ ok: true, id: String(res.insertedId) })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}
