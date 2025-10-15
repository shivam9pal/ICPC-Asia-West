import { createRouteHandlerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    const supabase = await createRouteHandlerClient()
    
    let query = supabase
      .from('regional_sites')
      .select('*')
      .order('id', { ascending: true })
    
    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Regional sites fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const requestData = await request.json()
    const { session_id, site, slots } = requestData
    
    if (!session_id || !site || !slots) {
      return NextResponse.json(
        { error: 'Session ID, site name, and slots are required' },
        { status: 400 }
      )
    }

    const supabase = await createRouteHandlerClient()

    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Verify admin access
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()
      
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Validate slots is a positive number
    const slotsNum = parseInt(slots)
    if (isNaN(slotsNum) || slotsNum <= 0) {
      return NextResponse.json(
        { error: 'Slots must be a positive number' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('regional_sites')
      .insert([{
        session_id,
        site: site.trim(),
        slots: slotsNum
      }])
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Regional site creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const updateData = await request.json()
    const { id, session_id, site, slots } = updateData
    
    if (!id || !session_id || !site || !slots) {
      return NextResponse.json(
        { error: 'ID, session ID, site name, and slots are required' },
        { status: 400 }
      )
    }

    const supabase = await createRouteHandlerClient()

    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Verify admin access
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()
      
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Validate slots is a positive number
    const slotsNum = parseInt(slots)
    if (isNaN(slotsNum) || slotsNum <= 0) {
      return NextResponse.json(
        { error: 'Slots must be a positive number' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('regional_sites')
      .update({
        session_id,
        site: site.trim(),
        slots: slotsNum,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Regional site not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Regional site update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Regional site ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createRouteHandlerClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Verify admin access
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()
      
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('regional_sites')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Regional site deleted successfully' })
  } catch (error) {
    console.error('Regional site deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}