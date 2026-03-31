import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
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

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdminSession()
    const id = ctx.params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 })
    }

    const db = await getDb()
    const item = await db.collection('committeeMembers').findOne({ _id: new ObjectId(id) })
    return NextResponse.json({ ok: true, item })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 })
  }
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdminSession()
    const id = ctx.params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 })
    }

    const json = await req.json()
    const data = schema.parse(json)

    const db = await getDb()
    await db.collection('committeeMembers').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: data.name,
          role: data.role,
          imageUrl: data.imageUrl || null,
          order: data.order ?? 0,
          bio: data.bio || null,
          email: data.email || null,
          phone: data.phone || null,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdminSession()
    const id = ctx.params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 })
    }

    const db = await getDb()
    await db.collection('committeeMembers').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 })
  }
}
