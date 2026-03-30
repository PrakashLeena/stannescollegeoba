import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'
import { sendAdminEmail } from '@/lib/mailer'
import { handleOptions, withCors } from '@/lib/cors'

export const runtime = 'nodejs'

const schema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(50).optional().or(z.literal('')),
  yearLeft: z.string().max(50).optional().or(z.literal('')),
  message: z.string().max(5000).optional().or(z.literal('')),
})

export async function OPTIONS(req: Request) {
  return handleOptions(req)
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const data = schema.parse(json)

    const db = await getDb()
    const created = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || null,
      yearLeft: data.yearLeft || null,
      message: data.message || null,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection('membershipRequests').insertOne(created)

    await sendAdminEmail({
      subject: `New membership request: ${created.fullName}`,
      text: `Full name: ${created.fullName}\nEmail: ${created.email}\nPhone: ${created.phone ?? ''}\nYear left: ${created.yearLeft ?? ''}\n\nMessage:\n${created.message ?? ''}`,
    })

    return withCors(req, NextResponse.json({ ok: true }))
  } catch {
    return withCors(
      req,
      NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
    )
  }
}
