import { z } from 'zod'

export const sessionSchema = z.object({
  name: z.string().min(1, 'Session name is required').max(100),
  year: z.string().min(4, 'Year must be at least 4 characters').max(20),
  is_active: z.boolean().default(false),
})

export const resultSchema = z.object({
  session_id: z.string().uuid('Invalid session ID'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  pdf_file: z.any().optional(),
})

export const teamSchema = z.object({
  session_id: z.string().uuid('Invalid session ID'),
  team_name: z.string().min(1, 'Team name is required').max(100),
  institution: z.string().max(200).optional().nullable(),
  members: z.array(z.object({
    name: z.string().min(1, 'Member name is required'),
    role: z.string().optional(),
  })).min(1, 'At least one team member is required'),
  status: z.string().default('selected'),
  display_order: z.union([
    z.string().transform((val) => val === '' ? null : parseInt(val)),
    z.number(),
    z.null()
  ]).optional().nullable(),
  selected_from: z.string().max(200).optional().nullable(),
  awc_venue: z.string().max(200).optional().nullable(),
})

export const committeeMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  position: z.string().max(100).optional().nullable(),
  institution: z.string().max(200).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  email: z.union([
    z.string().email('Invalid email'),
    z.literal(''),
    z.null()
  ]).optional(),
  website_url: z.union([
    z.string().url('Invalid URL'),
    z.literal(''),
    z.null()
  ]).optional(),
  bio: z.string().optional().nullable(),
  order_index: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  image_url: z.string().optional().nullable()
})

export const adminUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.string().default('admin'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Enhanced schemas for CSV uploads
export const teamCsvSchema = z.object({
  team_name: z.string().min(1, 'Team name is required').max(100),
  institution: z.string().max(200).optional().nullable(),
  member_names: z.string().min(1, 'At least one member name is required'),
  member_roles: z.string().optional().nullable(),
  status: z.string().default('selected'),
  display_order: z.union([
    z.string().transform((val) => val === '' ? null : parseInt(val)),
    z.number(),
    z.null()
  ]).optional().nullable(),
  selected_from: z.string().max(200).optional().nullable(),
  awc_venue: z.string().max(200).optional().nullable()
})

// Results CSV Schema (remove session_id like we did for teams)
export const resultCsvSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().nullable(),
  rank: z.union([
    z.string().transform((val) => val === '' ? null : parseInt(val)),
    z.number(),
    z.null()
  ]).optional().nullable(),
  team_name: z.string().max(200).optional().nullable(),
  score: z.union([
    z.string().transform((val) => val === '' ? null : parseInt(val)),
    z.number(),
    z.null()
  ]).optional().nullable(),
  total_time: z.string().max(50).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  institute_name: z.string().max(200).optional().nullable()
})


// Utility function to parse CSV member data into teams format
export const parseCsvToTeam = (csvRow, sessionId) => {
  const memberNames = csvRow.member_names.split(',').map(name => name.trim()).filter(name => name)
  const memberRoles = csvRow.member_roles 
    ? csvRow.member_roles.split(',').map(role => role.trim())
    : []

  const members = memberNames.map((name, index) => ({
    name,
    role: memberRoles[index] || 'Contestant'
  }))

  return {
    session_id: sessionId,
    team_name: csvRow.team_name,
    institution: csvRow.institution || null,
    members,
    status: csvRow.status || 'selected',
    display_order: csvRow.display_order || null,
    selected_from: csvRow.selected_from || null,
    awc_venue: csvRow.awc_venue || null
  }
}

