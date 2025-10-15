#!/usr/bin/env node

/**
 * Script to create an admin user for the ICPC website
 * Run with: node scripts/create-admin.js <email> <password>
 */

const { createClient } = require('@supabase/supabase-js')
const { config } = require('dotenv')

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: node scripts/create-admin.js <email> <password>')
  console.error('Example: node scripts/create-admin.js admin@icpc.org mypassword123')
  process.exit(1)
}

const [email, password] = args

async function createAdmin() {
  console.log('🚀 Creating admin user...')
  
  // Create service role client (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // 1. Create user in Supabase Auth
    console.log(`📧 Creating Supabase auth user for: ${email}`)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      console.error('❌ Failed to create auth user:', authError.message)
      return
    }

    console.log('✅ Supabase auth user created:', authData.user.id)

    // 2. Add user to admin_users table
    console.log(`🔐 Adding user to admin_users table...`)
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          email: email.toLowerCase().trim()
        }
      ])
      .select()

    if (adminError) {
      console.error('❌ Failed to add to admin_users table:', adminError.message)
      // Try to clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return
    }

    console.log('✅ Admin user added to admin_users table')
    console.log('')
    console.log('🎉 Admin user created successfully!')
    console.log('📋 User Details:')
    console.log(`   Email: ${email}`)
    console.log(`   User ID: ${authData.user.id}`)
    console.log(`   Password: ${password}`)
    console.log('')
    console.log('🔗 Login URL: http://localhost:3000/admin/login')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

createAdmin()