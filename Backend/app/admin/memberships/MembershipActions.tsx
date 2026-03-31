'use client'

import { useState } from 'react'

export function MembershipActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  async function setStatus(status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/memberships/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Request failed')
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  async function remove() {
    if (!confirm('Delete this membership request?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/memberships/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Request failed')
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={loading}
        className="px-2 py-1 text-xs bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-60"
        onClick={() => setStatus('APPROVED')}
      >
        Approve
      </button>
      <button
        type="button"
        disabled={loading}
        className="px-2 py-1 text-xs bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-60"
        onClick={() => setStatus('REJECTED')}
      >
        Reject
      </button>
      <button
        type="button"
        disabled={loading}
        className="px-2 py-1 text-xs bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-60"
        onClick={() => setStatus('PENDING')}
      >
        Pending
      </button>
      <button
        type="button"
        disabled={loading}
        className="px-2 py-1 text-xs bg-red-500/20 border border-red-500/30 text-white hover:bg-red-500/30 disabled:opacity-60"
        onClick={remove}
      >
        Delete
      </button>
    </div>
  )
}
