import Link from 'next/link'
import { EventsClient } from './EventsClient'

export default function AdminEventsPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <Link href="/admin" className="text-yellow-300 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        <EventsClient />
      </div>
    </main>
  )
}
