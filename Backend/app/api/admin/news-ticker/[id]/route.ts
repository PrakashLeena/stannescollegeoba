import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/admin'

export const runtime = 'nodejs'

const schema = z.object({
  text: z.string().min(1).max(500),
  isActive: z.boolean().optional(),
  order: z.number().int().optional(),
})

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdminSession()
    const id = ctx.params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 })
    }

    const db = await getDb()
    const item = await db.collection('newsTicker').findOne({ _id: new ObjectId(id) })
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
    await db.collection('newsTicker').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          text: data.text,
          isActive: data.isActive ?? true,
          ...(typeof data.order === 'number' ? { order: data.order } : {}),
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
    await db.collection('newsTicker').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 })
  }
}
