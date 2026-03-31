'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getApiBaseUrl } from '@/lib/apiBase'

const stats = [
  { value: 500, suffix: '+', label: 'Active Members', desc: 'Alumni across NSW & ACT' },
  { value: 28, suffix: '+', label: 'Years Active', desc: 'Since 1997' },
  { value: 8000, suffix: '+', label: 'AUD Raised', desc: 'For charitable causes' },
  { value: 30, suffix: '+', label: 'Events Per Year', desc: 'Social, sports & cultural' },
]

function useCountUp(target: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, started])
  return count
}

function StatItem({ stat, started }: { stat: typeof stats[0]; started: boolean }) {
  const count = useCountUp(stat.value, 2000, started)
  return (
    <div className="text-center group">
      <div className="stat-number">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="font-playfair text-xl font-bold text-white mt-2 mb-1">{stat.label}</div>
      <div className="font-lato text-gray-300 text-sm">{stat.desc}</div>
    </div>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [memberCount, setMemberCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const base = getApiBaseUrl()
      if (!base) return
      try {
        const res = await fetch(`${base}/api/public/members/count`, { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || !json.ok || typeof json.count !== 'number') return
        if (!cancelled) setMemberCount(json.count)
      } catch {
        // ignore
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const resolvedStats = useMemo(() => {
    if (memberCount === null) return stats
    return [{ ...stats[0], value: memberCount }, ...stats.slice(1)]
  }, [memberCount])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true)
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1a2456]/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-yellow-500" />
            <span className="text-yellow-400 font-lato text-sm tracking-widest uppercase font-bold">
              Our Impact
            </span>
            <div className="w-8 h-[2px] bg-yellow-500" />
          </div>
          <h2 className="font-playfair text-4xl font-bold text-white">
            Association at a Glance
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {resolvedStats.map((stat, idx) => (
            <StatItem key={idx} stat={stat} started={started} />
          ))}
        </div>
      </div>
    </section>
  )
}
