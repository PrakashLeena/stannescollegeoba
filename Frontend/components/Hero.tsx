'use client'
import { useState, useEffect } from 'react'

const slides = [
  {
    image: '/src/images/home%20page%20image%20slider/WhatsApp%20Image%202026-03-30%20at%2012.44.56.jpeg',
    title: 'WELCOME TO ST.ANNE\'S PAST PUPILS\' ASSOCIATION',
    subtitle: 'Reconnect. Reminisce. Forge New Bonds.',
    desc: 'A vibrant community of alumni united by shared memories, common values, and a commitment to giving back.',
  },
  {
    image: '/src/images/home%20page%20image%20slider/WhatsApp%20Image%202026-03-30%20at%2012.44.56%20(1).jpeg',
    title: 'Together We Make a Difference',
    subtitle: 'Community. Charity. Camaraderie.',
    desc: 'From sporting events to scholarship programs — your membership powers meaningful change.',
  },
  {
    image: '/src/images/home%20page%20image%20slider/WhatsApp%20Image%202026-03-30%20at%2012.44.56%20(2).jpeg',
    title: 'A Legacy Spanning Generations',
    subtitle: 'Honoring the Past. Building the Future.',
    desc: 'Join over 500 proud alumni across NSW & ACT in celebrating our shared heritage and alma mater.',
  },
  {
    image: '/src/images/home%20page%20image%20slider/WhatsApp%20Image%202026-03-30%20at%2012.44.57.jpeg',
    title: 'Welcome to St.Anne’s College Past Pupils’ Association',
    subtitle: 'Reconnect. Reminisce. Forge New Bonds.',
    desc: 'A vibrant community of alumni united by shared memories, common values, and a commitment to giving back.',
  },
  {
    image: '/src/images/home%20page%20image%20slider/WhatsApp%20Image%202026-03-30%20at%2012.44.57%20(1).jpeg',
    title: 'Together We Make a Difference',
    subtitle: 'Community. Charity. Camaraderie.',
    desc: 'From sporting events to scholarship programs — your membership powers meaningful change.',
  },
  {
    image: '/src/images/home%20page%20image%20slider/WhatsApp%20Image%202026-03-30%20at%2012.44.58.jpeg',
    title: 'A Legacy Spanning Generations',
    subtitle: 'Honoring the Past. Building the Future.',
    desc: 'Join over 500 proud alumni across NSW & ACT in celebrating our shared heritage and alma mater.',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
        setAnimating(false)
      }, 600)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (idx: number) => {
    if (idx === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 400)
  }

  return (
    <section id="home" className="relative h-[100svh] md:h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background image with zoom */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url(${slide.image})`,
              animation: idx === current ? 'heroZoom 8s ease-in-out infinite alternate' : 'none',
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2456]/90 via-[#1a2456]/70 to-[#1a2456]/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full pt-20">
          <div
            className={`max-w-2xl transition-all duration-700 ${
              animating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-yellow-500" />
              <span className="text-yellow-400 font-lato text-sm tracking-widest uppercase font-bold">
                Est. 1997
              </span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {slides[current].title}
            </h1>
            <h2 className="font-playfair text-xl md:text-2xl text-yellow-400 italic mb-6">
              {slides[current].subtitle}
            </h2>
            <p className="font-lato text-gray-200 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              {slides[current].desc}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#become-member" className="btn-gold">
                Join Our Community
              </a>
              <a href="#about" className="btn-navy">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? 'w-10 h-3 bg-yellow-500'
                : 'w-3 h-3 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-10 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="text-white/60 text-xs font-lato tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
          Scroll Down
        </span>
        <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 w-full bg-yellow-500 animate-bounce" style={{ height: '40%' }} />
        </div>
      </div>
    </section>
  )
}
