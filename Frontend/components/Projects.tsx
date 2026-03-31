'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getApiBaseUrl } from '@/lib/apiBase'

type ApiProject = {
  _id: string
  slug: string
  title: string
  summary?: string | null
  imageUrl?: string | null
}

export default function Projects() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [projects, setProjects] = useState<ApiProject[]>([])

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

  useEffect(() => {
    const base = getApiBaseUrl()
    if (!base) return

    fetch(`${base}/api/public/projects`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok && Array.isArray(j.items)) {
          setProjects(j.items)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="projects" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-yellow-600" />
            <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">
              Our Impact
            </span>
            <div className="w-8 h-[2px] bg-yellow-600" />
          </div>
          <h2 className="section-title">Community Projects</h2>
          <p className="font-lato text-gray-500 mt-8 max-w-xl mx-auto text-base leading-relaxed">
            We are passionately dedicated to enriching lives through impactful initiatives across
            education, healthcare, and community development.
          </p>
        </div>

        {/* Project cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div
              key={project._id || project.slug || idx}
              ref={(el) => { cardRefs.current[idx] = el }}
              className="anim-hidden card-hover bg-white shadow-md overflow-hidden group"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="img-overlay h-52 overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-yellow-600 text-white text-xs font-lato font-bold tracking-widest uppercase px-3 py-1">
                    Project
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-xl font-bold text-[#1a2456] mb-3 leading-snug">
                  {project.title}
                </h3>
                <p className="font-lato text-gray-500 text-sm leading-relaxed mb-5">{project.summary || ''}</p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="font-lato text-yellow-700 font-bold text-sm uppercase tracking-widest border-b-2 border-yellow-500 hover:text-[#1a2456] hover:border-[#1a2456] transition-colors duration-200"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#projects" className="btn-gold" style={{ background: '#1a2456', borderColor: '#1a2456' }}>
            View All Projects
          </a>
        </div>
      </div>
    </section>
  )
}
