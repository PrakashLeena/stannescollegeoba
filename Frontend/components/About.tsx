'use client'
import { useEffect, useRef } from 'react'

export default function About() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('anim-visible')
          }
        })
      },
      { threshold: 0.2 }
    )
    if (leftRef.current) observer.observe(leftRef.current)
    if (rightRef.current) observer.observe(rightRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div ref={leftRef} className="anim-hidden relative">
            <div className="relative">
              <img
                src="/src/images/home%20page%20image%20slider/WhatsApp%20Image%202026-03-30%20at%2012.44.58.jpeg"
                alt="Alumni gathering"
                className="w-full h-[450px] object-cover shadow-2xl"
              />
              {/* Decorative frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-yellow-500 -z-10" />
            </div>
          </div>

          {/* Text side */}
          <div ref={rightRef} className="anim-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-yellow-600" />
              <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">
                Who We Are
              </span>
            </div>
            <h2 className="font-playfair text-4xl font-bold text-white-600 mb-2 leading-tight">
              A Legacy of Excellence,
            </h2>
            <h2 className="font-playfair text-4xl font-bold text-white-600 mb-6 leading-tight">
              Community & Service
            </h2>
            <div className="gold-divider" style={{ margin: '0 0 24px 0' }} />
            <p className="font-lato text-gray-700 text-base leading-relaxed mb-5">
              St.Anne’s College Past Pupils’ Association is a respected alumni community bringing together graduates from
              our alma mater. With a history spanning nearly three decades, we embody a spirit of
              camaraderie and service among our members.
            </p>
            <p className="font-lato text-gray-700 text-base leading-relaxed mb-8">
              Through a diverse range of events and charitable initiatives, we preserve the esteemed legacy
              of our school while nurturing enduring connections among alumni worldwide. Our association
              serves as a platform to commemorate the profound impact of education on individuals and
              society at large.
            </p>

            {/* Key facts */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { num: '500+', label: 'Members' },
                { num: '1997', label: 'Founded' },
                { num: '20+', label: 'Events/Year' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-gray-50 bg-opacity-50 border-t-4 border-yellow-500">
                  <div className="font-playfair text-3xl font-bold text-[#1a2456]">{stat.num}</div>
                  <div className="font-lato text-xs text-gray-600 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <a href="#become-member" className="btn-gold">
              Join Our Community
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
