import { createRouteHandlerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { resultSchema } from '@/lib/validations'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    const supabase = await createRouteHandlerClient()
    
    let query = supabase
      .from('results')
      .select('*, sessions(*)')
      .order('id', { ascending: true })
    
    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data: resultsData, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(resultsData)
  } catch (error) {
    console.error('Results fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const requestData = await request.json()
    
    const { 
      session_id,
      title,
      description,
      rank,
      team_name,
      score,
      total_time,
      country,
      institute_name
    } = requestData
    
    
    // Validate required fields
    if (!session_id || !title || !rank || !team_name) {
      return NextResponse.json(
        { error: 'Session ID, title, rank, and team name are required' },
        { status: 400 }
      )
    }

    console.log('🔐 Creating Supabase client...')
    const supabase = await createRouteHandlerClient()

    // Check if user is authenticated and is admin
    console.log('👤 Checking user authentication...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.log('❌ Auth error:', userError)
      return NextResponse.json(
        { error: 'Authentication error: ' + userError.message },
        { status: 401 }
      )
    }
    
    if (!user) {
      console.log('❌ No authenticated user found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    console.log('✅ User authenticated:', user.email)
    
    // Verify user is in admin_users table
    console.log('👮 Checking admin status...')
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()
      
    if (adminError) {
      console.log('❌ Admin check error:', adminError)
      return NextResponse.json(
        { error: 'Admin verification failed: ' + adminError.message },
        { status: 403 }
      )
    }
      
    if (!adminUser) {
      console.log('❌ User is not admin:', user.email)
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    console.log('✅ Admin verified:', adminUser.email)

    // Validate numeric fields
    const rankNum = parseInt(rank)
    const scoreNum = score ? parseInt(score) : null
    
    if (isNaN(rankNum) || rankNum <= 0) {
      console.log('❌ Invalid rank:', rank)
      return NextResponse.json(
        { error: 'Rank must be a positive number' },
        { status: 400 }
      )
    }

    // Create result record with tabular data
    const resultData = {
      session_id,
      title,
      description: description || null,
      rank: rankNum,
      team_name,
      score: scoreNum,
      total_time: total_time || null,
      country: country || null,
      institute_name: institute_name || null
    }

    console.log('💾 Creating result record:', resultData)

    const { data: insertedResult, error } = await supabase
      .from('results')
      .insert([resultData])
      .select('*, sessions(*)')

    if (error) {
      console.log('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 400 }
      )
    }

    console.log('✅ Result created successfully:', insertedResult[0])
    return NextResponse.json(insertedResult[0], { status: 201 })
  } catch (error) {
    console.error('❌ Critical error in POST /api/results:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  console.log('🔄 PUT /api/results - Request received')
  try {
    console.log('📝 Parsing JSON data...')
    const updateData = await request.json()
    
    const { 
      id,
      session_id,
      title,
      description,
      rank,
      team_name,
      score,
      total_time,
      country,
      institute_name
    } = updateData
    
    console.log('📋 Update data received:', {
      id,
      session_id,
      title,
      rank,
      team_name,
      score,
      total_time,
      country,
      institute_name
    })
    
    if (!id || !session_id || !title || !rank || !team_name) {
      return NextResponse.json(
        { error: 'ID, session ID, title, rank, and team name are required' },
        { status: 400 }
      )
    }

    console.log('🔐 Creating Supabase client...')
    const supabase = await createRouteHandlerClient()

    // Check if user is authenticated and is admin
    console.log('👤 Checking user authentication...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Verify user is in admin_users table
    console.log('👮 Checking admin status...')
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
    
    console.log('✅ Admin verified:', adminUser.email)

    // Get existing result
    const { data: existingResult } = await supabase
      .from('results')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingResult) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      )
    }

    // Validate numeric fields
    console.log('🔢 Validating numeric fields...')
    const parsedRank = parseInt(rank)
    const parsedScore = score ? parseFloat(score) : null
    
    if (isNaN(parsedRank) || parsedRank < 1) {
      return NextResponse.json(
        { error: 'Rank must be a positive integer' },
        { status: 400 }
      )
    }
    
    if (score && (isNaN(parsedScore) || parsedScore < 0)) {
      return NextResponse.json(
        { error: 'Score must be a non-negative number' },
        { status: 400 }
      )
    }

    // Create updatePayload object with all tabular fields
    console.log('📝 Creating update data object...')
    let updatePayload = {
      session_id: session_id,
      title: title.trim(),
      description: description ? description.trim() : null,
      rank: parsedRank,
      team_name: team_name.trim(),
      score: parsedScore,
      total_time: total_time ? total_time.trim() : null,
      country: country ? country.trim() : null,
      institute_name: institute_name ? institute_name.trim() : null
    }

    console.log('📋 Final update data:', updatePayload)

    // Update the database record
    console.log('💾 Updating database record...')
    const { data: updatedResult, error } = await supabase
      .from('results')
      .update(updatePayload)
      .eq('id', id)
      .select('*, sessions(*)')

    if (error) {
      console.error('❌ Database update failed:', error)
      return NextResponse.json(
        { error: 'Failed to update result: ' + error.message },
        { status: 400 }
      )
    }

    if (!updatedResult || updatedResult.length === 0) {
      console.error('❌ No data returned after update')
      return NextResponse.json(
        { error: 'Result not found or update failed' },
        { status: 404 }
      )
    }

    console.log('✅ Result updated successfully:', updatedResult[0])
    return NextResponse.json(updatedResult[0])
  } catch (error) {
    console.error('❌ Critical error in PUT /api/results:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
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
        { error: 'Result ID is required' },
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
    
    // Verify user is in admin_users table
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

    // Get result to delete associated file
    const { data: resultToDelete } = await supabase
      .from('results')
      .select('*')
      .eq('id', id)
      .single()

    if (resultToDelete && resultToDelete.pdf_url) {
      const fileName = resultToDelete.pdf_url.split('/').pop()
      await supabase.storage
        .from('icpc-files')
        .remove([`results/${resultToDelete.session_id}/${fileName}`])
    }

    const { error } = await supabase
      .from('results')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Result deleted successfully' })
  } catch (error) {
    console.error('Result deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}