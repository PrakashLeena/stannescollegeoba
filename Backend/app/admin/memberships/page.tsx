import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { MembershipActions } from './MembershipActions'

export const runtime = 'nodejs'

export default async function AdminMembershipsPage() {
  const session = await getServerSession(authOptions)
  const db = await getDb()

  const requests = await db
    .collection('membershipRequests')
    .find({}, { projection: { fullName: 1, email: 1, phone: 1, yearLeft: 1, status: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray()

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-white">Membership Requests</h1>
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
                <th className="px-4 py-3">Year Left</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: any) => (
                <tr key={String(r._id)} className="border-t border-white/10">
                  <td className="px-4 py-3">{r.fullName || ''}</td>
                  <td className="px-4 py-3">{r.email || ''}</td>
                  <td className="px-4 py-3">{r.phone || ''}</td>
                  <td className="px-4 py-3">{r.yearLeft || ''}</td>
                  <td className="px-4 py-3">{r.status || ''}</td>
                  <td className="px-4 py-3">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
                  <td className="px-4 py-3">
                    <MembershipActions id={String(r._id)} />
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-white/70" colSpan={7}>
                    No membership requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
