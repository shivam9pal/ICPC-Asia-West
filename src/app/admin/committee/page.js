'use client'

import { useState, useEffect } from 'react'
import { UserCheck, Plus, Edit, Trash2, Check, X, ArrowLeft, Upload, ArrowUp, ArrowDown, User, Mail, Globe, MapPin } from 'lucide-react'
import AdminNavbar from '@/components/AdminNavbar'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function CommitteeManagement() {
  const { isLoading, isAuthenticated } = useAuthGuard()
  const [activeTab, setActiveTab] = useState('committee') // 'committee' or 'people'
  
  // Committee Members state
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    institution: '',
    location: '',
    email: '',
    website_url: '',
    bio: '',
    order_index: '',
    is_active: true,
    photo_file: null
  })

  // People Officials state
  const [officials, setOfficials] = useState([])
  const [officialsLoading, setOfficialsLoading] = useState(false)
  const [editingOfficialId, setEditingOfficialId] = useState(null)
  const [showOfficialForm, setShowOfficialForm] = useState(false)
  const [officialFormData, setOfficialFormData] = useState({
    position: '',
    name: '',
    title: '',
    institution: '',
    location: '',
    email: '',
    website_url: '',
    additional_info: '',
    display_order: 0,
    is_active: true
  })

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/committee')
      const data = await response.json()
      
      if (response.ok) {
        const sortedMembers = data.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        setMembers(sortedMembers)
      } else {
        setError(data.error || 'Failed to fetch committee members')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }


  const fetchOfficials = async () => {
    try {
      setOfficialsLoading(true)
      const response = await fetch('/api/people-officials?include_inactive=true')
      if (response.ok) {
        const data = await response.json()
        setOfficials(data.sort((a, b) => a.display_order - b.display_order))
      } else {
        setError('Failed to fetch people officials')
      }
    } catch (error) {
      console.error('Error fetching people officials:', error)
      setError('Failed to fetch people officials')
    } finally {
      setOfficialsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
    fetchOfficials()
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
    setUploading(true)

    try {
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'photo_file' && formData[key]) {
          submitData.append(key, formData[key])
        } else if (key !== 'photo_file') {
          submitData.append(key, formData[key])
        }
      })

      if (editingId) {
        submitData.append('id', editingId)
      }

      const url = '/api/committee'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: submitData
      })

      const data = await response.json()

      if (response.ok) {
        await fetchMembers()
        setShowForm(false)
        setEditingId(null)
        setFormData({
          name: '',
          position: '',
          institution: '',
          location: '',
          email: '',
          website_url: '',
          bio: '',
          order_index: '',
          is_active: true,
          photo_file: null
        })
      } else {
        setError(data.error || 'Failed to save committee member')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (member) => {
    setFormData({
      name: member.name || '',
      position: member.position || '',
      institution: member.institution || '',
      location: member.location || '',
      email: member.email || '',
      website_url: member.website_url || '',
      bio: member.bio || '',
      order_index: member.order_index?.toString() || '',
      is_active: member.is_active,
      photo_file: null
    })
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this committee member?')) return

    try {
      const response = await fetch(`/api/committee?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchMembers()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete committee member')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }


  const toggleActive = async (member) => {
    try {
      const formData = new FormData()
      formData.append('id', member.id)
      formData.append('name', member.name)
      
      // Only append optional fields if they have valid values
      if (member.position) formData.append('position', member.position)
      if (member.institution) formData.append('institution', member.institution)
      if (member.location) formData.append('location', member.location)
      if (member.email) formData.append('email', member.email)
      if (member.website_url) formData.append('website_url', member.website_url)
      if (member.bio) formData.append('bio', member.bio)
      
      formData.append('order_index', member.order_index.toString())
      formData.append('is_active', (!member.is_active).toString())

      const response = await fetch('/api/committee', {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        await fetchMembers()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update member status')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, photo_file: file })
    } else {
      setError('Please select a valid image file')
      e.target.value = ''
    }
  }

  // People Officials handler functions
  const handleOfficialSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const url = '/api/people-officials'
      const method = editingOfficialId ? 'PUT' : 'POST'
      const payload = editingOfficialId ? { ...officialFormData, id: editingOfficialId } : officialFormData
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        await fetchOfficials()
        setShowOfficialForm(false)
        setEditingOfficialId(null)
        setOfficialFormData({
          position: '',
          name: '',
          title: '',
          institution: '',
          location: '',
          email: '',
          website_url: '',
          additional_info: '',
          display_order: 0,
          is_active: true
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save people official')
      }
    } catch (error) {
      console.error('Error saving people official:', error)
      setError('Failed to save people official')
    }
  }

  const handleEditOfficial = (official) => {
    setOfficialFormData({
      position: official.position,
      name: official.name,
      title: official.title || '',
      institution: official.institution || '',
      location: official.location || '',
      email: official.email || '',
      website_url: official.website_url || '',
      additional_info: official.additional_info || '',
      display_order: official.display_order,
      is_active: official.is_active
    })
    setEditingOfficialId(official.id)
    setShowOfficialForm(true)
  }

  const handleDeleteOfficial = async (id) => {
    if (!confirm('Are you sure you want to delete this people official?')) return
    
    try {
      const response = await fetch(`/api/people-officials?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchOfficials()
      } else {
        setError('Failed to delete people official')
      }
    } catch (error) {
      console.error('Error deleting people official:', error)
      setError('Failed to delete people official')
    }
  }

  const handleToggleOfficialActive = async (official) => {
    try {
      const response = await fetch('/api/people-officials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: official.id,
          is_active: !official.is_active
        })
      })
      
      if (response.ok) {
        await fetchOfficials()
      } else {
        setError('Failed to update people official status')
      }
    } catch (error) {
      console.error('Error updating people official:', error)
      setError('Failed to update people official status')
    }
  }

  const moveOfficialUp = async (official) => {
    const currentIndex = officials.findIndex(o => o.id === official.id)
    if (currentIndex > 0) {
      const targetOfficial = officials[currentIndex - 1]
      await updateOfficialOrder(official.id, targetOfficial.display_order)
      await updateOfficialOrder(targetOfficial.id, official.display_order)
    }
  }

  const moveOfficialDown = async (official) => {
    const currentIndex = officials.findIndex(o => o.id === official.id)
    if (currentIndex < officials.length - 1) {
      const targetOfficial = officials[currentIndex + 1]
      await updateOfficialOrder(official.id, targetOfficial.display_order)
      await updateOfficialOrder(targetOfficial.id, official.display_order)
    }
  }

  const updateOfficialOrder = async (id, newOrder) => {
    try {
      const official = officials.find(o => o.id === id)
      const response = await fetch('/api/people-officials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          position: official.position,
          name: official.name,
          title: official.title,
          institution: official.institution,
          location: official.location,
          email: official.email,
          website_url: official.website_url,
          additional_info: official.additional_info,
          display_order: newOrder,
          is_active: official.is_active
        })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update order')
      } else {
        // Refresh the officials list after successful order update
        await fetchOfficials()
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminNavbar pageTitle="Committee Management" showBackButton={true} />

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

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('committee')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'committee'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserCheck className="inline-block w-4 h-4 mr-2" />
                ICPC AWC Steering Committee
              </button>
              <button
                onClick={() => setActiveTab('people')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'people'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="inline-block w-4 h-4 mr-2" />
                People Officials
              </button>
            </nav>
          </div>
        </div>

        {/* Committee Members Section */}
        {activeTab === 'committee' && (
          <div>
            {/* Add Member Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowForm(true)
                  setEditingId(null)
                  setFormData({
                    name: '',
                    position: '',
                    institution: '',
                    location: '',
                    email: '',
                    website_url: '',
                    bio: '',
                    order_index: '',
                    is_active: true,
                    photo_file: null
                  })
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Committee Member
              </button>
            </div>

            {/* Member Form */}
            {showForm && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingId ? 'Edit Committee Member' : 'Add Committee Member'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., Chair, Co-Chair"
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
                        placeholder="University or organization"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                      placeholder="Brief biography or description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                      <span className="text-gray-500 text-xs block">Lower numbers appear first</span>
                    </label>
                    <input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                      placeholder="e.g., 1, 2, 3..."
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="photo_file" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a photo</span>
                            <input 
                              id="photo_file" 
                              name="photo_file" 
                              type="file" 
                              accept="image/*"
                              className="sr-only" 
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        {formData.photo_file && (
                          <p className="text-sm text-green-600 mt-2">
                            Selected: {formData.photo_file.name}
                          </p>
                        )}
                      </div>
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
                      Active Member
                    </label>
                  </div>

                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {editingId ? 'Update' : 'Add'} Member
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingId(null)
                        setFormData({
                          name: '',
                          position: '',
                          institution: '',
                          location: '',
                          email: '',
                          website_url: '',
                          bio: '',
                          order_index: '',
                          is_active: true,
                          photo_file: null
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

            {/* Members List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Committee Members
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading committee members...</span>
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No committee members found. Add your first member!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {members.map((member, index) => (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="flex-shrink-0">
                              {member.photo_url ? (
                                <img 
                                  src={member.photo_url} 
                                  alt={member.name}
                                  className="h-16 w-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                              <p className="text-blue-600 font-medium">{member.position}</p>
                              {member.institution && (
                                <p className="text-gray-600">{member.institution}</p>
                              )}
                              {member.location && (
                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {member.location}
                                </div>
                              )}
                              <div className="flex items-center space-x-4 mt-2">
                                {member.email && (
                                  <a href={`mailto:${member.email}`} className="flex items-center text-gray-500 hover:text-blue-600 text-sm">
                                    <Mail className="h-4 w-4 mr-1" />
                                    Email
                                  </a>
                                )}
                                {member.website_url && (
                                  <a href={member.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 text-sm">
                                    <Globe className="h-4 w-4 mr-1" />
                                    Website
                                  </a>
                                )}
                              </div>
                              {member.bio && (
                                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{member.bio}</p>
                              )}
                              <div className="mt-2 flex items-center space-x-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  member.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {member.is_active ? 'Active' : 'Inactive'}
                                </span>
                                {member.order_index !== null && member.order_index !== undefined && (
                                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    Order: {member.order_index}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleActive(member)}
                                className={`px-3 py-1 text-sm font-medium rounded-md ${
                                  member.is_active
                                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                              >
                                {member.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleEdit(member)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(member.id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* People Officials Section */}
        {activeTab === 'people' && (
          <div className="space-y-6">
            {/* Add Official Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowOfficialForm(true)
                  setEditingOfficialId(null)
                  setOfficialFormData({
                    position: '',
                    name: '',
                    title: '',
                    institution: '',
                    location: '',
                    email: '',
                    website_url: '',
                    additional_info: '',
                    display_order: 0,
                    is_active: true
                  })
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Official
              </button>
            </div>

            {/* People Official Form */}
            {showOfficialForm && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingOfficialId ? 'Edit People Official' : 'Add People Official'}
                </h2>
                <form onSubmit={handleOfficialSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position *
                      </label>
                      <input
                        type="text"
                        value={officialFormData.position}
                        onChange={(e) => setOfficialFormData({ ...officialFormData, position: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., Chair, Director"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={officialFormData.name}
                        onChange={(e) => setOfficialFormData({ ...officialFormData, name: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={officialFormData.title}
                        onChange={(e) => setOfficialFormData({ ...officialFormData, title: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="Professional title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={officialFormData.institution}
                        onChange={(e) => setOfficialFormData({ ...officialFormData, institution: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="University or organization"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={officialFormData.location}
                        onChange={(e) => setOfficialFormData({ ...officialFormData, location: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={officialFormData.email}
                        onChange={(e) => setOfficialFormData({ ...officialFormData, email: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={officialFormData.website_url}
                        onChange={(e) => setOfficialFormData({ ...officialFormData, website_url: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={officialFormData.display_order}
                        onChange={(e) => setOfficialFormData({ ...officialFormData, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      value={officialFormData.additional_info}
                      onChange={(e) => setOfficialFormData({ ...officialFormData, additional_info: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                      placeholder="Additional information or notes"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="official_is_active"
                      checked={officialFormData.is_active}
                      onChange={(e) => setOfficialFormData({ ...officialFormData, is_active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="official_is_active" className="ml-2 block text-sm text-gray-900">
                      Active Official
                    </label>
                  </div>

                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 pt-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {editingOfficialId ? 'Update' : 'Add'} Official
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOfficialForm(false)
                        setEditingOfficialId(null)
                        setOfficialFormData({
                          position: '',
                          name: '',
                          title: '',
                          institution: '',
                          location: '',
                          email: '',
                          website_url: '',
                          additional_info: '',
                          display_order: 0,
                          is_active: true
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

            {/* People Officials List */}
            {officialsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading people officials...</p>
              </div>
            ) : officials.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No People Officials</h3>
                <p className="text-gray-600">Add your first people official to get started.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                {officials.map((official, index) => (
                  <div key={official.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{official.name}</h3>
                        <p className="text-blue-600 font-medium">{official.position}</p>
                        {official.title && (
                          <p className="text-gray-700 text-sm">{official.title}</p>
                        )}
                        {official.institution && official.location ? (
                          <p className="text-gray-600">{official.institution}, {official.location}</p>
                        ) : (
                          <>
                            {official.institution && (
                              <p className="text-gray-600">{official.institution}</p>
                            )}
                            {official.location && (
                              <p className="text-gray-600">{official.location}</p>
                            )}
                          </>
                        )}
                        {official.additional_info && (
                          <div className="text-gray-600 text-sm mt-2 whitespace-pre-line">{official.additional_info}</div>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          {official.email && (
                            <a href={`mailto:${official.email}`} className="flex items-center text-gray-500 hover:text-blue-600 text-sm">
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </a>
                          )}
                          {official.website_url && (
                            <a href={official.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 text-sm">
                              <Globe className="h-4 w-4 mr-1" />
                              Website
                            </a>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            official.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {official.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">Order: {official.display_order}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => moveOfficialUp(official)}
                            disabled={index === 0}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveOfficialDown(official)}
                            disabled={index === officials.length - 1}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleOfficialActive(official)}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                              official.is_active
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {official.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleEditOfficial(official)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOfficial(official.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}