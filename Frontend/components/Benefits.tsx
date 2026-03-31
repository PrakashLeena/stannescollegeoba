'use client'
import { useEffect, useRef } from 'react'
import { Users, Trophy, Heart, Briefcase, Calendar, Star } from 'lucide-react'

const benefits = [
  {
    icon: Users,
    title: 'Professional Network',
    desc: 'Connect with a diverse group of professionals across various fields worldwide, offering both personal and professional growth opportunities.',
  },
  {
    icon: Trophy,
    title: 'Alumni-Only Events',
    desc: 'Access to exclusive gatherings, including reunions, sporting teams, and social events that strengthen community ties.',
  },
  {
    icon: Heart,
    title: 'Community Service',
    desc: 'Give back by participating in mentoring, event organisation, and other volunteer roles that make a real difference.',
  },
  {
    icon: Briefcase,
    title: 'Career Development',
    desc: 'Leverage the alumni network for career guidance, job referrals, and mentorship from experienced professionals.',
  },
  {
    icon: Calendar,
    title: 'Regular Events',
    desc: 'Stay engaged with monthly meetups, annual galas, sports tournaments, and cultural celebrations throughout the year.',
  },
  {
    icon: Star,
    title: 'School Support',
    desc: 'Engage in initiatives that directly support educational resources, facilities, and capabilities of our alma mater.',
  },
]

export default function Benefits() {
  const sectionRef = useRef<HTMLDivElement>(null)
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
    <section id="benefits" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-yellow-600" />
            <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">
              Membership
            </span>
            <div className="w-8 h-[2px] bg-yellow-600" />
          </div>
          <h2 className="section-title">Member Benefits</h2>
          <p className="font-lato text-gray-500 mt-8 max-w-xl mx-auto text-base leading-relaxed">
            Joining St.Anne’s College Past Pupils’ Association provides a unique opportunity to reconnect with fellow
            alumni and contribute to the growth and success of our alma mater and community.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div
                key={idx}
                ref={(el) => { cardRefs.current[idx] = el }}
                className="anim-hidden card-hover bg-white p-8 border-b-4 border-transparent hover:border-yellow-500 shadow-sm group"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[#1a2456]/10 rounded-full flex items-center justify-center mb-5 group-hover:bg-[#1a2456] transition-colors duration-300">
                  <Icon
                    size={24}
                    className="text-[#1a2456] group-hover:text-yellow-400 transition-colors duration-300"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#1a2456] mb-3">{benefit.title}</h3>
                <p className="font-lato text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Membership CTA */}
        <div className="mt-16 bg-[#1a2456] text-white p-10 text-center">
          <h3 className="font-playfair text-3xl font-bold mb-3">Membership is Free</h3>
          <div className="gold-divider" />
          <p className="font-lato text-gray-300 mt-6 mb-8 max-w-lg mx-auto">
            Our focus is on enriching connections and providing value to our community — without any
            financial barrier. Join us today and be part of something meaningful.
          </p>
          <a href="#contact" className="btn-gold">
            Register Now — It&apos;s Free
          </a>
        </div>
      </div>
    </section>
  )
}
