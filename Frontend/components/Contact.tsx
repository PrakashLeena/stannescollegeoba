'use client'
import { useState } from 'react'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
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
      const url = apiBase ? `${apiBase.replace(/\/$/, '')}/api/contact` : '/api/contact'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Request failed')

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      setError('Sorry, something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 ">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-yellow-600" />
            <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">Get In Touch</span>
            <div className="w-8 h-[2px] bg-yellow-600" />
          </div>
          <h2 className="section-title">Contact Us</h2>
          <p className="font-lato text-gray-500 mt-8 max-w-xl mx-auto text-base leading-relaxed">
            Have questions or want to get involved? Reach out to us — we'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 ">
          {/* Info Column */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email Us', value: 'info@pastpeople.org', sub: 'We reply within 24 hours' },
              { icon: Phone, label: 'Call Us', value: '+94 2 XXXX XXXX', sub: 'Mon–Fri, 9AM–5PM AEST' },
              { icon: MapPin, label: 'Location', value: 'Vankalai, Mannar', sub: 'Serving NSW & ACT' },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex items-start gap-4 p-5 bg-white bg-opacity-30 text-white shadow-sm border-l-4 border-yellow-500">
                <div className="w-10 h-10 bg-[#1a2456] rounded-full flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-yellow-400" />
                </div>
                <div>
                  <div className="font-lato text-xs uppercase tracking-widest text-white mb-1">{label}</div>
                  <div className="font-playfair font-bold text-[#1a2456] text-base">{value}</div>
                  <div className="font-lato text-white text-xs mt-1">{sub}</div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="p-5 bg-[#1a2456] text-white">
              <div className="font-playfair font-bold text-lg mb-4">Follow Us</div>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Linkedin, label: 'LinkedIn' },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-10 h-10 border border-white/30 flex items-center justify-center hover:bg-yellow-600 hover:border-yellow-600 transition-colors duration-200"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white bg-opacity-30 text-white shadow-md p-8">
            <h3 className="font-playfair text-2xl font-bold text-[#1a2456] mb-6">Send Us a Message</h3>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 font-lato text-sm">
                ✅ Thank you! Your message has been sent successfully. We'll be in touch soon.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-lato text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-lato text-xs uppercase tracking-widest text-white mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border bg-gray-400 bg-opacity-30 border-gray-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors duration-200"
                    placeholder="Diron Temcious"
                  />
                </div>
                <div>
                  <label className="block font-lato text-xs uppercase tracking-widest white mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border bg-gray-400 bg-opacity-30 border-gray-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors duration-200"
                    placeholder="temci@email.com"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-lato text-xs uppercase tracking-widest text-white mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border bg-gray-400 bg-opacity-30 border-gray-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors duration-200"
                    placeholder="+94 XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block font-lato text-xs uppercase tracking-widest text-white mb-2">Subject *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border bg-gray-400 bg-opacity-50 border-gray-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors duration-200  text-white"
                  >
                    <option value="">Select subject</option>
                    <option>Membership Enquiry</option>
                    <option>Events</option>
                    <option>Projects & Donations</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-lato text-xs uppercase tracking-widest text-white mb-2">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border bg-gray-400 bg-opacity-30 border-gray-200 px-4 py-3 font-lato text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors duration-200 resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button type="submit" className="btn-gold w-full text-center" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
