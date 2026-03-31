import Link from 'next/link'

export default function AdminGalleryPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <Link href="/admin" className="text-yellow-300 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-white/10 border border-white/10 p-6 text-white/80">
          This section is not implemented yet.
        </div>
      </div>
    </main>
  )
}
