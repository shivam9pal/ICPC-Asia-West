'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Menu, X } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function AdminNavbar({ pageTitle, showBackButton = false, backUrl = '/admin/dashboard' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Sessions', href: '/admin/sessions' },
    { name: 'Results', href: '/admin/results' },
    { name: 'Teams', href: '/admin/teams' },
    { name: 'Committee', href: '/admin/committee' },
    { name: 'Home', href: '/admin/home' },
    { name: 'Announcements', href: '/admin/announcements' }
  ]

  const isActivePage = (href) => {
    return pathname === href
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Desktop and Mobile Header */}
        <div className="flex justify-between items-center h-16">
          {/* Left side with back button and title */}
          <div className="flex items-center min-w-0 flex-1">
            {showBackButton && (
              <Link 
                href={backUrl} 
                className="mr-2 sm:mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
              <span className="hidden sm:inline">{pageTitle || 'ICPC Admin Panel'}</span>
              <span className="sm:hidden">
                {pageTitle ? pageTitle.split(' ').slice(0, 2).join(' ') : 'Admin'}
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`whitespace-nowrap px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                  isActivePage(item.href)
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side with logout and mobile menu */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActivePage(item.href)
                      ? 'text-blue-600 bg-blue-50 font-semibold border-l-4 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile logout button */}
              <div className="pt-4 border-t border-gray-200 sm:hidden">
                <div className="px-4">
                  <LogoutButton />
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}