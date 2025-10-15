import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  console.log('🚨 MIDDLEWARE CALLED:', request.nextUrl.pathname)
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Protect admin routes (but allow /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    console.log('Middleware: Protecting admin route:', request.nextUrl.pathname)
    
    // Get fresh user session - don't cache this
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    console.log('Middleware: User check result:', { 
      hasUser: !!user, 
      userEmail: user?.email, 
      userError: userError?.message,
      cookies: request.cookies.getAll().filter(c => c.name.includes('supabase') || c.name.includes('sb-'))
    })

    if (!user || userError) {
      console.log('Middleware: No valid user found, redirecting to login')
      const redirectUrl = new URL('/admin/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin
    console.log('Middleware: Checking admin status for user:', user.email)
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email.toLowerCase().trim())
      .single()

    console.log('Middleware: Admin query result:', { adminUser, adminError, userEmail: user.email })

    if (adminError || !adminUser) {
      console.log('Middleware: Admin verification failed, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
    }

    console.log('Middleware: Admin verification successful for:', adminUser.email)
  }

  // Redirect authenticated admin users away from login page
  if (request.nextUrl.pathname === '/admin/login') {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if user is admin
      console.log('Middleware: Login page redirect check for user:', user.email)
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email.toLowerCase().trim())
        .single()

      console.log('Middleware: Login page admin query result:', { adminUser, adminError })

      if (!adminError && adminUser) {
        console.log('Middleware: Redirecting authenticated admin to dashboard')
        const redirectTo = request.nextUrl.searchParams.get('redirect') || '/admin/dashboard'
        return NextResponse.redirect(new URL(redirectTo, request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*'
  ],
}