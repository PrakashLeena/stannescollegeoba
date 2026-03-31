'use client'

import { useEffect, useMemo, useState } from 'react'

type NewsItem = {
  _id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  imageUrl?: string | null
  isPublished?: boolean
  publishedAt?: string | null
  createdAt?: string | null
}

async function uploadImage(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/admin/upload?folder=stannesppa/news', { method: 'POST', body: fd })
  const json = await res.json()
  if (!res.ok || !json.ok) throw new Error(json.error || 'Upload failed')
  return { url: json.url as string, publicId: json.publicId as string }
}

export function NewsClient() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const canSubmit = useMemo(() => title.trim() && slug.trim() && !saving, [title, slug, saving])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/news', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to load')
      setItems((json.items || []).map((x: any) => ({ ...x, _id: String(x._id) })))
    } catch (e: any) {
      setError(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function resetForm() {
    setEditingId(null)
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setImageUrl('')
    setPublishedAt('')
    setIsPublished(false)
    setImageFile(null)
  }

  async function startEdit(id: string) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/news/${id}`, { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to load item')
      const it = json.item || {}
      setEditingId(id)
      setTitle(it.title || '')
      setSlug(it.slug || '')
      setExcerpt(it.excerpt || '')
      setContent(it.content || '')
      setImageUrl(it.imageUrl || '')
      setPublishedAt(it.publishedAt ? new Date(it.publishedAt).toISOString().slice(0, 16) : '')
      setIsPublished(!!it.isPublished)
      setImageFile(null)
    } catch (e: any) {
      setError(e?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      let finalImageUrl = imageUrl.trim()
      if (imageFile) {
        const uploaded = await uploadImage(imageFile)
        finalImageUrl = uploaded.url
      }

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt,
        content,
        imageUrl: finalImageUrl,
        publishedAt,
        isPublished,
      }

      const res = await fetch(editingId ? `/api/admin/news/${editingId}` : '/api/admin/news', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Save failed')

      resetForm()
      await load()
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this news item?')) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Delete failed')
      if (editingId === id) resetForm()
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
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="text-white font-semibold">{editingId ? 'Edit News' : 'Add News'}</div>
          {editingId && (
            <button
              type="button"
              disabled={saving}
              className="text-xs px-2 py-1 bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-60"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-white/80 text-sm mb-1">Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" rows={2} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-white/80 text-sm mb-1">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" rows={6} />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Image URL (optional)</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Or upload image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-white/80" />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Published At (optional)</label>
            <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" />
          </div>
          <div className="flex items-end gap-2">
            <label className="inline-flex items-center gap-2 text-white/80 text-sm">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              Published
            </label>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            disabled={!canSubmit}
            className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-white hover:bg-yellow-500/30 disabled:opacity-60"
            onClick={save}
          >
            {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </button>
          {error && <div className="text-red-200 text-sm">{error}</div>}
        </div>
      </div>

      <div className="bg-white/10 border border-white/10">
        <div className="px-5 py-4 border-b border-white/10 text-white font-semibold">News Items</div>
        {loading ? (
          <div className="p-5 text-white/70">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-5 text-white/70">No news items yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/90">
              <thead className="text-left text-white/70">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it._id} className="border-t border-white/10">
                    <td className="px-4 py-3">{it.title}</td>
                    <td className="px-4 py-3">{it.slug}</td>
                    <td className="px-4 py-3">{it.isPublished ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={saving}
                          className="text-xs px-2 py-1 bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-60"
                          onClick={() => startEdit(it._id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          className="text-xs px-2 py-1 bg-red-500/20 border border-red-500/30 text-white hover:bg-red-500/30 disabled:opacity-60"
                          onClick={() => remove(it._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
