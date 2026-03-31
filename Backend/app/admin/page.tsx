import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'

export default async function AdminHome() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/80 text-sm mb-8">
          Signed in as {session?.user?.email} ({(session?.user as any)?.role || 'EDITOR'})
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: '/admin/news', label: 'News' },
            { href: '/admin/events', label: 'Events' },
            { href: '/admin/projects', label: 'Projects' },
            { href: '/admin/gallery', label: 'Gallery' },
            { href: '/admin/committee', label: 'Committee' },
            { href: '/admin/settings', label: 'Site Settings' },
            { href: '/admin/memberships', label: 'Membership Requests' },
            { href: '/admin/contacts', label: 'Contact Submissions' },
            { href: '/admin/members', label: 'Members' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block bg-white/10 border border-white/10 px-5 py-4 text-white hover:bg-white/15 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
