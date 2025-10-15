import { createRouteHandlerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { resultCsvSchema } from '@/lib/validations'
import Papa from 'papaparse'

export async function POST(request) {
  try {
    const supabase = await createRouteHandlerClient()

    // Authentication check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()
      
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file')
    const replaceExisting = formData.get('replaceExisting') === 'true'
    const sessionId = formData.get('sessionId') // Required for results too

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Session is now MANDATORY for results too
    if (!sessionId) {
      return NextResponse.json({ error: 'Session selection is required' }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Please upload a CSV file' }, { status: 400 })
    }

    // Parse CSV
    const csvText = await file.text()
    const parseResult = Papa.parse(csvText, { 
      header: true, 
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
    })

    if (parseResult.errors.length > 0) {
      return NextResponse.json({ 
        error: 'CSV parsing failed', 
        details: parseResult.errors.map(err => `Row ${err.row}: ${err.message}`)
      }, { status: 400 })
    }

    if (parseResult.data.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 })
    }

    // Validate data
    const validatedResults = []
    const errors = []

    for (let i = 0; i < parseResult.data.length; i++) {
      try {
        const row = parseResult.data[i]
        
        // Validate CSV structure
        const csvValidated = resultCsvSchema.parse({
          title: row.title,
          description: row.description || null,
          rank: row.rank || null,
          team_name: row.team_name || null,
          score: row.score || null,
          total_time: row.total_time || null,
          country: row.country || null,
          institute_name: row.institute_name || null
        })
        
        // Add session_id from UI selection
        const resultWithSession = {
          ...csvValidated,
          session_id: sessionId
        }
        
        validatedResults.push(resultWithSession)
        
      } catch (validationError) {
        errors.push({
          row: i + 2, // +2 for header and 0-based index
          data: parseResult.data[i],
          errors: validationError.errors || [validationError.message]
        })
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ 
        error: 'Data validation failed', 
        details: errors,
        message: `${errors.length} row(s) have validation errors. Please fix them and try again.`
      }, { status: 400 })
    }

    // Clear existing data if requested (only for this session)
    if (replaceExisting) {
      const { error: deleteError } = await supabase
        .from('results')
        .delete()
        .eq('session_id', sessionId)

      if (deleteError) {
        return NextResponse.json({ 
          error: 'Failed to clear existing results', 
          details: deleteError.message 
        }, { status: 400 })
      }
    }

    // Insert new data
    const { data, error } = await supabase
      .from('results')
      .insert(validatedResults)
      .select('*, sessions(name, year)')

    if (error) {
      return NextResponse.json({ 
        error: 'Database insertion failed', 
        details: error.message 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Results uploaded successfully',
      inserted: data.length,
      replaced: replaceExisting,
      sessionName: data[0]?.sessions?.name + ' ' + data[0]?.sessions?.year
    })

  } catch (error) {
    console.error('Results CSV upload error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}
