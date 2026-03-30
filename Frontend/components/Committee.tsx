'use client'
import { useEffect, useRef } from 'react'
import { Linkedin } from 'lucide-react'

const committee = [
  {
    name: 'Pradeep Jayawardena',
    role: 'President',
    img: '',
    year: "Class of '98",
  },
  {
    name: 'Rohan de Silva',
    role: 'Vice President',
    img: '',
    year: "Class of '01",
  },
  {
    name: 'Nilantha Perera',
    role: 'Secretary',
    img: '',
    year: "Class of '03",
  },
  {
    name: 'Chatura Bandara',
    role: 'Treasurer',
    img: '',
    year: "Class of '00",
  },
]

export default function Committee() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('anim-visible')
        })
      },
      { threshold: 0.1 }
    )
    cardRefs.current.forEach((ref) => { if (ref) observer.observe(ref) })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="committee" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-yellow-600" />
            <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">Leadership</span>
            <div className="w-8 h-[2px] bg-yellow-600" />
          </div>
          <h2 className="section-title">Executive Committee</h2>
          <p className="font-lato text-gray-500 mt-8 max-w-xl mx-auto text-base leading-relaxed">
            Our dedicated committee members work tirelessly to serve the alumni community and uphold the
            values of our association.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {committee.map((member, idx) => (
            <div
              key={idx}
              ref={(el) => { cardRefs.current[idx] = el }}
              className="anim-hidden card-hover text-center group"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="relative mb-5 mx-auto w-36 h-36">
                {member.img ? (
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full border-4 border-gray-100 group-hover:border-yellow-400 transition-colors duration-300"
                  />
                ) : (
                  <div className="w-full h-full rounded-full border-4 border-gray-100 group-hover:border-yellow-400 transition-colors duration-300 bg-white/10" />
                )}
                <a
                  href="#"
                  className="absolute bottom-1 right-1 w-8 h-8 bg-[#1a2456] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-yellow-600"
                >
                  <Linkedin size={14} className="text-white" />
                </a>
              </div>
              <h3 className="font-playfair font-bold text-[#1a2456] text-lg mb-1">{member.name}</h3>
              <div className="text-yellow-600 font-lato text-sm font-bold uppercase tracking-widest mb-1">{member.role}</div>
              <div className="text-gray-400 font-lato text-xs">{member.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
