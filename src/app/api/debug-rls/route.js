import { createRouteHandlerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient()
    
    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // Test admin_users table access with different methods
    
    // Method 1: Direct query
    const { data: method1, error: error1 } = await supabase
      .from('admin_users')
      .select('*')
    
    // Method 2: Count query
    const { count, error: error2 } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })
    
    // Method 3: Specific email query
    const { data: method3, error: error3 } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'abhay701734@gmail.com')
    
    const results = {
      currentUser: user?.email || 'Not authenticated',
      directQuery: { data: method1, error: error1 },
      countQuery: { count, error: error2 },
      emailQuery: { data: method3, error: error3 },
      tableAccessible: !error1 && !error2,
      specificEmailFound: method3 && method3.length > 0
    }
    
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Debug RLS endpoint error:', error)
    return NextResponse.json(
      { error: 'Debug RLS endpoint failed', details: error.message },
      { status: 500 }
    )
  }
}