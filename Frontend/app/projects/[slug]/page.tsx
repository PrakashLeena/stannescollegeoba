import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { getProjectBySlug } from '@/lib/content'

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)
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
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-yellow-600 text-white text-xs font-lato font-bold tracking-widest uppercase px-3 py-1">
                {project.category}
              </span>
              <span
                className={`text-xs font-lato font-bold tracking-widest uppercase px-3 py-1 ${
                  project.tag === 'Ongoing' ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
                }`}
              >
                {project.tag}
              </span>
            </div>

            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1a2456] mb-4">{project.title}</h1>
            <p className="font-lato text-gray-700 text-base leading-relaxed">{project.body || project.desc}</p>
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
