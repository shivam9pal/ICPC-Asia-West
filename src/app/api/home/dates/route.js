import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase-server'

// GET - Fetch important dates
export async function GET(request) {
  try {
    const supabase = await createRouteHandlerClient()
    
    const { data, error } = await supabase
      .from('important_dates')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Error fetching dates:', error)
      return NextResponse.json(
        { error: 'Failed to fetch dates' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new important date
export async function POST(request) {
  try {
    const supabase = await createRouteHandlerClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tentative, site, date_related, committee1, committee2, order_index } = body

    if (!tentative || !site || !date_related || !committee1 || !committee2) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('important_dates')
      .insert([{
        tentative,
        site,
        date_related,
        committee1,
        committee2,
        order_index: order_index || 0
      }])
      .select()

    if (error) {
      console.error('Error creating date:', error)
      return NextResponse.json(
        { error: 'Failed to create date' },
        { status: 500 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update important date
export async function PUT(request) {
  try {
    const supabase = await createRouteHandlerClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, tentative, site, date_related, committee1, committee2, order_index } = body

    if (!id || !tentative || !site || !date_related || !committee1 || !committee2) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('important_dates')
      .update({
        tentative,
        site,
        date_related,
        committee1,
        committee2,
        order_index: order_index || 0
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating date:', error)
      return NextResponse.json(
        { error: 'Failed to update date' },
        { status: 500 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete important date
export async function DELETE(request) {
  try {
    const supabase = await createRouteHandlerClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('important_dates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting date:', error)
      return NextResponse.json(
        { error: 'Failed to delete date' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}