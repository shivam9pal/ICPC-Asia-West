'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton({ className = '' }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      console.log('LogoutButton: Starting logout process')
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent
      })

      console.log('LogoutButton: Logout API response:', response.status)

      if (response.ok) {
        console.log('LogoutButton: Logout successful, clearing client-side data')
        
        // Clear any client-side auth state
        if (typeof window !== 'undefined') {
          // Clear localStorage
          try {
            localStorage.removeItem('supabase.auth.token')
            localStorage.clear()
          } catch (e) {
            console.log('Could not clear localStorage:', e)
          }
          
          // Clear sessionStorage
          try {
            sessionStorage.clear()
          } catch (e) {
            console.log('Could not clear sessionStorage:', e)
          }
          
          console.log('LogoutButton: Forcing complete page reload')
          // Force a complete page reload to ensure all state is cleared
          window.location.href = '/admin/login?message=logged_out'
          return
        }
        
        // Fallback if window is not available
        router.push('/admin/login?message=logged_out')
        router.refresh()
      } else {
        const data = await response.json()
        console.error('LogoutButton: Logout failed:', data)
        alert('Logout failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('LogoutButton: Logout error:', error)
      alert('Failed to logout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </>
      )}
    </button>
  )
}