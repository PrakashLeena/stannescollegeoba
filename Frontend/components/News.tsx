'use client'
import { useEffect, useRef } from 'react'
import { Clock, Tag } from 'lucide-react'
import Link from 'next/link'
import { latestNews } from '@/lib/content'

export default function News() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('anim-visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="news" className="py-20 bg-transparent">
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
          {latestNews.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => { cardRefs.current[idx] = el }}
              className="anim-hidden card-hover bg-white shadow-md group overflow-hidden"
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1 bg-[#1a2456] text-white text-xs font-lato font-bold uppercase tracking-widest px-3 py-1">
                    <Tag size={10} />
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-lato mb-3">
                  <Clock size={12} />
                  {item.date}
                </div>
                <h3 className="font-playfair text-lg font-bold text-[#1a2456] mb-3 leading-snug group-hover:text-yellow-700 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="font-lato text-gray-500 text-sm leading-relaxed mb-5">
                  {item.excerpt}
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
