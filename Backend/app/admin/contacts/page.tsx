import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export const runtime = 'nodejs'

export default async function AdminContactsPage() {
  const session = await getServerSession(authOptions)
  const db = await getDb()

  const submissions = await db
    .collection('contactSubmissions')
    .find({}, { projection: { name: 1, email: 1, phone: 1, subject: 1, message: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray()

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
          <Link href="/admin" className="text-yellow-300 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        <p className="text-white/80 text-sm mb-8">Signed in as {session?.user?.email}</p>

        <div className="overflow-x-auto bg-white/10 border border-white/10">
          <table className="w-full text-sm text-white/90">
            <thead className="text-left text-white/70">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s: any) => (
                <tr key={String(s._id)} className="border-t border-white/10">
                  <td className="px-4 py-3">{s.name || ''}</td>
                  <td className="px-4 py-3">{s.email || ''}</td>
                  <td className="px-4 py-3">{s.phone || ''}</td>
                  <td className="px-4 py-3">{s.subject || ''}</td>
                  <td className="px-4 py-3">{s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-white/70" colSpan={5}>
                    No contact submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {submissions.length > 0 && (
          <div className="mt-8 space-y-3">
            <h2 className="text-white font-bold">Latest Messages</h2>
            {submissions.slice(0, 10).map((s: any) => (
              <div key={`msg-${String(s._id)}`} className="bg-white/10 border border-white/10 p-4 text-white/90">
                <div className="text-white font-semibold">{s.subject || ''}</div>
                <div className="text-white/70 text-xs">{s.name || ''} • {s.email || ''}</div>
                <div className="text-white/80 text-sm mt-2 whitespace-pre-wrap">{s.message || ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
