import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase-server'

// GET - Fetch announcements
export async function GET(request) {
  console.log('🔄 GET /api/announcements - Request received')
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('include_inactive') === 'true'
    
    const supabase = await createRouteHandlerClient()
    
    // Check if user is admin for full access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const isAdmin = user && !userError
    
    let query = supabase
      .from('announcements')
      .select('*')
      .order('display_order', { ascending: true })
      .order('id', { ascending: true })
    
    // If not admin or specifically requesting only active, filter by active status
    if (!isAdmin || !includeInactive) {
      query = query.eq('is_active', true)
    }
    
    const { data: announcements, error } = await query
    
    if (error) {
      console.log('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 400 }
      )
    }
    
    console.log('✅ Fetched announcements:', announcements.length)
    return NextResponse.json(announcements)
  } catch (error) {
    console.error('❌ Critical error in GET /api/announcements:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// POST - Create new announcement
export async function POST(request) {
  console.log('🔄 POST /api/announcements - Request received')
  try {
    const supabase = await createRouteHandlerClient()
    
    // Verify admin access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.log('❌ Authentication error')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()
    
    if (adminError || !adminUser) {
      console.log('❌ User is not admin:', user.email)
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    console.log('✅ Admin verified:', adminUser.email)
    
    console.log('📝 Parsing JSON data...')
    const requestData = await request.json()
    const { title, content, type, color_scheme, is_active, display_order, url } = requestData
    
    console.log('📋 Data received:', {
      title,
      type,
      color_scheme,
      is_active,
      display_order,
      url,
      content_length: content?.length
    })
    
    // Validate required fields
    if (!title || !content || !type) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Title, content, and type are required' },
        { status: 400 }
      )
    }
    
    // Validate type
    const validTypes = ['problem_set', 'selected_teams', 'championship_info', 'icpc_global', 'result_archive', 'general']
    if (!validTypes.includes(type)) {
      console.log('❌ Invalid type:', type)
      return NextResponse.json(
        { error: 'Invalid announcement type' },
        { status: 400 }
      )
    }
    
    // Validate color scheme
    const validColors = ['red', 'green', 'orange', 'blue', 'gray']
    if (color_scheme && !validColors.includes(color_scheme)) {
      console.log('❌ Invalid color scheme:', color_scheme)
      return NextResponse.json(
        { error: 'Invalid color scheme' },
        { status: 400 }
      )
    }
    
    // Create announcement record
    const announcementData = {
      title,
      content,
      type,
      color_scheme: color_scheme || 'blue',
      is_active: is_active !== undefined ? is_active : true,
      display_order: display_order || 0,
      url: url || null
    }
    
    console.log('💾 Creating announcement record:', announcementData)
    
    const { data: insertedAnnouncement, error } = await supabase
      .from('announcements')
      .insert([announcementData])
      .select('*')
    
    if (error) {
      console.log('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 400 }
      )
    }
    
    console.log('✅ Announcement created successfully:', insertedAnnouncement[0])
    return NextResponse.json(insertedAnnouncement[0], { status: 201 })
  } catch (error) {
    console.error('❌ Critical error in POST /api/announcements:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// PUT - Update announcement
export async function PUT(request) {
  console.log('🔄 PUT /api/announcements - Request received')
  try {
    const supabase = await createRouteHandlerClient()
    
    // Verify admin access
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.log('❌ Authentication error')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()
    
    if (!adminUser) {
      console.log('❌ User is not admin:', user.email)
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    console.log('📝 Parsing JSON data...')
    const updateData = await request.json()
    const { id, title, content, type, color_scheme, is_active, display_order, url } = updateData
    
    console.log('📋 Update data received:', {
      id,
      title,
      type,
      color_scheme,
      is_active,
      display_order,
      url,
      content_length: content?.length
    })
    
    if (!id) {
      console.log('❌ Missing announcement ID')
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }
    
    // Get existing announcement
    const { data: existingAnnouncement } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single()
    
    if (!existingAnnouncement) {
      console.log('❌ Announcement not found:', id)
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      )
    }
    
    // Validate type if provided
    if (type) {
      const validTypes = ['problem_set', 'selected_teams', 'championship_info', 'icpc_global', 'result_archive', 'general']
      if (!validTypes.includes(type)) {
        console.log('❌ Invalid type:', type)
        return NextResponse.json(
          { error: 'Invalid announcement type' },
          { status: 400 }
        )
      }
    }
    
    // Validate color scheme if provided
    if (color_scheme) {
      const validColors = ['red', 'green', 'orange', 'blue', 'gray']
      if (!validColors.includes(color_scheme)) {
        console.log('❌ Invalid color scheme:', color_scheme)
        return NextResponse.json(
          { error: 'Invalid color scheme' },
          { status: 400 }
        )
      }
    }
    
    // Create updatePayload object with provided fields
    console.log('📝 Creating update data object...')
    let updatePayload = {}
    
    if (title !== undefined) updatePayload.title = title
    if (content !== undefined) updatePayload.content = content
    if (type !== undefined) updatePayload.type = type
    if (color_scheme !== undefined) updatePayload.color_scheme = color_scheme
    if (is_active !== undefined) updatePayload.is_active = is_active
    if (display_order !== undefined) updatePayload.display_order = display_order
    if (url !== undefined) updatePayload.url = url
    
    console.log('📋 Final update data:', updatePayload)
    
    // Update the database record
    console.log('💾 Updating database record...')
    const { data: updatedAnnouncement, error } = await supabase
      .from('announcements')
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
    
    if (!updatedAnnouncement || updatedAnnouncement.length === 0) {
      console.error('❌ No data returned after update')
      return NextResponse.json(
        { error: 'Announcement not found or update failed' },
        { status: 404 }
      )
    }
    
    console.log('✅ Announcement updated successfully:', updatedAnnouncement[0])
    return NextResponse.json(updatedAnnouncement[0])
  } catch (error) {
    console.error('❌ Critical error in PUT /api/announcements:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE - Remove announcement
export async function DELETE(request) {
  console.log('🔄 DELETE /api/announcements - Request received')
  try {
    const supabase = await createRouteHandlerClient()
    
    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log('❌ No authenticated user')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()
    
    if (!adminUser) {
      console.log('❌ User is not admin:', user.email)
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      console.log('❌ Missing announcement ID')
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }
    
    console.log('🗑️ Deleting announcement:', id)
    
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.log('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 400 }
      )
    }
    
    console.log('✅ Announcement deleted successfully')
    return NextResponse.json({ message: 'Announcement deleted successfully' })
  } catch (error) {
    console.error('❌ Critical error in DELETE /api/announcements:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}