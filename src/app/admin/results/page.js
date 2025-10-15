'use client'

import { useState, useEffect } from 'react'
import { Trophy, Plus, Edit, Trash2, Check, X, Save, Search, Upload, Download, FileText, Info, AlertCircle, CheckCircle } from 'lucide-react'
import AdminNavbar from '@/components/AdminNavbar'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import Papa from 'papaparse'

export default function ResultsManagement() {
  const { isLoading, isAuthenticated } = useAuthGuard()
  const [results, setResults] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSession, setSelectedSession] = useState('')
  const [showCsvUpload, setShowCsvUpload] = useState(false) // NEW: Toggle CSV upload
  
  // CSV Upload States
  const [csvFile, setCsvFile] = useState(null)
  const [csvUploading, setCsvUploading] = useState(false)
  const [csvReplaceExisting, setCsvReplaceExisting] = useState(false)
  const [csvSelectedSession, setCsvSelectedSession] = useState('')
  const [csvResult, setCsvResult] = useState(null)
  const [csvError, setCsvError] = useState('')
  
  // Form data for new/edit entries
  const [formData, setFormData] = useState({
    session_id: '',
    title: '',
    description: '',
    rank: '',
    team_name: '',
    score: '',
    total_time: '',
    country: '',
    institute_name: ''
  })

  // Sample CSV data for results
  const resultsSampleData = [
    {
      title: 'Final Results',
      description: 'Final contest results',
      rank: 1,
      team_name: 'CodeMasters',
      score: 8,
      total_time: '15:23:45',
      country: 'India',
      institute_name: 'University of Technology'
    },
    {
      title: 'Final Results',
      description: 'Final contest results',
      rank: 2,
      team_name: 'AlgoExperts',
      score: 7,
      total_time: '16:45:12',
      country: 'Bangladesh',
      institute_name: 'Tech Institute'
    },
    {
      title: 'Final Results',
      description: 'Final contest results',
      rank: 3,
      team_name: 'ByteForce',
      score: 6,
      total_time: '18:32:28',
      country: 'India',
      institute_name: 'Digital University'
    }
  ]

  const expectedColumns = [
    'title', 'description', 'rank', 'team_name', 
    'score', 'total_time', 'country', 'institute_name'
  ]

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
      formData.append('sessionId', csvSelectedSession)

      const response = await fetch('/api/admin/upload-csv/results', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setCsvResult(data)
        setCsvFile(null)
        await fetchResults() // Refresh the results list
        // Reset file input
        const fileInput = document.getElementById('results-csv-file-input')
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
    const csvContent = Papa.unparse(resultsSampleData)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'results_sample.csv'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const getSessionName = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId)
    return session ? `${session.name} ${session.year}` : 'Unknown Session'
  }

  // Existing functions remain the same...
  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results')
      const data = await response.json()
      
      if (response.ok) {
        setResults(data)
      } else {
        setError(data.error || 'Failed to fetch results')
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchResults(), fetchSessions()])
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

  // ... (keep all your existing functions like handleSubmit, handleEdit, handleDelete)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      console.log('🚀 Frontend: Starting form submission...')
      
      const submitData = {
        ...formData,
        rank: parseInt(formData.rank),
        score: formData.score ? parseInt(formData.score) : null
      }

      if (editingId) {
        submitData.id = editingId
      }

      const url = '/api/results'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()

      if (response.ok) {
        await fetchResults()
        setShowForm(false)
        setEditingId(null)
        setFormData({
          session_id: '',
          title: '',
          description: '',
          rank: '',
          team_name: '',
          score: '',
          total_time: '',
          country: '',
          institute_name: ''
        })
      } else {
        setError(data.error || 'Failed to save result')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (result) => {
    setFormData({
      session_id: result.session_id,
      title: result.title,
      description: result.description || '',
      rank: result.rank?.toString() || '',
      team_name: result.team_name || '',
      score: result.score?.toString() || '',
      total_time: result.total_time || '',
      country: result.country || '',
      institute_name: result.institute_name || ''
    })
    setEditingId(result.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this result?')) return

    try {
      const response = await fetch(`/api/results?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchResults()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete result')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  // Filter results based on search term and selected session
  const filteredResults = results.filter(result => {
    const matchesSearch = !searchTerm || 
      result.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.institute_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSession = !selectedSession || result.session_id.toString() === selectedSession
    
    return matchesSearch && matchesSession
  }).sort((a, b) => (a.rank || 999) - (b.rank || 999))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminNavbar pageTitle="Results Management" showBackButton={true} />

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

        {/* Controls - Enhanced with CSV Upload Toggle */}
        <div className="mb-6 flex flex-col space-y-4">
          {/* First Row - Action Buttons */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3">
              <button
                onClick={() => {
                  setShowForm(true)
                  setShowCsvUpload(false) // Hide CSV when showing manual form
                  setEditingId(null)
                  setFormData({
                    session_id: '',
                    title: '',
                    description: '',
                    rank: '',
                    team_name: '',
                    score: '',
                    total_time: '',
                    country: '',
                    institute_name: ''
                  })
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Result
              </button>
              
              <button
                onClick={() => {
                  setShowCsvUpload(!showCsvUpload)
                  setShowForm(false) // Hide manual form when showing CSV
                }}
                className={`w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-2 rounded-md flex items-center justify-center transition-colors ${
                  showCsvUpload 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                {showCsvUpload ? 'Hide CSV Upload' : 'Bulk Upload CSV'}
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams, countries, institutes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full sm:w-auto px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">All Sessions</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name} {session.year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CSV Upload Section */}
        {showCsvUpload && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                Results CSV Upload
              </h3>
              <p className="text-sm text-gray-600">
                Upload a CSV file to bulk import results data. Download the sample file for the correct format.
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

            {/* Session Filter - Required */}
            {sessions.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session *
                </label>
                <select
                  value={csvSelectedSession}
                  onChange={(e) => setCsvSelectedSession(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select a session</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name} {session.year}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  All results in the CSV will be assigned to this session.
                </p>
              </div>
            )}

            {/* File Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File *
              </label>
              <input
                id="results-csv-file-input"
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
                    ⚠️ This will delete all current results{csvSelectedSession ? ` from ${getSessionName(csvSelectedSession)}` : ''} before importing new data
                  </p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleCsvUpload}
                disabled={!csvFile || !csvSelectedSession || csvUploading}
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
                      • {csvResult.inserted} results imported successfully
                      {csvResult.replaced && ' • All existing data was replaced'}
                      • Session: {csvResult.sessionName}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rest of your existing Results Management code continues... */}
        {/* I'll continue with the forms and table in the next part */}
                {/* Result Form - Existing */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingId ? 'Edit Result' : 'Add New Result'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Session */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session *
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

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                    placeholder="e.g., Final Results"
                    required
                  />
                </div>

                {/* Rank */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rank *
                  </label>
                  <input
                    type="number"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>

                {/* Team Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={formData.team_name}
                    onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                    placeholder="Team Alpha"
                    required
                  />
                </div>

                {/* Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score
                  </label>
                  <input
                    type="number"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                    placeholder="8"
                    min="0"
                  />
                </div>

                {/* Total Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Time
                  </label>
                  <input
                    type="text"
                    value={formData.total_time}
                    onChange={(e) => setFormData({ ...formData, total_time: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                    placeholder="15:23:45"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                    placeholder="India"
                  />
                </div>

                {/* Institute Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institute Name
                  </label>
                  <input
                    type="text"
                    value={formData.institute_name}
                    onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                    placeholder="IIT Delhi"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? 'Update' : 'Add'} Result
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({
                      session_id: '',
                      title: '',
                      description: '',
                      rank: '',
                      team_name: '',
                      score: '',
                      total_time: '',
                      country: '',
                      institute_name: ''
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

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Contest Results ({filteredResults.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading results...</span>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || selectedSession ? 'No results match your filters' : 'No results found. Add your first result!'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Institute Name
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
                    {filteredResults.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{result.rank || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{result.team_name || 'N/A'}</div>
                            <div className="text-gray-500 text-xs">{result.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.score !== null ? result.score : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.total_time || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.country || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {result.institute_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getSessionName(result.session_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(result)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(result.id)}
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
              <div className="lg:hidden space-y-4 p-4">
                {filteredResults.map((result) => (
                  <div key={result.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Rank:</span>
                        <span className="ml-2 text-gray-900">#{result.rank || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Score:</span>
                        <span className="ml-2 text-gray-900">{result.score !== null ? result.score : 'N/A'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-700">Team Name:</span>
                        <span className="ml-2 text-gray-900">{result.team_name || 'N/A'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-700">Title:</span>
                        <span className="ml-2 text-gray-900">{result.title}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Total Time:</span>
                        <span className="ml-2 text-gray-900">{result.total_time || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Country:</span>
                        <span className="ml-2 text-gray-900">{result.country || 'N/A'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-700">Institute:</span>
                        <span className="ml-2 text-gray-900">{result.institute_name || 'N/A'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-700">Session:</span>
                        <span className="ml-2 text-gray-900">{getSessionName(result.session_id)}</span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-300">
                      <button
                        onClick={() => handleEdit(result)}
                        className="text-blue-600 hover:text-blue-900 p-2"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(result.id)}
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
    </div>
  )
}
