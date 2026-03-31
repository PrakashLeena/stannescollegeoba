import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
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

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdminSession()
    const id = ctx.params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 })
    }

    const db = await getDb()
    const item = await db.collection('members').findOne({ _id: new ObjectId(id) })
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
    await db.collection('members').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          fullName: data.fullName,
          email: data.email || null,
          phone: data.phone || null,
          yearLeft: data.yearLeft || null,
          jobTitle: data.jobTitle || null,
          address: data.address || null,
          imageUrl: data.imageUrl || null,
          isActive: data.isActive ?? true,
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
    await db.collection('members').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 })
  }
}
