import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/admin'

export const runtime = 'nodejs'

const schema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  imageUrl: z.string().url().max(2000).optional().or(z.literal('')),
  order: z.number().int().min(0).max(1000).optional(),
  bio: z.string().max(5000).optional().or(z.literal('')),
  email: z.string().email().max(320).optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
})

export async function GET() {
  try {
    await requireAdminSession()
    const db = await getDb()
    const items = await db
      .collection('committeeMembers')
      .find({}, { projection: { name: 1, role: 1, imageUrl: 1, order: 1, createdAt: 1 } })
      .sort({ order: 1, createdAt: -1 })
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
      name: data.name,
      role: data.role,
      imageUrl: data.imageUrl || null,
      order: data.order ?? 0,
      bio: data.bio || null,
      email: data.email || null,
      phone: data.phone || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const res = await db.collection('committeeMembers').insertOne(doc)
    return NextResponse.json({ ok: true, id: String(res.insertedId) })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}
