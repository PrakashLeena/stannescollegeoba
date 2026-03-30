'use client'

const newsItems = [
  '🏆 RCOBA Annual Gala Dinner — Save the Date: 15th November 2025',
  '🎓 Scholarship Applications Open — Apply Before 30th September',
  '🏉 Touch Footy Tournament — Registration Open Now',
  '🎾 Tennis Social Evening — Every Friday from 6PM',
  '❤️ LRH Medical Project — Goal Exceeded: AUD 8,000+ Raised',
  '📢 New Member Orientation — 1st Saturday of Every Month',
]

export default function NewsTicker() {
  const items = [...newsItems, ...newsItems]

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
