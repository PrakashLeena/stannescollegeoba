import Link from 'next/link'
import { MembersClient } from './MembersClient'

export default function AdminMembersPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <Link href="/admin" className="text-yellow-300 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        <MembersClient />
      </div>
    </main>
  )
}
