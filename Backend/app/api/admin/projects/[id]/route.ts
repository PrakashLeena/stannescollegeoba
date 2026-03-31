import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/admin'

export const runtime = 'nodejs'

const schema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  summary: z.string().max(1000).optional().or(z.literal('')),
  content: z.string().max(20000).optional().or(z.literal('')),
  imageUrl: z.string().url().max(2000).optional().or(z.literal('')),
  isPublished: z.boolean().optional(),
})

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdminSession()
    const id = ctx.params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 })
    }

    const db = await getDb()
    const item = await db.collection('projects').findOne({ _id: new ObjectId(id) })
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
    await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: data.title,
          slug: data.slug,
          summary: data.summary || null,
          content: data.content || null,
          imageUrl: data.imageUrl || null,
          isPublished: data.isPublished ?? false,
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
    await db.collection('projects').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 })
  }
}
