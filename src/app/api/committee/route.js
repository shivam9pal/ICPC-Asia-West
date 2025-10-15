import { createRouteHandlerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { committeeMemberSchema } from '@/lib/validations'

export async function GET() {
  try {
    const supabase = await createRouteHandlerClient()
    
    const { data, error } = await supabase
      .from('committee_members')
      .select('*')
      .order('order_index', { ascending: true })
      .order('id', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Committee fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name')
    const position = formData.get('position')
    const institution = formData.get('institution')
    const location = formData.get('location')
    const email = formData.get('email')
    const websiteUrl = formData.get('website_url')
    const bio = formData.get('bio')
    const orderIndex = parseInt(formData.get('order_index') || '0')
    const isActive = formData.get('is_active') === 'true'
    const imageFile = formData.get('image_file') || formData.get('photo_file')
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Clean up empty strings to null for optional fields
    const cleanPosition = position && position.trim() !== '' ? position.trim() : null
    const cleanEmail = email && email.trim() !== '' ? email.trim() : null
    const cleanWebsiteUrl = websiteUrl && websiteUrl.trim() !== '' ? websiteUrl.trim() : null
    const cleanInstitution = institution && institution.trim() !== '' ? institution.trim() : null
    const cleanLocation = location && location.trim() !== '' ? location.trim() : null
    const cleanBio = bio && bio.trim() !== '' ? bio.trim() : null

    const supabase = await createRouteHandlerClient()

    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    let imageUrl = null

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        )
      }

      // Validate file size (5MB limit)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image size must be less than 5MB' },
          { status: 400 }
        )
      }

      const fileName = `committee/${Date.now()}_${imageFile.name}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('icpc-files')
        .upload(fileName, imageFile)

      if (uploadError) {
        return NextResponse.json(
          { error: 'Image upload failed: ' + uploadError.message },
          { status: 400 }
        )
      }

      const { data: { publicUrl } } = supabase.storage
        .from('icpc-files')
        .getPublicUrl(fileName)

      imageUrl = publicUrl
    }

    // Create committee member record
    const memberData = {
      name: name.trim(),
      position: cleanPosition,
      institution: cleanInstitution,
      location: cleanLocation,
      email: cleanEmail,
      website_url: cleanWebsiteUrl,
      bio: cleanBio,
      order_index: orderIndex,
      is_active: isActive,
      image_url: imageUrl
    }

    // Validate with schema
    const validatedData = committeeMemberSchema.parse(memberData)

    const { data, error } = await supabase
      .from('committee_members')
      .insert([validatedData])
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Committee member creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  console.log('🔄 PUT /api/committee - Request received')
  try {
    const formData = await request.formData()
    
    const id = formData.get('id')
    const name = formData.get('name')
    const position = formData.get('position')
    const institution = formData.get('institution')
    const location = formData.get('location')
    const email = formData.get('email')
    const websiteUrl = formData.get('website_url')
    const bio = formData.get('bio')
    const orderIndex = parseInt(formData.get('order_index') || '0')
    const isActive = formData.get('is_active') === 'true'
    const imageFile = formData.get('image_file') || formData.get('photo_file')
    
    console.log('📝 Update data received:', {
      id,
      name,
      position,
      order_index: orderIndex,
      is_active: isActive
    })
    
    if (!id || !name) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'ID and name are required' },
        { status: 400 }
      )
    }

    const supabase = await createRouteHandlerClient()

    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get existing member
    const { data: existingMember } = await supabase
      .from('committee_members')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Committee member not found' },
        { status: 404 }
      )
    }

    // Clean up empty strings to null for optional fields
    const cleanPosition = position && position.trim() !== '' ? position.trim() : null
    const cleanInstitution = institution && institution.trim() !== '' ? institution.trim() : null
    const cleanLocation = location && location.trim() !== '' ? location.trim() : null
    const cleanEmail = email && email.trim() !== '' ? email.trim() : null
    const cleanWebsiteUrl = websiteUrl && websiteUrl.trim() !== '' ? websiteUrl.trim() : null
    const cleanBio = bio && bio.trim() !== '' ? bio.trim() : null

    let updateData = {
      name: name.trim(),
      position: cleanPosition,
      institution: cleanInstitution,
      location: cleanLocation,
      email: cleanEmail,
      website_url: cleanWebsiteUrl,
      bio: cleanBio,
      order_index: orderIndex,
      is_active: isActive
    }

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        )
      }

      // Validate file size (5MB limit)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image size must be less than 5MB' },
          { status: 400 }
        )
      }

      // Delete old image if exists
      if (existingMember.image_url) {
        const oldFileName = existingMember.image_url.split('/').pop()
        await supabase.storage
          .from('icpc-files')
          .remove([`committee/${oldFileName}`])
      }

      const fileName = `committee/${Date.now()}_${imageFile.name}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('icpc-files')
        .upload(fileName, imageFile)

      if (uploadError) {
        return NextResponse.json(
          { error: 'Image upload failed: ' + uploadError.message },
          { status: 400 }
        )
      }

      const { data: { publicUrl } } = supabase.storage
        .from('icpc-files')
        .getPublicUrl(fileName)

      updateData.image_url = publicUrl
    }

    // Validate with schema
    const validatedData = committeeMemberSchema.parse(updateData)

    const { data, error } = await supabase
      .from('committee_members')
      .update(validatedData)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Committee member update error:', error)
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
        { error: 'Committee member ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createRouteHandlerClient()

    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get member to delete associated image
    const { data: member } = await supabase
      .from('committee_members')
      .select('*')
      .eq('id', id)
      .single()

    if (member && member.image_url) {
      const fileName = member.image_url.split('/').pop()
      await supabase.storage
        .from('icpc-files')
        .remove([`committee/${fileName}`])
    }

    const { error } = await supabase
      .from('committee_members')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Committee member deleted successfully' })
  } catch (error) {
    console.error('Committee member deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}