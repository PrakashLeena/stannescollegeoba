'use client'

import { useEffect, useMemo, useState } from 'react'
import { getApiBaseUrl } from '@/lib/apiBase'

const newsItems = [
  '🏆 SACPPA Annual Dinner — Save the Date: 15th November 2026',
  '🎓 GCE A/L Applications(2026) Open — Apply Before 30th September',
  '📚 GCE A/L Results Relesed',
  '👟 Athletic Practise — Everyday from 6AM',
  '📢 SACPPA Meeting April 1st',
]

type ApiTickerItem = {
  _id: string
  text: string
}

export default function NewsTicker() {
  const [liveItems, setLiveItems] = useState<string[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const base = getApiBaseUrl()
      if (!base) return

      try {
        const res = await fetch(`${base}/api/public/news-ticker`, { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || !json.ok) return
        const texts = (json.items || []).map((x: ApiTickerItem) => x.text).filter(Boolean)
        if (!cancelled) setLiveItems(texts.length ? texts : [])
      } catch {
        // ignore
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const baseList = useMemo(() => {
    if (liveItems && liveItems.length > 0) return liveItems
    return newsItems
  }, [liveItems])

  const items = [...baseList, ...baseList]

  return (
    <div className="bg-yellow-600 py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="bg-[#1a2456] text-white text-xs font-lato font-bold tracking-widest uppercase px-5 py-1 mr-4 shrink-0 z-10">
          LATEST
        </div>
        <div className="ticker-wrap flex-1">
          <div className="ticker-content animate-ticker">
            {items.map((item, idx) => (
              <span
                key={idx}
                className="inline-block text-white text-sm font-lato font-medium mr-12"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
