import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

export default function HistoryPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-transparent">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-yellow-600" />
              <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">
                About Us
              </span>
              <div className="w-8 h-[2px] bg-yellow-600" />
            </div>
          </div>

          <h1 className="font-playfair text-4xl font-bold text-[#1a2456] mb-6">History</h1>

          <div className="bg-white/70 shadow-sm p-8 border-l-4 border-yellow-500 space-y-4">
            <p className="font-lato text-gray-700 text-base leading-relaxed">
              St.Anne’s College Past Pupils’ Association is built on a legacy of excellence, community,
              and service. This page is dedicated to preserving our story and celebrating the journey
              of our alumni.
            </p>
            <p className="font-lato text-gray-700 text-base leading-relaxed">
              Please update this section with your official history content (founding details,
              milestones, achievements, and past committees).
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
