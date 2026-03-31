'use client'

import { useEffect, useMemo, useState } from 'react'

type TickerItem = {
  _id: string
  text: string
  isActive?: boolean
  order?: number
  createdAt?: string | null
}

export function NewsTickerClient() {
  const [items, setItems] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)

  const [text, setText] = useState('')
  const [isActive, setIsActive] = useState(true)

  const canSubmit = useMemo(() => text.trim().length > 0 && !saving, [text, saving])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/news-ticker', { cache: 'no-store' })
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
    setText('')
    setIsActive(true)
  }

  async function startEdit(id: string) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/news-ticker/${id}`, { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Failed to load item')
      const it = json.item || {}
      setEditingId(id)
      setText(it.text || '')
      setIsActive(it.isActive ?? true)
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
      const payload = { text: text.trim(), isActive }
      const res = await fetch(editingId ? `/api/admin/news-ticker/${editingId}` : '/api/admin/news-ticker', {
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
    if (!confirm('Delete this ticker item?')) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/news-ticker/${id}`, { method: 'DELETE' })
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

  async function toggleActive(it: TickerItem) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/news-ticker/${it._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: it.text, isActive: !it.isActive, order: it.order ?? 0 }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Update failed')
      await load()
    } catch (e: any) {
      setError(e?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  async function move(it: TickerItem, dir: 'up' | 'down') {
    const idx = items.findIndex((x) => x._id === it._id)
    if (idx < 0) return
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= items.length) return

    const other = items[swapIdx]
    const aOrder = it.order ?? idx + 1
    const bOrder = other.order ?? swapIdx + 1

    setSaving(true)
    setError(null)
    try {
      const resA = await fetch(`/api/admin/news-ticker/${it._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: it.text, isActive: it.isActive ?? true, order: bOrder }),
      })
      const jsonA = await resA.json()
      if (!resA.ok || !jsonA.ok) throw new Error(jsonA.error || 'Reorder failed')

      const resB = await fetch(`/api/admin/news-ticker/${other._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: other.text, isActive: other.isActive ?? true, order: aOrder }),
      })
      const jsonB = await resB.json()
      if (!resB.ok || !jsonB.ok) throw new Error(jsonB.error || 'Reorder failed')

      await load()
    } catch (e: any) {
      setError(e?.message || 'Reorder failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 border border-white/10 p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="text-white font-semibold">{editingId ? 'Edit Ticker Item' : 'Add Ticker Item'}</div>
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

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-white/80 text-sm mb-1">Text</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 text-white outline-none"
              placeholder="Ticker message"
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-white/80 text-sm">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active
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
        <div className="px-5 py-4 border-b border-white/10 text-white font-semibold">Ticker Items</div>
        {loading ? (
          <div className="p-5 text-white/70">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-5 text-white/70">No ticker items yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/90">
              <thead className="text-left text-white/70">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Text</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it._id} className="border-t border-white/10">
                    <td className="px-4 py-3">{it.order ?? idx + 1}</td>
                    <td className="px-4 py-3">{it.text}</td>
                    <td className="px-4 py-3">{it.isActive ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={saving || idx === 0}
                          className="text-xs px-2 py-1 bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-60"
                          onClick={() => move(it, 'up')}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          disabled={saving || idx === items.length - 1}
                          className="text-xs px-2 py-1 bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-60"
                          onClick={() => move(it, 'down')}
                        >
                          Down
                        </button>
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
                          className="text-xs px-2 py-1 bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-60"
                          onClick={() => toggleActive(it)}
                        >
                          {it.isActive ? 'Disable' : 'Enable'}
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
