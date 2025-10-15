'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Mail, Globe, MapPin, User } from 'lucide-react'
import Sidebar from '@/components/Sidebar'

export default function CommitteePage() {
  const [members, setMembers] = useState([])
  const [officials, setOfficials] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      
      try {
        // Fetch committee members, people officials, and announcements in parallel
        const [membersResponse, officialsResponse, announcementsResponse] = await Promise.all([
          supabase
            .from('committee_members')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true }),
          fetch('/api/people-officials'),
          fetch('/api/announcements')
        ])
        
        setMembers(membersResponse.data || [])
        
        if (officialsResponse.ok) {
          const officialsData = await officialsResponse.json()
          setOfficials(officialsData || [])
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
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl min-w-0">
            {/* People Section */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6 border-b-2 border-gray-300 pb-1">
                People
              </h1>
              <div className="border border-gray-300 overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-blue-200">
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left whitespace-nowrap min-w-[150px]">Patron</th>
                      <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[300px]">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dynamic People Data - Main Officials */}
                    {officials.length > 0 ? (
                      officials.map((official, index) => (
                        <tr 
                          key={official.id} 
                          className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-yellow-100'}
                        >
                          <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-900">
                            {official.position}
                          </td>
                          <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                            <div className="space-y-1">
                              <div className="font-semibold text-blue-700">{official.name}</div>
                              {official.title && (
                                <div className="text-gray-900 font-medium">{official.title}</div>
                              )}
                              {official.additional_info && (
                                <div className="text-gray-900 whitespace-pre-line">{official.additional_info}</div>
                              )}
                              {official.institution && official.location ? (
                                <div className="text-gray-900">{official.institution}, {official.location}</div>
                              ) : (
                                <>
                                  {official.institution && (
                                    <div className="text-gray-900">{official.institution}</div>
                                  )}
                                  {official.location && (
                                    <div className="text-gray-900">{official.location}</div>
                                  )}
                                </>
                              )}
                              {official.email && (
                                <div className="text-blue-600">
                                  E-mail: <a href={`mailto:${official.email}`} className="underline">{official.email}</a>
                                </div>
                              )}
                              {official.website_url && (
                                <div className="text-blue-600">
                                  URL: <a href={official.website_url} target="_blank" rel="noopener noreferrer" className="underline">{official.website_url}</a>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      /* Fallback data if no officials found */
                      <>
                        <tr className="bg-yellow-50">
                          <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-900">
                            Regional Contest Director and Associate Director, ICPC Asia WC Super Region
                          </td>
                          <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                            <div className="space-y-1">
                              <div className="font-semibold text-blue-700">Prof. C. J. Hwang</div>
                              <div className="text-gray-700">Asia Regional Contest Director</div>
                              <div className="text-gray-700">GLA University, Mathura-281406 INDIA</div>
                              <div className="text-blue-600">E-mail: <a href="mailto:icpc.secretary@gmail.com" className="underline">icpc.secretary@gmail.com</a></div>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ICPC AWC Steering Committee Section */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 mb-4 sm:mb-6">
                ICPC AWC Steering Committee
              </h2>
              {members.length > 0 ? (
                <div className="border border-gray-300 overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="bg-blue-200">
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left whitespace-nowrap min-w-[150px]">Name</th>
                        <th className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-blue-900 text-left min-w-[300px]">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member, index) => (
                        <tr 
                          key={member.id} 
                          className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                        >
                          <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-900">
                            {member.name}
                          </td>
                          <td className="border border-gray-400 px-2 sm:px-3 py-2 text-xs sm:text-sm">
                            <div className="space-y-1">
                              {member.institution && (
                                <div className="text-gray-900 font-medium">{member.institution}</div>
                              )}
                              {member.position && (
                                <div className="text-gray-900 font-medium">{member.position}</div>
                              )}
                              {member.email && (
                                <div className="text-blue-600">E-mail: <a href={`mailto:${member.email}`} className="underline">{member.email}</a></div>
                              )}
                              {member.website_url && (
                                <div className="text-blue-600">URL: <a href={member.website_url} target="_blank" rel="noopener noreferrer" className="underline">{member.website_url}</a></div>
                              )}
                              {member.location && (
                                <div className="text-gray-900">{member.location}</div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-gray-300 p-12 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No Committee Members
                  </h3>
                  <p className="text-gray-600">
                    Committee member information will be available soon.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <Sidebar announcements={announcements} />
        </div>
      </div>
    </div>
  )
}