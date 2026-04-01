import type { Metadata } from 'next'
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

async function getItem(slug: string): Promise<ApiNewsItem | null> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  if (!base) return null

  const res = await fetch(`${base}/api/public/news/${slug}`, { cache: 'no-store' })
  if (!res.ok) return null
  const json = await res.json()
  return json?.ok ? (json.item as ApiNewsItem) : null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getItem(params.slug)
  if (!item) {
    return {
      title: 'News',
      robots: { index: false, follow: false },
    }
  }

  const desc = (item.excerpt || item.content || '').slice(0, 160)
  const title = `${item.title} | St.Anne’s College Past Pupils’ Association`

  return {
    title,
    description: desc,
    alternates: {
      canonical: `/news/${item.slug}`,
    },
    openGraph: {
      type: 'article',
      title,
      description: desc,
      url: `/news/${item.slug}`,
      images: item.imageUrl ? [{ url: item.imageUrl }] : undefined,
    },
    twitter: {
      card: item.imageUrl ? 'summary_large_image' : 'summary',
      title,
      description: desc,
      images: item.imageUrl ? [item.imageUrl] : undefined,
    },
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const item = await getItem(params.slug)
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
