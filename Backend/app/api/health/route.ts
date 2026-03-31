import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export const runtime = 'nodejs'

export async function GET() {
  const env = {
    hasMongodbUri: Boolean(process.env.MONGODB_URI),
    hasMongodbDb: Boolean(process.env.MONGODB_DB),
    hasNextauthSecret: Boolean(process.env.NEXTAUTH_SECRET),
    hasNextauthUrl: Boolean(process.env.NEXTAUTH_URL),
  }

  let mongodbOk = false
  let mongodbError: string | null = null

  try {
    const client = await clientPromise
    await client.db(process.env.MONGODB_DB).command({ ping: 1 })
    mongodbOk = true
  } catch (e: any) {
    mongodbError = e?.message ? String(e.message) : 'MongoDB connection failed'
  }

  return NextResponse.json({ ok: env.hasNextauthSecret && env.hasMongodbUri, env, mongodbOk, mongodbError })
}
