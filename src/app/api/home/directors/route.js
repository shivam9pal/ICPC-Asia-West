import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase-server'

// GET - Fetch regional contest directors
export async function GET(request) {
  try {
    const supabase = await createRouteHandlerClient()
    
    const { data, error } = await supabase
      .from('regional_directors')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Error fetching directors:', error)
      return NextResponse.json(
        { error: 'Failed to fetch directors' },
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

// POST - Create new regional director
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
    const { country, site, director_name, email, website_url, order_index } = body

    if (!country || !site || !director_name) {
      return NextResponse.json(
        { error: 'Country, site, and director name are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('regional_directors')
      .insert([{
        country,
        site,
        director_name,
        email: email || null,
        website_url: website_url || null,
        order_index: order_index || 0
      }])
      .select()

    if (error) {
      console.error('Error creating director:', error)
      return NextResponse.json(
        { error: 'Failed to create director' },
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

// PUT - Update regional director
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
    const { id, country, site, director_name, email, website_url, order_index } = body

    if (!id || !country || !site || !director_name) {
      return NextResponse.json(
        { error: 'ID, country, site, and director name are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('regional_directors')
      .update({
        country,
        site,
        director_name,
        email: email || null,
        website_url: website_url || null,
        order_index: order_index || 0
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating director:', error)
      return NextResponse.json(
        { error: 'Failed to update director' },
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

// DELETE - Delete regional director
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
      .from('regional_directors')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting director:', error)
      return NextResponse.json(
        { error: 'Failed to delete director' },
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