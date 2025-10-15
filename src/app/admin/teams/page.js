'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, Check, X, ArrowLeft, UserPlus, UserMinus, Upload, Download, FileText, Info, AlertCircle, CheckCircle } from 'lucide-react'
import AdminNavbar from '@/components/AdminNavbar'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import Papa from 'papaparse'

export default function TeamsManagement() {
  const { isLoading, isAuthenticated } = useAuthGuard()
  const [teams, setTeams] = useState([])
  const [regionalSites, setRegionalSites] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [regionalEditingId, setRegionalEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showRegionalForm, setShowRegionalForm] = useState(false)
  const [activeTab, setActiveTab] = useState('teams')
  
  // CSV Upload States
  const [csvFile, setCsvFile] = useState(null)
  const [csvUploading, setCsvUploading] = useState(false)
  const [csvReplaceExisting, setCsvReplaceExisting] = useState(false)
  const [csvSelectedSession, setCsvSelectedSession] = useState('')
  const [csvResult, setCsvResult] = useState(null)
  const [csvError, setCsvError] = useState('')

  const [formData, setFormData] = useState({
    session_id: '',
    team_name: '',
    institution: '',
    members: [{ name: '', role: 'Contestant' }],
    status: 'selected',
    display_order: ''
  })

  const [regionalFormData, setRegionalFormData] = useState({
    session_id: '',
    site: '',
    slots: ''
  })

  const statusOptions = [
    { value: 'selected', label: 'Selected' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'disqualified', label: 'Disqualified' },
    { value: 'withdrawn', label: 'Withdrawn' }
  ]

  // Sample CSV data for teams
  //const teamsSampleData = [
  //  {
  //    session_id: sessions[0]?.id || 'your-session-id-here',
  //    team_name: 'CodeMasters',
  //    institution: 'University of Technology',
  //    member_names: 'John Doe, Jane Smith, Bob Wilson',
  //    member_roles: 'Captain, Contestant, Contestant',
  //    status: 'selected',
  //    display_order: 1
  //  },
  //  {
  //    session_id: sessions[0]?.id || 'your-session-id-here',
  //    team_name: 'AlgoExperts',
  //    institution: 'Tech Institute',
  //    member_names: 'Alice Brown, Charlie Davis',
  //    member_roles: 'Captain, Contestant',
  //    status: 'qualified',
  //    display_order: 2
  //  }
  //]

  const expectedColumns = [
    'team_name', 'institution', 'member_names', 
    'member_roles', 'status', 'display_order', 
    'selected_from', 'awc_venue'
  ]

  // Existing functions remain the same...
  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      
      if (response.ok) {
        setTeams(data)
      } else {
        setError(data.error || 'Failed to fetch teams')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      const data = await response.json()
      
      if (response.ok) {
        setSessions(data)
      } else {
        setError(data.error || 'Failed to fetch sessions')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const fetchRegionalSites = async () => {
    try {
      const response = await fetch('/api/regional-sites')
      const data = await response.json()
      
      if (response.ok) {
        setRegionalSites(data)
      } else {
        setError(data.error || 'Failed to fetch regional sites')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  // CSV Upload Functions
  const handleCsvFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setCsvFile(selectedFile)
      setCsvError('')
      setCsvResult(null)
    } else {
      setCsvError('Please select a valid CSV file')
      setCsvFile(null)
    }
  }

  const handleCsvUpload = async () => {
    if (!csvFile) {
      setCsvError('Please select a file first')
      return
    }
    if (!csvSelectedSession) {
    setCsvError('Please select a session first')
    return
  }

    setCsvUploading(true)
    setCsvError('')
    setCsvResult(null)

    try {
      const formData = new FormData()
      formData.append('file', csvFile)
      formData.append('replaceExisting', csvReplaceExisting.toString())
      
      if (csvSelectedSession) {
        formData.append('sessionId', csvSelectedSession)
      }

      const response = await fetch('/api/admin/upload-csv/teams', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setCsvResult(data)
        setCsvFile(null)
        await fetchTeams() // Refresh the teams list
        // Reset file input
        const fileInput = document.getElementById('teams-csv-file-input')
        if (fileInput) fileInput.value = ''
      } else {
        setCsvError(data.error || 'Upload failed')
        if (data.details) {
          console.error('Upload error details:', data.details)
        }
      }
    } catch (err) {
      setCsvError('Network error: ' + err.message)
    } finally {
      setCsvUploading(false)
    }
  }

  const downloadCsvSample = () => {
    const csvContent = Papa.unparse(teamsSampleData)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'teams_sample.csv'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const getSessionName = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    return session ? `${session.name} ${session.year}` : 'Unknown Session'
  }

  // Regional Sites CRUD operations (existing code remains same)
  const handleRegionalSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const url = '/api/regional-sites'
      const method = regionalEditingId ? 'PUT' : 'POST'
      const submitData = regionalEditingId 
        ? { ...regionalFormData, id: regionalEditingId }
        : regionalFormData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()

      if (response.ok) {
        await fetchRegionalSites()
        setShowRegionalForm(false)
        setRegionalEditingId(null)
        setRegionalFormData({ session_id: '', site: '', slots: '' })
      } else {
        setError(data.error || 'Failed to save regional site')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const handleRegionalEdit = (site) => {
    setRegionalFormData({
      session_id: site.session_id,
      site: site.site,
      slots: site.slots.toString()
    })
    setRegionalEditingId(site.id)
    setShowRegionalForm(true)
  }

  const handleRegionalDelete = async (siteId) => {
    if (!confirm('Are you sure you want to delete this regional site?')) return

    try {
      const response = await fetch(`/api/regional-sites?id=${siteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchRegionalSites()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete regional site')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchTeams(), fetchSessions(), fetchRegionalSites()])
      setLoading(false)
    }
    loadData()
  }, [])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return null // Will redirect via useAuthGuard
  }

  // Existing team management functions remain the same...
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const url = '/api/teams'
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { ...formData, id: editingId } : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        await fetchTeams()
        setShowForm(false)
        setEditingId(null)
        setFormData({
          session_id: '',
          team_name: '',
          institution: '',
          members: [{ name: '', role: 'Contestant' }],
          status: 'selected'
        })
      } else {
        setError(data.error || 'Failed to save team')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const handleEdit = (team) => {
    setFormData({
      session_id: team.session_id,
      team_name: team.team_name,
      institution: team.institution || '',
      members: team.members && team.members.length > 0 ? team.members : [{ name: '', role: 'Contestant' }],
      status: team.status || 'selected',
      display_order: team.display_order || ''
    })
    setEditingId(team.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) return

    try {
      const response = await fetch(`/api/teams?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchTeams()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete team')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: '', role: 'Contestant' }]
    })
  }

  const removeMember = (index) => {
    if (formData.members.length > 1) {
      setFormData({
        ...formData,
        members: formData.members.filter((_, i) => i !== index)
      })
    }
  }

  const updateMember = (index, field, value) => {
    const updatedMembers = formData.members.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    )
    setFormData({ ...formData, members: updatedMembers })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'selected': return 'bg-blue-100 text-blue-800'
      case 'disqualified': return 'bg-red-100 text-red-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminNavbar pageTitle="Teams Management" showBackButton={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError('')}
              className="mt-2 text-red-600 hover:text-red-800 text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tabs - Enhanced with Bulk Upload */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('teams')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'teams'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contest Teams
              </button>
              <button
                onClick={() => setActiveTab('regional-sites')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'regional-sites'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Regional Sites Allocation
              </button>
              <button
                onClick={() => setActiveTab('bulk-upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bulk-upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-1" />
                Bulk Upload
              </button>
            </nav>
          </div>
        </div>

        {/* Bulk Upload Tab Content */}
        {activeTab === 'bulk-upload' && (
          <div>
            {/* CSV Upload Component */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-blue-600" />
                  Teams CSV Upload
                </h3>
                <p className="text-sm text-gray-600">
                  Upload a CSV file to bulk import teams data. Download the sample file for the correct format.
                </p>
              </div>

              {/* Expected Columns Info */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-2">Expected CSV columns:</p>
                    <div className="flex flex-wrap gap-2">
                      {expectedColumns.map((col, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Filter */}
              {sessions.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Filter * 
                  </label>
                  <select
                    value={csvSelectedSession}
                    onChange={(e) => setCsvSelectedSession(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="">All Sessions</option>
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.name} {session.year}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    When "Replace existing data" is checked, only data from the selected session will be replaced.
                  </p>
                </div>
              )}

              {/* File Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File *
                </label>
                <input
                  id="teams-csv-file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md"
                />
              </div>

              {/* Options */}
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={csvReplaceExisting}
                    onChange={(e) => setCsvReplaceExisting(e.target.checked)}
                    className="mr-3 mt-0.5"
                  />
                  <div>
                    <span className="text-sm text-gray-700 font-medium">
                      Replace existing data
                    </span>
                    <p className="text-xs text-red-600 mt-1">
                      ⚠️ This will delete all current teams{csvSelectedSession ? ` from ${getSessionName(csvSelectedSession)}` : ''} before importing new data
                    </p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={handleCsvUpload}
                  disabled={!csvFile || csvUploading}
                  className="flex items-center justify-center px-6 py-3 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {csvUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </>
                  )}
                </button>

                <button
                  onClick={downloadCsvSample}
                  className="flex items-center justify-center px-6 py-3 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample
                </button>
              </div>

              {/* CSV Error Display */}
              {csvError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{csvError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CSV Success Display */}
              {csvResult && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm text-green-800 font-medium">
                        {csvResult.message}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        • {csvResult.inserted} teams imported successfully
                        {csvResult.replaced && ' • All existing data was replaced'}
                        • Session filter: {csvResult.sessionFilter}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rest of your existing code for teams and regional sites tabs... */}
        {/* I'll continue with the rest in the next message to avoid length limits */}
                {/* Teams Tab Content - Existing */}
        {activeTab === 'teams' && (
          <>
            {/* Add Team Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowForm(true)
                  setEditingId(null)
                  setFormData({
                    session_id: '',
                    team_name: '',
                    institution: '',
                    members: [{ name: '', role: 'Contestant' }],
                    status: 'selected',
                    display_order: ''
                  })
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Team
              </button>
            </div>

            {/* Team Form - Existing */}
            {showForm && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingId ? 'Edit Team' : 'Add New Team'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session
                      </label>
                      <select
                        value={formData.session_id}
                        onChange={(e) => setFormData({ ...formData, session_id: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        required
                      >
                        <option value="">Select a session</option>
                        {sessions.map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.name} {session.year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={formData.team_name}
                        onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., CodeMasters"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., University of Technology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                        <span className="text-gray-500 text-xs block">Lower numbers appear first</span>
                      </label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., 1, 2, 3..."
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Team Members
                      </label>
                      <button
                        type="button"
                        onClick={addMember}
                        className="bg-green-600 text-white px-4 py-2 sm:px-3 sm:py-1 rounded-md hover:bg-green-700 flex items-center text-sm"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Member
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.members.map((member, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 p-4 sm:p-3 border border-gray-200 rounded-md">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateMember(index, 'name', e.target.value)}
                              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                              placeholder="Member name"
                              required
                            />
                          </div>
                          <div className="w-full sm:w-32">
                            <select
                              value={member.role || 'Contestant'}
                              onChange={(e) => updateMember(index, 'role', e.target.value)}
                              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                            >
                              <option value="Contestant">Contestant</option>
                              <option value="Captain">Captain</option>
                              <option value="Coach">Coach</option>
                              <option value="Reserve">Reserve</option>
                            </select>
                          </div>
                          {formData.members.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMember(index)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                            >
                              <UserMinus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 pt-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {editingId ? 'Update' : 'Create'} Team
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingId(null)
                        setFormData({
                          session_id: '',
                          team_name: '',
                          institution: '',
                          members: [{ name: '', role: 'Contestant' }],
                          status: 'selected',
                          display_order: ''
                        })
                      }}
                      className="w-full sm:w-auto bg-gray-300 text-gray-700 px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-gray-400 flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Teams List - Existing */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Contest Teams
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading teams...</span>
                  </div>
                ) : teams.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No teams found. Add your first team!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teams.map((team) => (
                      <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{team.team_name}</h3>
                            <p className="text-gray-600">Session: {getSessionName(team.session_id)}</p>
                            {team.institution && (
                              <p className="text-gray-500 text-sm">Institution: {team.institution}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(team.status)}`}>
                                {statusOptions.find(s => s.value === team.status)?.label || team.status}
                              </span>
                              {team.display_order && (
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  Order: {team.display_order}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(team)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(team.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {team.members && team.members.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {team.members.map((member, index) => (
                                <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                  <span className="font-medium">{member.name}</span>
                                  {member.role && <span className="text-gray-500"> ({member.role})</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Regional Sites Management - Existing code remains exactly the same */}
        {activeTab === 'regional-sites' && (
          <>
            {/* Add Regional Site Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowRegionalForm(true)
                  setRegionalEditingId(null)
                  setRegionalFormData({
                    session_id: '',
                    site: '',
                    slots: ''
                  })
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Regional Site
              </button>
            </div>

            {/* Regional Sites Form */}
            {showRegionalForm && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {regionalEditingId ? 'Edit Regional Site' : 'Add New Regional Site'}
                </h2>
                <form onSubmit={handleRegionalSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session *
                      </label>
                      <select
                        value={regionalFormData.session_id}
                        onChange={(e) => setRegionalFormData({ ...regionalFormData, session_id: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        required
                      >
                        <option value="">Select a session</option>
                        {sessions.map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.name} {session.year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Regional Site *
                      </label>
                      <input
                        type="text"
                        value={regionalFormData.site}
                        onChange={(e) => setRegionalFormData({ ...regionalFormData, site: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., Dhaka"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allotted Slots *
                      </label>
                      <input
                        type="number"
                        value={regionalFormData.slots}
                        onChange={(e) => setRegionalFormData({ ...regionalFormData, slots: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="20"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 pt-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {regionalEditingId ? 'Update' : 'Add'} Regional Site
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegionalForm(false)
                        setRegionalEditingId(null)
                        setRegionalFormData({ session_id: '', site: '', slots: '' })
                      }}
                      className="w-full sm:w-auto bg-gray-300 text-gray-700 px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-gray-400 flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Regional Sites List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  Regional Sites Allocation ({regionalSites.length})
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading regional sites...</span>
                  </div>
                ) : regionalSites.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No regional sites found. Add your first regional site!</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Regional Site
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Allotted Slots
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Session
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {regionalSites.map((site) => (
                            <tr key={site.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {site.site}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {site.slots}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sessions.find(s => s.id === site.session_id)?.name || 'Unknown'} {sessions.find(s => s.id === site.session_id)?.year || ''}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleRegionalEdit(site)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRegionalDelete(site.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                      {regionalSites.map((site) => (
                        <div key={site.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Regional Site:</span>
                              <span className="ml-2 text-gray-900">{site.site}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Allotted Slots:</span>
                              <span className="ml-2 text-gray-900">{site.slots}</span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="font-medium text-gray-700">Session:</span>
                              <span className="ml-2 text-gray-900">{sessions.find(s => s.id === site.session_id)?.name || 'Unknown'} {sessions.find(s => s.id === site.session_id)?.year || ''}</span>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-300">
                            <button
                              onClick={() => handleRegionalEdit(site)}
                              className="text-blue-600 hover:text-blue-900 p-2"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRegionalDelete(site.id)}
                              className="text-red-600 hover:text-red-900 p-2"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
