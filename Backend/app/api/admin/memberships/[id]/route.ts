import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'
import { requireAdminSession } from '@/lib/admin'

export const runtime = 'nodejs'

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  try {
    await requireAdminSession()
    const id = ctx.params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 })
    }

    const db = await getDb()
    await db.collection('membershipRequests').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Request failed' }, { status: 500 })
  }
}
