'use client'

import { useState } from 'react'

export default function BecomeMember() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    yearLeft: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
      const url = apiBase ? `${apiBase.replace(/\/$/, '')}/api/membership` : '/api/membership'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Request failed')

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
      setFormData({ fullName: '', email: '', phone: '', yearLeft: '', message: '' })
    } catch {
      setError('Sorry, something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="become-member" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-yellow-600" />
            <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">
              Get Involved
            </span>
            <div className="w-8 h-[2px] bg-yellow-600" />
          </div>
          <h2 className="section-title">Become a Member</h2>
          <p className="font-lato text-gray-700 mt-8 max-w-2xl mx-auto text-base leading-relaxed">
            Join St.Anne’s College Past Pupils’ Association to reconnect with old friends, grow your network, and support
            community projects and events.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white/70 bg-transparent-50 shadow-sm p-8 border-l-4 border-yellow-500">
            <div className="font-playfair text-xl font-bold text-[#1a2456] mb-3">Why Join?</div>
            <ul className="space-y-2">
              {[
                'Alumni network & community',
                'Exclusive events and sports',
                'Volunteer opportunities',
                'Support scholarships & projects',
              ].map((t) => (
                <li key={t} className="font-lato text-sm text-gray-700">{t}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white/70 bg-transparent-50 shadow-sm p-8 border-l-4 border-yellow-500">
            <div className="font-playfair text-xl font-bold text-[#1a2456] mb-3">How to Become a Member</div>
            <ol className="space-y-2 list-decimal pl-4">
              {[
                'Fill the membership request',
                'Verify your alumni details',
                'Get confirmation from the committee',
              ].map((t) => (
                <li key={t} className="font-lato text-sm text-gray-700">{t}</li>
              ))}
            </ol>
          </div>

          <div className="bg-[#1a2456] bg-transparent-50 text-white shadow-sm p-8">
            <div className="font-playfair text-xl font-bold mb-3">Membership Request</div>
            <p className="font-lato text-sm text-white/80 leading-relaxed mb-6">
              Submit your details and we’ll get back to you.
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 font-lato text-sm">
                ✅ Thank you! Your membership request has been submitted.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-lato text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-lato text-xs uppercase tracking-widest text-white/70 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 px-3 py-2 text-white text-sm font-lato outline-none"
                />
              </div>

              <div>
                <label className="block font-lato text-xs uppercase tracking-widest text-white/70 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 px-3 py-2 text-white text-sm font-lato outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-lato text-xs uppercase tracking-widest text-white/70 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 px-3 py-2 text-white text-sm font-lato outline-none"
                  />
                </div>
                <div>
                  <label className="block font-lato text-xs uppercase tracking-widest text-white/70 mb-2">Year Left</label>
                  <input
                    type="text"
                    value={formData.yearLeft}
                    onChange={(e) => setFormData({ ...formData, yearLeft: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 px-3 py-2 text-white text-sm font-lato outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-lato text-xs uppercase tracking-widest text-white/70 mb-2">Message</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 px-3 py-2 text-white text-sm font-lato outline-none resize-none"
                />
              </div>

              <button type="submit" className="btn-gold w-full text-center" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
