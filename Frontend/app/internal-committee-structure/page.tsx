import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'

export default function InternalCommitteeStructurePage() {
  return (
    <main>
      <Navbar />

      <section className="pt-32 pb-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-yellow-600" />
              <span className="text-yellow-600 font-lato text-sm tracking-widest uppercase font-bold">
                About Us
              </span>
              <div className="w-8 h-[2px] bg-yellow-600" />
            </div>
            <h1 className="section-title">Internal committee structure</h1>
            <p className="font-lato text-gray-700 mt-8 max-w-2xl mx-auto text-base leading-relaxed">
              Our committee structure ensures effective governance and smooth coordination across projects,
              events, membership, communications and compliance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Executive Committee', items: ['President', 'Vice President', 'Secretary', 'Treasurer'] },
              { title: 'Projects & Welfare', items: ['Project Leads', 'Fundraising', 'Donor Relations'] },
              { title: 'Events & Sports', items: ['Event Planning', 'Sports Teams', 'Venue Coordination'] },
              { title: 'Membership & Outreach', items: ['Member Onboarding', 'Alumni Engagement', 'Community Outreach'] },
              { title: 'Media & Communications', items: ['Social Media', 'Newsletters', 'Website Updates'] },
              { title: 'Audit & Compliance', items: ['Governance', 'Financial Review', 'Policies'] },
            ].map((block) => (
              <div key={block.title} className="bg-white/70 shadow-sm p-6 border-l-4 border-yellow-500">
                <div className="font-playfair text-xl font-bold text-[#1a2456] mb-3">{block.title}</div>
                <ul className="space-y-2">
                  {block.items.map((it) => (
                    <li key={it} className="font-lato text-sm text-gray-700">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  )
}
