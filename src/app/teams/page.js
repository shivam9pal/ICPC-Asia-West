'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

function TeamsPageContent() {
  const [teams, setTeams] = useState([])
  const [sessions, setSessions] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [regionalSites, setRegionalSites] = useState([])
  const [selectedSession, setSelectedSession] = useState('')
  const [loading, setLoading] = useState(true)
  
  const searchParams = useSearchParams()
  const sessionParam = searchParams.get('session')

  useEffect(() => {
    async function fetchData() {
      try {
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
            const [teamsResponse, regionalSitesResponse] = await Promise.all([
              fetch(`/api/teams?session_id=${sessionId}`),
              fetch(`/api/regional-sites?session_id=${sessionId}`)
            ])
            
            if (teamsResponse.ok) {
              const teamsData = await teamsResponse.json()
              setTeams(teamsData || [])
            }
            
            if (regionalSitesResponse.ok) {
              const regionalSitesData = await regionalSitesResponse.json()
              setRegionalSites(regionalSitesData || [])
            }
          }
        }
        
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json()
          setAnnouncements(announcementsData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [sessionParam])

  const handleSessionChange = async (sessionId) => {
    setSelectedSession(sessionId)
    setLoading(true)
    
    try {
      if (sessionId) {
        const [teamsResponse, regionalSitesResponse] = await Promise.all([
          fetch(`/api/teams?session_id=${sessionId}`),
          fetch(`/api/regional-sites?session_id=${sessionId}`)
        ])
        
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json()
          setTeams(teamsData || [])
        }
        
        if (regionalSitesResponse.ok) {
          const regionalSitesData = await regionalSitesResponse.json()
          setRegionalSites(regionalSitesData || [])
        }
      } else {
        setTeams([])
        setRegionalSites([])
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  // Regional sites are now fetched from database

  const getSessionYear = () => {
    const currentSession = sessions.find(s => s.id === selectedSession)
    return currentSession ? currentSession.year : '2025'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Content with Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Left Content Area */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              List of Selected Teams- {getSessionYear()}
            </h1>
            
            {/* Session Filter */}
            {sessions.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <select
                  value={selectedSession}
                  onChange={(e) => handleSessionChange(e.target.value)}
                  className="w-full sm:w-auto border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 font-medium bg-white"
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

            {/* Description */}
            <p className="text-sm sm:text-base text-red-700 leading-relaxed mb-4 sm:mb-6">
              The number of teams selected from each regional site is determined by the total 
              participation in both the Online and On-site contests. A higher participation metric 
              results in more slots being allocated. Based on this criterion, the following slots have been 
              assigned for team selection at each regional site:
            </p>

            {/* Regional Sites Allocation Table */}
            {regionalSites.length > 0 ? (
              <div className="mb-4 sm:mb-6 overflow-x-auto">
                <table className="w-full min-w-[320px] border border-gray-400">
                  <thead>
                    <tr className="bg-red-400">
                      <th className="border border-gray-400 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white text-center">
                        Regional Site
                      </th>
                      <th className="border border-gray-400 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white text-center">
                        Allotted Slots
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalSites.map((site, index) => (
                      <tr key={`${site.site}-${index}`} className={index % 2 === 0 ? 'bg-red-100' : 'bg-red-200'}>
                        <td className="border border-gray-400 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900 font-medium text-center">
                          {site.site}
                        </td>
                        <td className="border border-gray-400 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900 font-medium text-center">
                          {site.slots}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-4 sm:mb-6">
                <table className="w-full min-w-[320px] border border-gray-400">
                  <thead>
                    <tr className="bg-red-400">
                      <th className="border border-gray-400 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white text-center">
                        Regional Site
                      </th>
                      <th className="border border-gray-400 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white text-center">
                        Allotted Slots
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="2" className="border border-gray-400 p-6 sm:p-8 lg:p-12 text-center">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Regional Sites Yet to be Announced</h3>
                        <p className="text-sm sm:text-base text-gray-600">
                          The regional sites and their allotted slots will be announced soon.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Team Selection Process Description */}
            <p className="text-sm sm:text-base text-red-700 leading-relaxed mb-4 sm:mb-6">
              Teams are chosen based on their performance at their respective regional contest sites. 
              Below is the list of selected teams as per the Team Selection Process of the Asia West 
              Continent Championship:
            </p>

            {/* Selected Teams Table */}
            {teams.length > 0 ? (
              <div className="border border-gray-400 overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-blue-200">
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left whitespace-nowrap">Sl No</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[120px]">Team Name</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[140px]">Institute</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[100px]">Selected from</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[100px]">AWC Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr key={team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                          {team.team_name}
                        </td>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                          {team.institution || 'N/A'}
                        </td>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                          {team.selected_from || team.country || 'N/A'}
                        </td>
                        <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                          {team.awc_venue || team.selected_from || team.country || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-gray-400 p-6 sm:p-8 lg:p-12 text-center">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Teams Yet to be Announced</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {selectedSession 
                    ? 'The selected teams for this championship will be announced soon.'
                    : 'Please select a session to view selected teams.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <Sidebar announcements={announcements} />
        </div>
      </div>
    </div>
  )
}

export default function TeamsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <TeamsPageContent />
    </Suspense>
  )
}