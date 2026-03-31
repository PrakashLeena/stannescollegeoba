'use client'

import { useEffect, useMemo, useState } from 'react'

type GalleryItem = {
  _id: string
  title: string
  imageUrl: string
  publicId?: string | null
  createdAt?: string
}

export function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const canSubmit = useMemo(() => title.trim().length > 0 && !!file && !saving, [title, file, saving])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/gallery', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to load')
      setItems(
        (json.items || []).map((x: any) => ({
          _id: String(x._id),
          title: x.title,
          imageUrl: x.imageUrl,
          publicId: x.publicId,
          createdAt: x.createdAt,
        }))
      )
    } catch (e: any) {
      setError(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function submit() {
    if (!file) return
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)

      const upRes = await fetch('/api/admin/gallery/upload', {
        method: 'POST',
        body: fd,
      })
      const upJson = await upRes.json()
      if (!upRes.ok || !upJson.ok) throw new Error(upJson.error || 'Upload failed')

      const createRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          imageUrl: upJson.url,
          publicId: upJson.publicId,
        }),
      })
      const createJson = await createRes.json()
      if (!createRes.ok || !createJson.ok) throw new Error(createJson.error || 'Save failed')

      setTitle('')
      setFile(null)
      await load()
    } catch (e: any) {
      setError(e?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this image?')) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Delete failed')
      await load()
    } catch (e: any) {
      setError(e?.message || 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 border border-white/10 p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none"
              placeholder="Image title"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-white/80"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            disabled={!canSubmit}
            className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-white hover:bg-yellow-500/30 disabled:opacity-60"
            onClick={submit}
          >
            {saving ? 'Saving...' : 'Upload & Save'}
          </button>
          {error && <div className="text-red-200 text-sm">{error}</div>}
        </div>
      </div>

      <div className="bg-white/10 border border-white/10">
        <div className="px-5 py-4 border-b border-white/10 text-white font-semibold">Saved Images</div>
        {loading ? (
          <div className="p-5 text-white/70">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-5 text-white/70">No images yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {items.map((it) => (
              <div key={it._id} className="bg-white/5 border border-white/10 p-3">
                <div className="aspect-video bg-black/20 border border-white/10 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 text-white text-sm font-semibold">{it.title}</div>
                <div className="mt-3 flex items-center justify-between">
                  <a className="text-yellow-300 text-xs hover:underline" href={it.imageUrl} target="_blank">
                    Open
                  </a>
                  <button
                    type="button"
                    disabled={saving}
                    className="text-xs px-2 py-1 bg-red-500/20 border border-red-500/30 text-white hover:bg-red-500/30 disabled:opacity-60"
                    onClick={() => remove(it._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
