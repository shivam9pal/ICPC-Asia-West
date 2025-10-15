'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, Edit, Trash2, Check, X, ArrowLeft } from 'lucide-react'
import AdminNavbar from '@/components/AdminNavbar'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function SessionsManagement() {
  const { isLoading, isAuthenticated } = useAuthGuard()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear().toString(),
    is_active: false
  })

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sessions')
      const data = await response.json()
      
      if (response.ok) {
        setSessions(data)
      } else {
        setError(data.error || 'Failed to fetch sessions')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const url = editingId ? '/api/sessions' : '/api/sessions'
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { ...formData, id: editingId } : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        await fetchSessions()
        setShowForm(false)
        setEditingId(null)
        setFormData({ name: '', year: new Date().getFullYear().toString(), is_active: false })
      } else {
        setError(data.error || 'Failed to save session')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const handleEdit = (session) => {
    setFormData({
      name: session.name,
      year: session.year,
      is_active: session.is_active
    })
    setEditingId(session.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this session?')) return

    try {
      const response = await fetch(`/api/sessions?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchSessions()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete session')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const toggleActive = async (session) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: session.id,
          name: session.name,
          year: session.year,
          is_active: !session.is_active
        })
      })

      if (response.ok) {
        await fetchSessions()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update session')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminNavbar pageTitle="Sessions Management" showBackButton={true} />

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

        {/* Add Session Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setFormData({ name: '', year: new Date().getFullYear().toString(), is_active: false })
            }}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Session
          </button>
        </div>

        {/* Session Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingId ? 'Edit Session' : 'Add New Session'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                    placeholder="e.g., Asia West Contest"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                    placeholder="e.g., 2024"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active Session
                </label>
              </div>
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Create'} Session
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({ name: '', year: new Date().getFullYear().toString(), is_active: false })
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

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Contest Sessions
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading sessions...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sessions found. Create your first session!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{session.name}</h3>
                      <p className="text-gray-600">Year: {session.year}</p>
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          session.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleActive(session)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          session.is_active
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {session.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(session)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}