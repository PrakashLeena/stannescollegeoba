import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

type ApiProject = {
  slug: string
  title: string
  summary?: string | null
  content?: string | null
  imageUrl?: string | null
}

async function getItem(slug: string): Promise<ApiProject | null> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  if (!base) return null

  const res = await fetch(`${base}/api/public/projects/${slug}`, { cache: 'no-store' })
  if (!res.ok) return null
  const json = await res.json()
  return json?.ok ? (json.item as ApiProject) : null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getItem(params.slug)
  if (!project) {
    return {
      title: 'Projects',
      robots: { index: false, follow: false },
    }
  }

  const desc = (project.summary || project.content || '').slice(0, 160)
  const title = `${project.title} | St.Anne’s College Past Pupils’ Association`

  return {
    title,
    description: desc,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      type: 'article',
      title,
      description: desc,
      url: `/projects/${project.slug}`,
      images: project.imageUrl ? [{ url: project.imageUrl }] : undefined,
    },
    twitter: {
      card: project.imageUrl ? 'summary_large_image' : 'summary',
      title,
      description: desc,
      images: project.imageUrl ? [project.imageUrl] : undefined,
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getItem(params.slug)
  if (!project) return notFound()

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-transparent">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <Link
              href="/#projects"
              className="font-lato text-yellow-700 font-bold text-xs uppercase tracking-widest border-b-2 border-yellow-500 hover:text-[#1a2456] hover:border-[#1a2456] transition-colors duration-200"
            >
              Back to Projects
            </Link>
          </div>

          <div className="bg-white/70 shadow-sm p-8 border-l-4 border-yellow-500">
            {project.imageUrl && (
              <div className="mb-6">
                <img src={project.imageUrl} alt={project.title} className="w-full max-h-[420px] object-cover" />
              </div>
            )}

            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1a2456] mb-4">{project.title}</h1>
            <p className="font-lato text-gray-700 text-base leading-relaxed">{project.content || project.summary || ''}</p>
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
