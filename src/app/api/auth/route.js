import { createRouteHandlerClient } from '@/lib/supabase-server'
import { verifyAdminUser } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createRouteHandlerClient()

    // Authenticate user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      )
    }


    // Check if user is admin using service role client (bypasses RLS) - normal flow
    const adminVerification = await verifyAdminUser(email)
    

    if (!adminVerification.isAdmin) {
      // Sign out the user if they're not an admin
      await supabase.auth.signOut()
      return NextResponse.json(
        { 
          error: `Access denied. Admin privileges required. Email checked: ${email}`,
          debug: adminVerification.error?.message 
        },
        { status: 403 }
      )
    }


    return NextResponse.json({
      message: 'Login successful',
      user: authData.user,
      admin: adminVerification.adminUser
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const supabase = await createRouteHandlerClient()
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}