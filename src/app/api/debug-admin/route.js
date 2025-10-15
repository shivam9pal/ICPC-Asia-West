import { createRouteHandlerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient()
    
    // Get all admin users
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('*')
    
    console.log('Debug: All admin users in database:', adminUsers)
    console.log('Debug: Query error (if any):', error)
    
    // Test specific email
    const testEmail = 'abhay701734@gmail.com'
    const { data: specificUser, error: specificError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', testEmail.toLowerCase().trim())
      .single()
    
    console.log('Debug: Specific user query result:', { specificUser, specificError, testEmail })
    
    return NextResponse.json({
      allAdminUsers: adminUsers,
      queryError: error,
      specificUserQuery: {
        email: testEmail,
        result: specificUser,
        error: specificError
      }
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json(
      { error: 'Debug endpoint failed', details: error.message },
      { status: 500 }
    )
  }
}