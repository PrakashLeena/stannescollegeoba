'use client'

import { useEffect, useMemo, useState } from 'react'

type EventItem = {
  _id: string
  title: string
  slug: string
  section?: 'activities' | 'upcoming'
  location?: string | null
  startDate?: string | null
  endDate?: string | null
  imageUrl?: string | null
  isPublished?: boolean
}

async function uploadImage(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/admin/upload?folder=stannesppa/events', { method: 'POST', body: fd })
  const json = await res.json()
  if (!res.ok || !json.ok) throw new Error(json.error || 'Upload failed')
  return { url: json.url as string }
}

export function EventsClient() {
  const [items, setItems] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [section, setSection] = useState<'activities' | 'upcoming'>('activities')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const canSubmit = useMemo(() => title.trim() && slug.trim() && !saving, [title, slug, saving])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/events', { cache: 'no-store' })
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
    setSection('activities')
    setDescription('')
    setLocation('')
    setStartDate('')
    setEndDate('')
    setImageUrl('')
    setIsPublished(false)
    setImageFile(null)
  }

  async function startEdit(id: string) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${id}`, { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to load item')
      const it = json.item || {}
      setEditingId(id)
      setTitle(it.title || '')
      setSlug(it.slug || '')
      setSection(it.section === 'upcoming' ? 'upcoming' : 'activities')
      setDescription(it.description || '')
      setLocation(it.location || '')
      setStartDate(it.startDate ? new Date(it.startDate).toISOString().slice(0, 16) : '')
      setEndDate(it.endDate ? new Date(it.endDate).toISOString().slice(0, 16) : '')
      setImageUrl(it.imageUrl || '')
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
        section,
        description,
        location,
        startDate,
        endDate,
        imageUrl: finalImageUrl,
        isPublished,
      }

      const res = await fetch(editingId ? `/api/admin/events/${editingId}` : '/api/admin/events', {
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
    if (!confirm('Delete this event?')) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
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
          <div className="text-white font-semibold">{editingId ? 'Edit Event' : 'Add Event'}</div>
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
          <div>
            <label className="block text-white/80 text-sm mb-1">Section</label>
            <select
              value={section}
              onChange={(e) => setSection((e.target.value as any) || 'activities')}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none"
            >
              <option value="activities">Community Activities</option>
              <option value="upcoming">Upcoming Events</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-white/80 text-sm mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" rows={5} />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/80 text-sm mb-1">Start</label>
              <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">End</label>
              <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Image URL (optional)</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none" />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Or upload image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-white/80" />
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
        <div className="px-5 py-4 border-b border-white/10 text-white font-semibold">Events</div>
        {loading ? (
          <div className="p-5 text-white/70">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-5 text-white/70">No events yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/90">
              <thead className="text-left text-white/70">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it._id} className="border-t border-white/10">
                    <td className="px-4 py-3">{it.title}</td>
                    <td className="px-4 py-3">{it.slug}</td>
                    <td className="px-4 py-3">{it.section === 'upcoming' ? 'Upcoming' : 'Activities'}</td>
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
