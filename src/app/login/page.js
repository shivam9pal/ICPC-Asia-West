'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Redirect to admin login
    const redirect = searchParams.get('redirect')
    const error = searchParams.get('error')
    
    let adminLoginUrl = '/admin/login'
    const params = new URLSearchParams()
    
    if (redirect) params.set('redirect', redirect)
    if (error) params.set('error', error)
    
    if (params.toString()) {
      adminLoginUrl += '?' + params.toString()
    }
    
    router.replace(adminLoginUrl)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to admin login...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}