'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DirectAccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Immediate redirect to dashboard - no checks whatsoever
    router.push('/admin/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-green-800">
          🚨 Direct Access Bypass Active
        </h2>
        <p className="text-green-600 mt-2">
          Redirecting to admin dashboard...
        </p>
      </div>
    </div>
  )
}