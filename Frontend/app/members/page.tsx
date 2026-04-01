import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

export const metadata: Metadata = {
  title: 'Members | St.Anne’s College Past Pupils’ Association',
  description: 'Members of St.Anne’s College Past Pupils’ Association.',
  alternates: {
    canonical: '/members',
  },
}

type ApiMember = {
  fullName: string
  yearLeft?: string | number | null
  jobTitle?: string | null
  imageUrl?: string | null
}

async function getMembers(): Promise<ApiMember[]> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  if (!base) return []

  const res = await fetch(`${base}/api/public/members`, { cache: 'no-store' })
  if (!res.ok) return []
  const json = await res.json()
  return json?.ok && Array.isArray(json.items) ? (json.items as ApiMember[]) : []
}

export default async function MembersPage() {
  const members = await getMembers()

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1a2456]">Members</h1>
            <p className="font-lato text-gray-700 mt-2">Active members of St.Anne’s College Past Pupils’ Association.</p>
          </div>

          {members.length === 0 ? (
            <div className="bg-white/70 shadow-sm p-8 border-l-4 border-yellow-500">
              <p className="font-lato text-gray-700">No members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m, idx) => (
                <div key={`${m.fullName}-${idx}`} className="bg-white/70 shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 flex gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-yellow-400 shrink-0">
                      {m.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.imageUrl} alt={m.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#1a2456] font-bold">{m.fullName?.slice(0, 1) || 'M'}</div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-lato font-bold text-[#1a2456] truncate">{m.fullName}</div>
                      {m.jobTitle ? <div className="font-lato text-sm text-gray-700 mt-1">{m.jobTitle}</div> : null}
                      {m.yearLeft !== undefined && m.yearLeft !== null && String(m.yearLeft).trim() !== '' ? (
                        <div className="font-lato text-xs text-gray-500 mt-2">Year Left: {m.yearLeft}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  )
}
