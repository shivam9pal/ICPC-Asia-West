'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Check, X, Users, Calendar } from 'lucide-react'
import AdminNavbar from '@/components/AdminNavbar'

export default function HomeManagement() {
  const [activeTab, setActiveTab] = useState('directors')
  const [directors, setDirectors] = useState([])
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDirectorForm, setShowDirectorForm] = useState(false)
  const [showDateForm, setShowDateForm] = useState(false)
  const [editingDirectorId, setEditingDirectorId] = useState(null)
  const [editingDateId, setEditingDateId] = useState(null)
  
  const [directorFormData, setDirectorFormData] = useState({
    country: '',
    site: '',
    director_name: '',
    email: '',
    website_url: '',
    order_index: 0
  })

  const [dateFormData, setDateFormData] = useState({
    tentative: '',
    site: '',
    date_related: '',
    committee1: '',
    committee2: '',
    order_index: 0
  })

  useEffect(() => {
    fetchDirectors()
    fetchDates()
  }, [])

  const fetchDirectors = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/home/directors')
      if (response.ok) {
        const data = await response.json()
        setDirectors(data.sort((a, b) => a.order_index - b.order_index))
      } else {
        setError('Failed to fetch directors')
      }
    } catch (error) {
      console.error('Error fetching directors:', error)
      setError('Failed to fetch directors')
    } finally {
      setLoading(false)
    }
  }

  const fetchDates = async () => {
    try {
      const response = await fetch('/api/home/dates')
      if (response.ok) {
        const data = await response.json()
        setDates(data.sort((a, b) => a.order_index - b.order_index))
      } else {
        setError('Failed to fetch dates')
      }
    } catch (error) {
      console.error('Error fetching dates:', error)
      setError('Failed to fetch dates')
    }
  }

  const handleDirectorSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingDirectorId ? '/api/home/directors' : '/api/home/directors'
      const method = editingDirectorId ? 'PUT' : 'POST'
      
      const requestData = editingDirectorId 
        ? { ...directorFormData, id: editingDirectorId }
        : { ...directorFormData, order_index: directors.length }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        await fetchDirectors()
        setShowDirectorForm(false)
        setEditingDirectorId(null)
        setDirectorFormData({
          country: '',
          site: '',
          director_name: '',
          email: '',
          website_url: '',
          order_index: 0
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save director')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const handleDateSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingDateId ? '/api/home/dates' : '/api/home/dates'
      const method = editingDateId ? 'PUT' : 'POST'
      
      const requestData = editingDateId 
        ? { ...dateFormData, id: editingDateId }
        : { ...dateFormData, order_index: dates.length }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        await fetchDates()
        setShowDateForm(false)
        setEditingDateId(null)
        setDateFormData({
          tentative: '',
          site: '',
          date_related: '',
          committee1: '',
          committee2: '',
          order_index: 0
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save date')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    }
  }

  const handleEditDirector = (director) => {
    setDirectorFormData({
      country: director.country,
      site: director.site,
      director_name: director.director_name,
      email: director.email || '',
      website_url: director.website_url || '',
      order_index: director.order_index
    })
    setEditingDirectorId(director.id)
    setShowDirectorForm(true)
  }

  const handleEditDate = (date) => {
    setDateFormData({
      tentative: date.tentative,
      site: date.site,
      date_related: date.date_related,
      committee1: date.committee1,
      committee2: date.committee2,
      order_index: date.order_index
    })
    setEditingDateId(date.id)
    setShowDateForm(true)
  }

  const handleDeleteDirector = async (id) => {
    if (confirm('Are you sure you want to delete this director?')) {
      try {
        const response = await fetch(`/api/home/directors?id=${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await fetchDirectors()
        } else {
          setError('Failed to delete director')
        }
      } catch (error) {
        setError('Failed to delete director')
      }
    }
  }

  const handleDeleteDate = async (id) => {
    if (confirm('Are you sure you want to delete this date?')) {
      try {
        const response = await fetch(`/api/home/dates?id=${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await fetchDates()
        } else {
          setError('Failed to delete date')
        }
      } catch (error) {
        setError('Failed to delete date')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminNavbar pageTitle="Home Page Management" showBackButton={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-gray-600">
            Manage the Regional Contest Directors and Important Dates tables displayed on the homepage
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('directors')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'directors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Regional Contest Directors
              </button>
              <button
                onClick={() => setActiveTab('dates')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'dates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                Important Dates
              </button>
            </nav>
          </div>
        </div>

        {/* Regional Contest Directors Tab */}
        {activeTab === 'directors' && (
          <div>
            {/* Add Director Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowDirectorForm(true)
                  setEditingDirectorId(null)
                  setDirectorFormData({
                    country: '',
                    site: '',
                    director_name: '',
                    email: '',
                    website_url: '',
                    order_index: directors.length
                  })
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Regional Director
              </button>
            </div>

            {/* Director Form */}
            {showDirectorForm && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingDirectorId ? 'Edit Regional Director' : 'Add Regional Director'}
                </h2>
                <form onSubmit={handleDirectorSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={directorFormData.country}
                        onChange={(e) => setDirectorFormData({ ...directorFormData, country: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., India"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site *
                      </label>
                      <input
                        type="text"
                        value={directorFormData.site}
                        onChange={(e) => setDirectorFormData({ ...directorFormData, site: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., Mathura"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Director Name *
                      </label>
                      <input
                        type="text"
                        value={directorFormData.director_name}
                        onChange={(e) => setDirectorFormData({ ...directorFormData, director_name: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="Prof. John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={directorFormData.email}
                        onChange={(e) => setDirectorFormData({ ...directorFormData, email: e.target.value })}
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
                        value={directorFormData.website_url}
                        onChange={(e) => setDirectorFormData({ ...directorFormData, website_url: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 pt-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {editingDirectorId ? 'Update' : 'Add'} Director
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDirectorForm(false)
                        setEditingDirectorId(null)
                        setDirectorFormData({
                          country: '',
                          site: '',
                          director_name: '',
                          email: '',
                          website_url: '',
                          order_index: 0
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

            {/* Directors List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Regional Contest Directors
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading directors...</span>
                  </div>
                ) : directors.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No directors found. Add your first director!</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-blue-200">
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Country</th>
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Site</th>
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Director Name</th>
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Email</th>
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {directors.map((director, index) => (
                            <tr key={director.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{director.country}</td>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{director.site}</td>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{director.director_name}</td>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{director.email}</td>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleEditDirector(director)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDirector(director.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
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

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden space-y-4">
                      {directors.map((director, index) => (
                        <div key={director.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="text-sm font-semibold text-blue-900">Country</div>
                                <div className="text-sm text-gray-900">{director.country}</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditDirector(director)}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDirector(director.id)}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <div className="text-sm font-semibold text-blue-900">Site</div>
                                <div className="text-sm text-gray-900">{director.site}</div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-blue-900">Director Name</div>
                                <div className="text-sm text-gray-900">{director.director_name}</div>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-blue-900">Email</div>
                              <div className="text-sm text-gray-900 break-all">{director.email}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Important Dates Tab */}
        {activeTab === 'dates' && (
          <div>
            {/* Add Date Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowDateForm(true)
                  setEditingDateId(null)
                  setDateFormData({
                    tentative: '',
                    site: '',
                    date_related: '',
                    committee1: '',
                    committee2: '',
                    order_index: dates.length
                  })
                }}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Important Date
              </button>
            </div>

            {/* Date Form */}
            {showDateForm && (
              <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingDateId ? 'Edit Important Date' : 'Add Important Date'}
                </h2>
                <form onSubmit={handleDateSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tentative *
                      </label>
                      <input
                        type="text"
                        value={dateFormData.tentative}
                        onChange={(e) => setDateFormData({ ...dateFormData, tentative: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., Registration"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site *
                      </label>
                      <input
                        type="text"
                        value={dateFormData.site}
                        onChange={(e) => setDateFormData({ ...dateFormData, site: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., Global"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Related to Regional Contest *
                      </label>
                      <input
                        type="text"
                        value={dateFormData.date_related}
                        onChange={(e) => setDateFormData({ ...dateFormData, date_related: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., Uploading"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contest Committee 1 *
                      </label>
                      <input
                        type="text"
                        value={dateFormData.committee1}
                        onChange={(e) => setDateFormData({ ...dateFormData, committee1: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., 15/12/2024"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contest Committee 2 *
                      </label>
                      <input
                        type="text"
                        value={dateFormData.committee2}
                        onChange={(e) => setDateFormData({ ...dateFormData, committee2: e.target.value })}
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
                        placeholder="e.g., 15/03/2025"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 pt-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {editingDateId ? 'Update' : 'Add'} Date
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDateForm(false)
                        setEditingDateId(null)
                        setDateFormData({
                          tentative: '',
                          site: '',
                          date_related: '',
                          committee1: '',
                          committee2: '',
                          order_index: 0
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

            {/* Dates List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Important Dates
                </h2>
              </div>
              <div className="p-6">
                {dates.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No dates found. Add your first important date!</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-blue-200">
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Tentative</th>
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Site</th>
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Date Related</th>
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Committee 1</th>
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Committee 2</th>
                            <th className="border border-gray-400 px-3 py-2 text-sm font-semibold text-blue-900 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dates.map((date, index) => (
                            <tr key={date.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{date.tentative}</td>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{date.site}</td>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{date.date_related}</td>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{date.committee1}</td>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{date.committee2}</td>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleEditDate(date)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDate(date.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
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

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden space-y-4">
                      {dates.map((date, index) => (
                        <div key={date.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="text-sm font-semibold text-blue-900">Tentative</div>
                                <div className="text-sm text-gray-900">{date.tentative}</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditDate(date)}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDate(date.id)}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <div className="text-sm font-semibold text-blue-900">Site</div>
                                <div className="text-sm text-gray-900">{date.site}</div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-blue-900">Date Related</div>
                                <div className="text-sm text-gray-900">{date.date_related}</div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-blue-900">Committee 1</div>
                                <div className="text-sm text-gray-900">{date.committee1}</div>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-blue-900">Committee 2</div>
                                <div className="text-sm text-gray-900">{date.committee2}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}