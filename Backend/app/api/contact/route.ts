import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/mongodb'
import { sendAdminEmail } from '@/lib/mailer'
import { handleOptions, withCors } from '@/lib/cors'

export const runtime = 'nodejs'

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(50).optional().or(z.literal('')),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
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
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      createdAt: new Date(),
    }

    await db.collection('contactSubmissions').insertOne(created)

    await sendAdminEmail({
      subject: `New contact: ${created.subject}`,
      text: `Name: ${created.name}\nEmail: ${created.email}\nPhone: ${created.phone ?? ''}\n\nMessage:\n${created.message}`,
    })

    return withCors(req, NextResponse.json({ ok: true }))
  } catch {
    return withCors(
      req,
      NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
    )
  }
}
