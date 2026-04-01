'use client'
import { useEffect, useRef, useState } from 'react'
import { Clock, Tag } from 'lucide-react'
import Link from 'next/link'
import { getApiBaseUrl } from '@/lib/apiBase'

type ApiNewsItem = {
  _id: string
  slug: string
  title: string
  excerpt?: string | null
  imageUrl?: string | null
  publishedAt?: string | null
}

export default function News() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [items, setItems] = useState<ApiNewsItem[]>([])

  function reveal() {
    const root = sectionRef.current
    if (!root) return
    root.querySelectorAll('.anim-hidden').forEach((el, i) => {
      setTimeout(() => el.classList.add('anim-visible'), i * 120)
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal()
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (items.length === 0) return
    reveal()
  }, [items.length])

  useEffect(() => {
    const base = getApiBaseUrl()
    if (!base) return

    fetch(`${base}/api/public/news`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok && Array.isArray(j.items)) {
          setItems(j.items)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="news" className="py-20 bg-transparent" ref={sectionRef as any}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-yellow-600" />
            <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">
              News & Updates
            </span>
            <div className="w-8 h-[2px] bg-yellow-600" />
          </div>
          <h2 className="section-title">Latest News</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div
              key={item._id || item.slug || idx}
              className="anim-hidden card-hover bg-white shadow-md group overflow-hidden"
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1 bg-[#1a2456] text-white text-xs font-lato font-bold uppercase tracking-widest px-3 py-1">
                    <Tag size={10} />
                    News
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-lato mb-3">
                  <Clock size={12} />
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
                </div>
                <h3 className="font-playfair text-lg font-bold text-[#1a2456] mb-3 leading-snug group-hover:text-yellow-700 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="font-lato text-gray-500 text-sm leading-relaxed mb-5">
                  {item.excerpt || ''}
                </p>
                <Link
                  href={`/news/${item.slug}`}
                  className="font-lato text-yellow-700 font-bold text-xs uppercase tracking-widest border-b-2 border-yellow-500 hover:text-[#1a2456] hover:border-[#1a2456] transition-colors duration-200"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#news"
            className="btn-gold"
            style={{ background: '#1a2456', borderColor: '#1a2456' }}
          >
            View All News
          </a>
        </div>
      </div>
    </section>
  )
}
