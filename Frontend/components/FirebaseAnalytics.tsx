'use client'

import { useEffect } from 'react'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getFirebaseApp } from '@/lib/firebaseClient'

export default function FirebaseAnalytics() {
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const supported = await isSupported()
        if (!supported || cancelled) return
        getAnalytics(getFirebaseApp())
      } catch {
        // ignore
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}
