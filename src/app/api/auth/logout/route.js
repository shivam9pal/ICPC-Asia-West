import { createRouteHandlerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = await createRouteHandlerClient()
    
    console.log('Logout API: Starting logout process')
    
    // Sign out the user
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: 'Failed to logout' },
        { status: 500 }
      )
    }

    console.log('Logout API: Supabase signOut successful')
    
    // Create response with explicit cookie clearing
    const response = NextResponse.json(
      { message: 'Successfully logged out' },
      { status: 200 }
    )

    // Clear all Supabase auth cookies
    const cookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      'supabase.auth.token'
    ]

    cookieNames.forEach(name => {
      response.cookies.set(name, '', {
        path: '/',
        expires: new Date(0),
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    })

    // Also clear any cookies that might exist with the project reference
    const allCookies = cookieStore.getAll()
    allCookies.forEach(cookie => {
      if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
        console.log('Logout API: Clearing cookie:', cookie.name)
        response.cookies.set(cookie.name, '', {
          path: '/',
          expires: new Date(0),
          maxAge: 0,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
      }
    })

    console.log('Logout API: All cookies cleared, logout complete')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}