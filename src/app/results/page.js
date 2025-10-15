'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

function ResultsPageContent() {
  const [results, setResults] = useState([])
  const [sessions, setSessions] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [selectedSession, setSelectedSession] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const searchParams = useSearchParams()
  const sessionParam = searchParams.get('session')

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch sessions, results, and announcements in parallel
        const [sessionsResponse, announcementsResponse] = await Promise.all([
          fetch('/api/sessions'),
          fetch('/api/announcements')
        ])
        
        if (sessionsResponse.ok) {
          const sessionsData = await sessionsResponse.json()
          setSessions(sessionsData || [])
          
          const sessionId = sessionParam || (sessionsData?.[0]?.id)
          setSelectedSession(sessionId || '')
          
          if (sessionId) {
            const resultsResponse = await fetch(`/api/results?session_id=${sessionId}`)
            if (resultsResponse.ok) {
              const resultsData = await resultsResponse.json()
              setResults(resultsData || [])
            }
          }
        }
        
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          setAnnouncements(announcementsData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load results data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [sessionParam])

  const handleSessionChange = async (sessionId) => {
    setSelectedSession(sessionId)
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/results?session_id=${sessionId}`)
      if (response.ok) {
        const resultsData = await response.json()
        setResults(resultsData || [])
      } else {
        setError('Failed to load results for selected session')
      }
    } catch (error) {
      console.error('Error fetching results:', error)
      setError('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const sortedResults = [...results].sort((a, b) => (a.rank || 999) - (b.rank || 999))
  const selectedSessionInfo = sessions.find(s => s.id === selectedSession)
  const pageTitle = selectedSessionInfo 
    ? `Result of ${selectedSessionInfo.name} ${selectedSessionInfo.year}`
    : 'Result of ICPC Asia West Championship 2024-25'

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white border p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-lg text-gray-600 mb-4">Error Loading Results</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-sm sm:text-base lg:text-lg text-gray-600 mb-2 border-b-2 border-gray-300 pb-1">
                Result of ICPC Asia West Championship 2024-25
              </h1>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 mb-3 sm:mb-4">
                {pageTitle}
              </h2>
            </div>

            {/* Session Selector */}
            {sessions.length > 0 && (
              <div className="mb-4">
                <select
                  value={selectedSession}
                  onChange={(e) => handleSessionChange(e.target.value)}
                  className="w-full sm:w-auto border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 font-medium bg-white min-w-0"
                >
                  <option value="">Select Championship Session</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name} {session.year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Results Table */}
            {sortedResults.length > 0 ? (
              <div className="border border-gray-300 overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-blue-200">
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 whitespace-nowrap">Rank</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[120px]">Team Name</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 whitespace-nowrap">Score</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 whitespace-nowrap">Total Time</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 whitespace-nowrap">Country</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[150px]">Institute Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResults.map((result, index) => (
                      <tr 
                        key={result.id} 
                        className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                      >
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-center text-gray-900 font-medium whitespace-nowrap">{result.rank}</td>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-blue-700 font-medium">{result.team_name}</td>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-center text-gray-900 font-medium whitespace-nowrap">{result.score || '-'}</td>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-center text-gray-900 font-medium whitespace-nowrap">{result.total_time || '-'}</td>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-center text-gray-900 font-medium whitespace-nowrap">{result.country || '-'}</td>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-blue-700 font-medium">{result.institute_name || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-gray-300 p-6 sm:p-8 lg:p-12 text-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  Results Yet to be Announced
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {selectedSession 
                    ? 'The results for the selected championship will be announced soon.'
                    : 'Championship results will be announced soon.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Dynamic Announcements */}
          <Sidebar announcements={announcements} />
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white border p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  )
}