'use client'
import { useEffect, useRef } from 'react'
import { Calendar, MapPin, Clock } from 'lucide-react'

const sports = [
  {
    img: '',
    sport: 'Rugby',
    title: 'Touch Footy Tournament',
    desc: 'RCOBA fields two rugby teams — Open and Over 40s — in the annual Sri Lanka Schools touch footy tournament.',
  },
  {
    img: '',
    sport: 'Tennis',
    title: 'Tennis Social Evenings',
    desc: 'Our tennis community is growing fast. Join us for weekly social evenings every Friday from 6PM.',
  },
  {
    img: '',
    sport: 'Gala',
    title: 'Annual Gala Dinner',
    desc: 'A highlight of the year — an elegant evening celebrating our alumni community with cultural performances and fine dining.',
  },
]

const upcomingEvents = [
  {
    date: '15',
    month: 'NOV',
    title: 'Annual Gala Dinner 2025',
    location: 'Doltone House, Sydney',
    time: '7:00 PM — 11:00 PM',
  },
  {
    date: '08',
    month: 'DEC',
    title: 'Touch Footy Tournament',
    location: 'Parramatta Park, NSW',
    time: '9:00 AM — 5:00 PM',
  },
  {
    date: '20',
    month: 'DEC',
    title: 'Christmas Social Evening',
    location: 'Colombo Social Club, Sydney',
    time: '6:30 PM — 10:00 PM',
  },
]

export default function Events() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.anim-hidden').forEach((el, i) => {
              setTimeout(() => el.classList.add('anim-visible'), i * 120)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="events" className="py-20 bg-transparent" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-yellow-600" />
            <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">
              Sports & Events
            </span>
            <div className="w-8 h-[2px] bg-yellow-600" />
          </div>
          <h2 className="section-title">Community Activities</h2>
        </div>

        {/* Sports Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {sports.map((item, idx) => (
            <div key={idx} className="anim-hidden card-hover group overflow-hidden shadow-md bg-white">
              <div className="relative h-52 overflow-hidden">
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.sport}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2456]/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-yellow-600 text-white text-xs font-lato font-bold uppercase tracking-widest px-3 py-1">
                    {item.sport}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-playfair text-xl font-bold text-[#1a2456] mb-2">{item.title}</h3>
                <p className="font-lato text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="bg-[#1a2456] p-10">
          <h3 className="font-playfair text-3xl font-bold text-white text-center mb-10">
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className="anim-hidden bg-white/5 hover:bg-white/10 transition-colors duration-300 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
              >
                {/* Date badge */}
                <div className="bg-yellow-600 text-white text-center px-5 py-3 shrink-0 min-w-[70px]">
                  <div className="font-playfair text-3xl font-bold">{event.date}</div>
                  <div className="font-lato text-xs font-bold tracking-widest uppercase">{event.month}</div>
                </div>
                {/* Info */}
                <div className="flex-1">
                  <h4 className="font-playfair text-lg font-bold text-white mb-2">{event.title}</h4>
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1 text-gray-300 text-sm font-lato">
                      <MapPin size={13} className="text-yellow-400" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1 text-gray-300 text-sm font-lato">
                      <Clock size={13} className="text-yellow-400" />
                      {event.time}
                    </span>
                  </div>
                </div>
                <a
                  href="#events"
                  className="shrink-0 text-yellow-400 border border-yellow-400 font-lato text-xs font-bold uppercase tracking-widest px-5 py-2 hover:bg-yellow-400 hover:text-[#1a2456] transition-colors duration-200"
                >
                  Details
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="#events" className="btn-gold">
              View All Events
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
