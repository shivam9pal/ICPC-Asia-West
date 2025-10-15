'use client'

import { useEffect, useState } from 'react'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical,
  Save,
  X,
  AlertCircle
} from 'lucide-react'
import AdminNavbar from '@/components/AdminNavbar'

export default function AnnouncementsPage() {
  const { loading: authLoading } = useAuthGuard()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    color_scheme: 'blue',
    is_active: true,
    display_order: 0,
    url: ''
  })

  const colorSchemes = [
    { value: 'red', label: 'Red', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    { value: 'green', label: 'Green', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    { value: 'orange', label: 'Orange', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    { value: 'blue', label: 'Blue', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    { value: 'gray', label: 'Gray', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
  ]

  const announcementTypes = [
    { value: 'problem_set', label: 'Problem Set' },
    { value: 'selected_teams', label: 'Selected Teams' },
    { value: 'championship_info', label: 'Championship Info' },
    { value: 'icpc_global', label: 'ICPC Global' },
    { value: 'result_archive', label: 'Result Archive' },
    { value: 'general', label: 'General' }
  ]

  useEffect(() => {
    if (!authLoading) {
      fetchAnnouncements()
    }
  }, [authLoading])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements?include_inactive=true')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      } else {
        setError('Failed to fetch announcements')
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
      setError('Failed to fetch announcements')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const url = editingId ? '/api/announcements' : '/api/announcements'
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId ? { ...formData, id: editingId } : formData
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        await fetchAnnouncements()
        resetForm()
        setShowForm(false)
        setEditingId(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save announcement')
      }
    } catch (error) {
      console.error('Error saving announcement:', error)
      setError('Failed to save announcement')
    }
  }

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      color_scheme: announcement.color_scheme,
      is_active: announcement.is_active,
      display_order: announcement.display_order,
      url: announcement.url || ''
    })
    setEditingId(announcement.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    
    try {
      const response = await fetch(`/api/announcements?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchAnnouncements()
      } else {
        setError('Failed to delete announcement')
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      setError('Failed to delete announcement')
    }
  }

  const handleToggleActive = async (announcement) => {
    try {
      const response = await fetch('/api/announcements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: announcement.id,
          is_active: !announcement.is_active
        })
      })
      
      if (response.ok) {
        await fetchAnnouncements()
      } else {
        setError('Failed to update announcement status')
      }
    } catch (error) {
      console.error('Error updating announcement:', error)
      setError('Failed to update announcement status')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      color_scheme: 'blue',
      is_active: true,
      display_order: 0,
      url: ''
    })
    setEditingId(null)
  }

  const getColorClasses = (colorScheme) => {
    const scheme = colorSchemes.find(c => c.value === colorScheme)
    return scheme || colorSchemes.find(c => c.value === 'blue')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminNavbar pageTitle="Announcements Management" showBackButton={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Description */}
        <div className="mb-8">
          <p className="text-gray-600">
            Manage sidebar announcements that appear on public pages
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Add New Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Announcement
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingId ? 'Edit Announcement' : 'Add New Announcement'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-base"
                      placeholder="https://example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add a URL to make this announcement clickable and redirect to the specified link
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-base"
                      >
                        {announcementTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Scheme
                      </label>
                      <select
                        value={formData.color_scheme}
                        onChange={(e) => setFormData({ ...formData, color_scheme: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-base"
                      >
                        {colorSchemes.map(color => (
                          <option key={color.value} value={color.value}>
                            {color.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="mr-2"
                        />
                        Active
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  {formData.title && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </label>
                      <div className={`p-3 rounded border ${getColorClasses(formData.color_scheme).bg} ${getColorClasses(formData.color_scheme).border}`}>
                        <h3 className={`font-bold text-sm ${getColorClasses(formData.color_scheme).text} mb-1`}>
                          {formData.title}
                        </h3>
                        {formData.content && (
                          <div className={`text-sm ${getColorClasses(formData.color_scheme).text.replace('600', '700')} whitespace-pre-line`}>
                            {formData.content}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-end sm:space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingId(null)
                        resetForm()
                      }}
                      className="w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? 'Update' : 'Create'} Announcement
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No announcements found. Create your first announcement!</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Color
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {announcements.map((announcement) => {
                      const colorClasses = getColorClasses(announcement.color_scheme)
                      return (
                        <tr key={announcement.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                              {announcement.display_order}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {announcement.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {announcement.content}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              {announcementTypes.find(t => t.value === announcement.type)?.label || announcement.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
                              {colorSchemes.find(c => c.value === announcement.color_scheme)?.label || announcement.color_scheme}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleActive(announcement)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                announcement.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {announcement.is_active ? (
                                <>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(announcement)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(announcement.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {announcements.map((announcement) => {
                  const colorClasses = getColorClasses(announcement.color_scheme)
                  return (
                    <div key={announcement.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Order:</span>
                          <span className="ml-2 text-gray-900 flex items-center">
                            <GripVertical className="h-4 w-4 text-gray-400 mr-1" />
                            {announcement.display_order}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Type:</span>
                          <span className="ml-2">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              {announcementTypes.find(t => t.value === announcement.type)?.label || announcement.type}
                            </span>
                          </span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-medium text-gray-700">Title:</span>
                          <span className="ml-2 text-gray-900">{announcement.title}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-medium text-gray-700">Content:</span>
                          <span className="ml-2 text-gray-900">{announcement.content}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Color:</span>
                          <span className="ml-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
                              {colorSchemes.find(c => c.value === announcement.color_scheme)?.label || announcement.color_scheme}
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className="ml-2">
                            <button
                              onClick={() => handleToggleActive(announcement)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                announcement.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {announcement.is_active ? (
                                <>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </button>
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-300">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}