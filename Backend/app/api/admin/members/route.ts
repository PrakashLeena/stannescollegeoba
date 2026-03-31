import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/admin'

export const runtime = 'nodejs'

const schema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(320).optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
  yearLeft: z.string().max(50).optional().or(z.literal('')),
  jobTitle: z.string().max(200).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  imageUrl: z.string().url().max(2000).optional().or(z.literal('')),
  isActive: z.boolean().optional(),
})

export async function GET() {
  try {
    await requireAdminSession()
    const db = await getDb()
    const items = await db
      .collection('members')
      .find({}, { projection: { fullName: 1, email: 1, phone: 1, yearLeft: 1, isActive: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
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
    const data = schema.parse(json)

    const db = await getDb()
    const doc = {
      fullName: data.fullName,
      email: data.email || null,
      phone: data.phone || null,
      yearLeft: data.yearLeft || null,
      jobTitle: data.jobTitle || null,
      address: data.address || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const res = await db.collection('members').insertOne(doc)
    return NextResponse.json({ ok: true, id: String(res.insertedId) })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}
