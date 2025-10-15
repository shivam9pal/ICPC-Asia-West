import { createClient } from '@supabase/supabase-js'

// Admin client with service role key - bypasses RLS
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Helper function to verify admin status using service role
export async function verifyAdminUser(email) {
  try {
    const adminClient = createAdminClient()
    
    
    const { data: adminUser, error } = await adminClient
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()
    
    
    return {
      isAdmin: !error && !!adminUser,
      adminUser: adminUser,
      error: error
    }
  } catch (error) {
    console.error('Admin client error:', error)
    return {
      isAdmin: false,
      adminUser: null,
      error: error
    }
  }
}