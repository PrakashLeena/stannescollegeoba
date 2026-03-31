import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/admin'
import { cloudinary } from '@/lib/cloudinary'

export const runtime = 'nodejs'

const querySchema = z.object({
  folder: z.string().min(1).max(200).optional(),
})

export async function POST(req: Request) {
  try {
    await requireAdminSession()

    const { searchParams } = new URL(req.url)
    const parsed = querySchema.safeParse({ folder: searchParams.get('folder') || undefined })
    const folder = parsed.success ? parsed.data.folder : undefined

    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'Missing file' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploaded = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder || 'stannesppa/uploads',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )

      stream.end(buffer)
    })

    return NextResponse.json({
      ok: true,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      width: uploaded.width,
      height: uploaded.height,
      format: uploaded.format,
      bytes: uploaded.bytes,
    })
  } catch (e: any) {
    if (String(e?.message) === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: false, error: 'Upload failed' }, { status: 500 })
  }
}
