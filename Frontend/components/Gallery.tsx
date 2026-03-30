'use client'
import { useState, useEffect, useRef } from 'react'
import { X, ZoomIn } from 'lucide-react'

const photos = [
  { src: '', label: 'Gala Dinner 2024' },
  { src: '', label: 'Reunion 2024' },
  { src: '', label: 'Touch Footy Tournament' },
  { src: '', label: 'Tennis Evening' },
  { src: '', label: 'AGM 2024' },
  { src: '', label: 'Community Event' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.anim-hidden').forEach((el, i) => {
              setTimeout(() => el.classList.add('anim-visible'), i * 80)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight' && lightbox !== null) setLightbox((lightbox + 1) % photos.length)
      if (e.key === 'ArrowLeft' && lightbox !== null) setLightbox((lightbox - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <section id="gallery" className="py-20 bg-[#0a0f28]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-yellow-600" />
            <span className="text-yellow-500 font-lato text-sm tracking-widest uppercase font-bold">Memories</span>
            <div className="w-8 h-[2px] bg-yellow-600" />
          </div>
          <h2 className="font-playfair text-4xl font-bold text-white relative inline-block">
            Photo Gallery
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-[3px] bg-yellow-500 block" />
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="anim-hidden relative group overflow-hidden cursor-pointer aspect-[4/3]"
              onClick={() => setLightbox(idx)}
            >
              {photo.src ? (
                <img
                  src={photo.src}
                  alt={photo.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
              <div className="absolute inset-0 bg-[#1a2456]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center flex-col gap-2">
                <ZoomIn size={28} className="text-white" />
                <span className="font-lato text-white text-sm font-bold uppercase tracking-widest">
                  {photo.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#gallery" className="btn-gold">View Full Gallery</a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-yellow-400 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={32} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-yellow-400 font-thin transition-colors px-4 py-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length) }}
          >‹</button>
          {photos[lightbox].src ? (
            <img
              src={photos[lightbox].src}
              alt={photos[lightbox].label}
              className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className="h-[65vh] w-[90vw] max-w-4xl bg-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-yellow-400 font-thin transition-colors px-4 py-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length) }}
          >›</button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-lato text-sm tracking-widest uppercase">
            {photos[lightbox].label} &nbsp;—&nbsp; {lightbox + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  )
}
