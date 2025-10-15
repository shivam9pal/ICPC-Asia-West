import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase-server'

// GET - Fetch people officials
export async function GET(request) {
  console.log('🔄 GET /api/people-officials - Request received')
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('include_inactive') === 'true'
    
    const supabase = await createRouteHandlerClient()
    
    // Check if user is admin for full access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const isAdmin = user && !userError
    
    let query = supabase
      .from('people_officials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('id', { ascending: true })
    
    // If not admin or specifically requesting only active, filter by active status
    if (!isAdmin || !includeInactive) {
      query = query.eq('is_active', true)
    }
    
    const { data: officials, error } = await query
    
    if (error) {
      console.log('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 400 }
      )
    }
    
    console.log('✅ Fetched people officials:', officials.length)
    return NextResponse.json(officials)
  } catch (error) {
    console.error('❌ Critical error in GET /api/people-officials:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// POST - Create new people official
export async function POST(request) {
  console.log('🔄 POST /api/people-officials - Request received')
  try {
    const supabase = await createRouteHandlerClient()
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    console.log('📝 Parsing JSON data...')
    const requestData = await request.json()
    const { 
      position, 
      name, 
      title, 
      institution, 
      location, 
      email, 
      website_url, 
      additional_info, 
      display_order, 
      is_active 
    } = requestData
    
    console.log('📋 Data received:', {
      position,
      name,
      title,
      institution,
      location,
      email,
      display_order,
      is_active
    })
    
    // Validate required fields
    if (!position || !name) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Position and name are required' },
        { status: 400 }
      )
    }
    
    // Create official record
    const officialData = {
      position,
      name,
      title: title || null,
      institution: institution || null,
      location: location || null,
      email: email || null,
      website_url: website_url || null,
      additional_info: additional_info || null,
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true
    }
    
    console.log('💾 Creating people official record:', officialData)
    
    const { data: insertedOfficial, error } = await supabase
      .from('people_officials')
      .insert([officialData])
      .select('*')
    
    if (error) {
      console.log('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 400 }
      )
    }
    
    console.log('✅ People official created successfully:', insertedOfficial[0])
    return NextResponse.json(insertedOfficial[0], { status: 201 })
  } catch (error) {
    console.error('❌ Critical error in POST /api/people-officials:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// PUT - Update people official
export async function PUT(request) {
  console.log('🔄 PUT /api/people-officials - Request received')
  try {
    const supabase = await createRouteHandlerClient()
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    console.log('📝 Parsing JSON data...')
    const updateData = await request.json()
    const { 
      id, 
      position, 
      name, 
      title, 
      institution, 
      location, 
      email, 
      website_url, 
      additional_info, 
      display_order, 
      is_active 
    } = updateData
    
    console.log('📋 Update data received:', {
      id,
      position,
      name,
      title,
      institution,
      location,
      email,
      display_order,
      is_active
    })
    
    if (!id) {
      console.log('❌ Missing official ID')
      return NextResponse.json(
        { error: 'Official ID is required' },
        { status: 400 }
      )
    }
    
    // Get existing official
    const { data: existingOfficial } = await supabase
      .from('people_officials')
      .select('*')
      .eq('id', id)
      .single()
    
    if (!existingOfficial) {
      console.log('❌ Official not found:', id)
      return NextResponse.json(
        { error: 'Official not found' },
        { status: 404 }
      )
    }
    
    // Create updatePayload object with provided fields
    console.log('📝 Creating update data object...')
    let updatePayload = {}
    
    if (position !== undefined) updatePayload.position = position
    if (name !== undefined) updatePayload.name = name
    if (title !== undefined) updatePayload.title = title
    if (institution !== undefined) updatePayload.institution = institution
    if (location !== undefined) updatePayload.location = location
    if (email !== undefined) updatePayload.email = email
    if (website_url !== undefined) updatePayload.website_url = website_url
    if (additional_info !== undefined) updatePayload.additional_info = additional_info
    if (display_order !== undefined) updatePayload.display_order = display_order
    if (is_active !== undefined) updatePayload.is_active = is_active
    
    console.log('📋 Final update data:', updatePayload)
    
    // Update the database record
    console.log('💾 Updating database record...')
    const { data: updatedOfficial, error } = await supabase
      .from('people_officials')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
    
    if (error) {
      console.log('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 400 }
      )
    }
    
    if (!updatedOfficial || updatedOfficial.length === 0) {
      console.error('❌ No data returned after update')
      return NextResponse.json(
        { error: 'Official not found or update failed' },
        { status: 404 }
      )
    }
    
    console.log('✅ People official updated successfully:', updatedOfficial[0])
    return NextResponse.json(updatedOfficial[0])
  } catch (error) {
    console.error('❌ Critical error in PUT /api/people-officials:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove people official
export async function DELETE(request) {
  console.log('🔄 DELETE /api/people-officials - Request received')
  try {
    const supabase = await createRouteHandlerClient()
    
    // Check if user is authenticated and is admin
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
      console.log('❌ Missing official ID')
      return NextResponse.json(
        { error: 'Official ID is required' },
        { status: 400 }
      )
    }
    
    console.log('🗑️ Deleting people official:', id)
    
    const { error } = await supabase
      .from('people_officials')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.log('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 400 }
      )
    }
    
    console.log('✅ People official deleted successfully')
    return NextResponse.json({ message: 'People official deleted successfully' })
  } catch (error) {
    console.error('❌ Critical error in DELETE /api/people-officials:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}