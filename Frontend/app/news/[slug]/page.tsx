import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

type ApiNewsItem = {
  slug: string
  title: string
  excerpt?: string | null
  content?: string | null
  imageUrl?: string | null
  publishedAt?: string | null
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  if (!base) return notFound()

  const res = await fetch(`${base}/api/public/news/${params.slug}`, { cache: 'no-store' })
  if (!res.ok) return notFound()
  const json = await res.json()
  const item: ApiNewsItem | null = json?.ok ? json.item : null
  if (!item) return notFound()

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-transparent">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <Link
              href="/#news"
              className="font-lato text-yellow-700 font-bold text-xs uppercase tracking-widest border-b-2 border-yellow-500 hover:text-[#1a2456] hover:border-[#1a2456] transition-colors duration-200"
            >
              Back to News
            </Link>
          </div>

          <div className="bg-white/70 shadow-sm p-8 border-l-4 border-yellow-500">
            {item.imageUrl && (
              <div className="mb-6">
                <img src={item.imageUrl} alt={item.title} className="w-full max-h-[420px] object-cover" />
              </div>
            )}
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1a2456] mb-4">{item.title}</h1>
            {item.publishedAt && (
              <div className="font-lato text-xs text-gray-500 mb-4">{new Date(item.publishedAt).toLocaleString()}</div>
            )}
            <p className="font-lato text-gray-700 text-base leading-relaxed">{item.content || item.excerpt || ''}</p>
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
