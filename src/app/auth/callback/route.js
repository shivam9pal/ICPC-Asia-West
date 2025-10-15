import { createRouteHandlerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createRouteHandlerClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/admin/login?error=auth_failed`)
      }

      // Check if user is admin
      if (data.user) {
        // Admin verification flow
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', data.user.email.toLowerCase().trim())
          .single()


        if (adminError || !adminUser) {
          // Sign out the user if they're not an admin
          await supabase.auth.signOut()
          return NextResponse.redirect(`${requestUrl.origin}/admin/login?error=unauthorized`)
        }


        // Redirect to admin dashboard
        return NextResponse.redirect(`${requestUrl.origin}/admin/dashboard`)
      }
    } catch (error) {
      console.error('Unexpected auth error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/admin/login?error=unexpected`)
    }
  }

  // If no code or other issues, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/admin/login`)
}