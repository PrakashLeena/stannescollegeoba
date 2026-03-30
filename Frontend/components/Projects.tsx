'use client'
import { useEffect, useRef } from 'react'

const projects = [
  {
    img: '',
    category: 'Education',
    title: 'Annual Scholarship Programme',
    desc: 'For over 30 years, we have provided scholarships to students, offering monthly allowances to cover educational expenses. We recently expanded to include additional recipients.',
    tag: 'Ongoing',
  },
  {
    img: '',
    category: 'Healthcare',
    title: 'LRH Medical Support Project',
    desc: 'In response to the 2022 healthcare crisis, our members raised over AUD 8,000 to provide critical medical consumables to Lady Ridgeway Hospital, the largest free paediatric hospital in Sri Lanka.',
    tag: 'Completed',
  },
  {
    img: '',
    category: 'Arts & Culture',
    title: 'English Drama Society Support',
    desc: 'We supported the English Drama Society to launch a comprehensive Drama Calendar, including weekly workshops for students from Grade 6 to College Prefects.',
    tag: 'Ongoing',
  },
]

export default function Projects() {
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
              key={idx}
              ref={(el) => { cardRefs.current[idx] = el }}
              className="anim-hidden card-hover bg-white shadow-md overflow-hidden group"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="img-overlay h-52 overflow-hidden">
                {project.img ? (
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-yellow-600 text-white text-xs font-lato font-bold tracking-widest uppercase px-3 py-1">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <span className={`text-xs font-lato font-bold tracking-widest uppercase px-3 py-1 ${
                    project.tag === 'Ongoing'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-600 text-white'
                  }`}>
                    {project.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-xl font-bold text-[#1a2456] mb-3 leading-snug">
                  {project.title}
                </h3>
                <p className="font-lato text-gray-500 text-sm leading-relaxed mb-5">{project.desc}</p>
                <a
                  href="#projects"
                  className="font-lato text-yellow-700 font-bold text-sm uppercase tracking-widest border-b-2 border-yellow-500 hover:text-[#1a2456] hover:border-[#1a2456] transition-colors duration-200"
                >
                  Read More →
                </a>
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
