'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessions, setSessions] = useState([])
  const [resultsDropdown, setResultsDropdown] = useState(false)
  const [teamsDropdown, setTeamsDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownTimeouts, setDropdownTimeouts] = useState({})

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch('/api/sessions')
        if (response.ok) {
          const data = await response.json()
          setSessions(data || [])
        }
      } catch (error) {
        console.error('Error fetching sessions:', error)
      }
    }
    
    fetchSessions()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDropdownEnter = (dropdownName) => {
    // Clear any existing timeout for this dropdown
    if (dropdownTimeouts[dropdownName]) {
      clearTimeout(dropdownTimeouts[dropdownName])
      setDropdownTimeouts(prev => ({ ...prev, [dropdownName]: null }))
    }
    
    if (dropdownName === 'Results') setResultsDropdown(true)
    if (dropdownName === 'Selected Teams') setTeamsDropdown(true)
  }

  const handleDropdownLeave = (dropdownName) => {
    // Set a timeout before hiding the dropdown
    const timeoutId = setTimeout(() => {
      if (dropdownName === 'Results') setResultsDropdown(false)
      if (dropdownName === 'Selected Teams') setTeamsDropdown(false)
    }, 150) // 150ms delay

    setDropdownTimeouts(prev => ({ ...prev, [dropdownName]: timeoutId }))
  }

  const navItems = [
    {
      name: 'Home',
      href: '/',
      hasDropdown: false
    },
    {
      name: 'Results',
      href: '/results',
      hasDropdown: true,
      items: sessions.map(session => ({
        name: `AWC ${session.year}`,
        href: `/results?session=${session.id}`
      }))
    },
    {
      name: 'Selected Teams',
      href: '/teams',
      hasDropdown: true,
      items: sessions.map(session => ({
        name: `AWC ${session.year}`,
        href: `/teams?session=${session.id}`
      }))
    },
    {
      name: 'Steering Committee',
      href: '/committee',
      hasDropdown: false
    },
    {
      name: 'Organising Committee',
      href: '/organising-committee',
      hasDropdown: false
    },
    {
      name: 'Development Team',
      href: '/about',
      hasDropdown: false
    }
  ]

  return (
    <nav className={`${scrolled ? 'backdrop-blur-xl' : 'bg-white'} shadow-lg sticky top-0 z-50 border-b border-gray-200 transition-all duration-300`}
         style={scrolled ? { 
           backgroundColor: 'rgba(255, 255, 255, 0.85)',
           backdropFilter: 'blur(12px) saturate(180%)',
           WebkitBackdropFilter: 'blur(12px) saturate(180%)'
         } : {
           backgroundColor: 'rgb(255, 255, 255)'
         }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Link href="/" className="flex-shrink-0">
              <span className="text-gray-900 text-sm sm:text-base lg:text-xl font-bold whitespace-nowrap">
                <span className="hidden sm:inline">ICPC Asia West Championship</span>
                <span className="sm:hidden">ICPC AWC</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => handleDropdownEnter(item.name)}
                      onMouseLeave={() => handleDropdownLeave(item.name)}
                    >
                      <div className="flex items-center text-gray-900 hover:text-blue-600 cursor-pointer py-2 px-2 lg:px-3 xl:px-4 transition-colors duration-200 text-sm lg:text-base whitespace-nowrap">
                        <span>{item.name}</span>
                        <ChevronDown className="ml-1 h-4 w-4 flex-shrink-0" />
                      </div>
                      
                      {/* Dropdown Menu */}
                      {((item.name === 'Results' && resultsDropdown) || 
                        (item.name === 'Selected Teams' && teamsDropdown)) && (
                        <div className="absolute top-full left-0 pt-1 w-72 z-50">
                          <div className="bg-white rounded-md shadow-lg py-2 border border-gray-200">
                            <Link
                              href={item.href}
                              className="block px-4 py-2 text-sm text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-900 transition-colors duration-150 whitespace-nowrap"
                            >
                              All {item.name}
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="block px-4 py-2 text-sm text-gray-900 font-medium hover:bg-blue-50 hover:text-blue-900 transition-colors duration-150 whitespace-nowrap overflow-hidden text-ellipsis"
                                title={subItem.name}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-900 hover:text-blue-600 py-2 px-2 lg:px-3 xl:px-4 transition-colors duration-200 text-sm lg:text-base whitespace-nowrap"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
                {/* Separator line */}
                {index < navItems.length - 1 && (
                  <div className="h-6 w-px bg-gray-300 mx-1 lg:mx-2 flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-blue-600 focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden backdrop-blur-xl border-t border-gray-200"
             style={{ 
               backgroundColor: 'rgba(255, 255, 255, 0.9)',
               backdropFilter: 'blur(12px) saturate(180%)',
               WebkitBackdropFilter: 'blur(12px) saturate(180%)'
             }}>
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-gray-900 hover:text-blue-600 hover:bg-gray-100 rounded-md text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
                {item.hasDropdown && item.items.length > 0 && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md truncate"
                        onClick={() => setIsOpen(false)}
                        title={subItem.name}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}