'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function useAuthGuard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    async function checkAuth() {
      try {
        const supabase = createClient()
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (!session || sessionError) {
          router.push('/admin/login')
          return
        }
        
        // Check if user is admin
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email.toLowerCase().trim())
          .single()
        
        
        if (adminError || !adminUser) {
          router.push('/admin/login?error=unauthorized')
          return
        }
        
        setIsAuthenticated(true)
      } catch (error) {
        console.error('🔐 AuthGuard: Auth check failed:', error)
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [mounted, router])

  // Prevent hydration mismatch by returning loading state until mounted
  if (!mounted) {
    return { isLoading: true, isAuthenticated: false }
  }

  return { isLoading, isAuthenticated }
}