import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { getEventBySlug } from '@/lib/content'

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = getEventBySlug(params.slug)
  if (!event) return notFound()

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-transparent">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <Link
              href="/#events"
              className="font-lato text-yellow-700 font-bold text-xs uppercase tracking-widest border-b-2 border-yellow-500 hover:text-[#1a2456] hover:border-[#1a2456] transition-colors duration-200"
            >
              Back to Activities
            </Link>
          </div>

          <div className="bg-white/70 shadow-sm p-8 border-l-4 border-yellow-500">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-[#1a2456] text-white text-xs font-lato font-bold tracking-widest uppercase px-3 py-1">
                {event.kind === 'Sport' ? event.sport : 'Upcoming Event'}
              </span>
              {event.date && event.month && (
                <span className="bg-yellow-600 text-white text-xs font-lato font-bold tracking-widest uppercase px-3 py-1">
                  {event.date} {event.month}
                </span>
              )}
            </div>

            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1a2456] mb-4">{event.title}</h1>

            {event.location && (
              <div className="font-lato text-sm text-gray-700 mb-2">
                <span className="font-bold">Location:</span> {event.location}
              </div>
            )}
            {event.time && (
              <div className="font-lato text-sm text-gray-700 mb-4">
                <span className="font-bold">Time:</span> {event.time}
              </div>
            )}

            {event.desc && <p className="font-lato text-gray-700 text-base leading-relaxed">{event.desc}</p>}
            {event.body && <p className="font-lato text-gray-700 text-base leading-relaxed mt-4">{event.body}</p>}
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
