'use client'

import { useEffect, useState } from 'react'
import { Calendar, Trophy, Users, UserCheck, Activity, Settings, MessageSquare, Home } from 'lucide-react'
import AdminNavbar from '@/components/AdminNavbar'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function AdminDashboard() {
  const { isLoading, isAuthenticated } = useAuthGuard()
  
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

  const quickActions = [
    {
      title: 'Manage Sessions',
      description: 'Create and manage contest sessions',
      href: '/admin/sessions',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'Upload Results',
      description: 'Upload contest results and PDFs',
      href: '/admin/results',
      icon: Trophy,
      color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Manage Teams',
      description: 'Add or edit team information',
      href: '/admin/teams',
      icon: Users,
      color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'Committee Management',
      description: 'Update committee member profiles and People Officials',
      href: '/admin/committee',
      icon: UserCheck,
      color: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
    },
    {
      title: 'Home Management',
      description: 'Manage Regional Directors and Important Dates tables',
      href: '/admin/home',
      icon: Home,
      color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Announcements',
      description: 'Manage sidebar announcements',
      href: '/admin/announcements',
      icon: MessageSquare,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminNavbar pageTitle="ICPC Admin Panel" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {false && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Activity className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  🎉 Admin Dashboard Access Successful!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    The bulletproof admin bypass is working perfectly. You now have full access to all admin functions.
                    You can now test all CRUD operations for sessions, results, teams, and committee management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
            {false && <span className="text-red-600"> - Bypass Mode Active</span>}
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome to the ICPC Asia West Continent admin panel. 
            {false && " Authentication has been bypassed for testing purposes."}
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className={`p-6 rounded-lg border-2 border-dashed hover:border-solid transition-all duration-200 ${action.color}`}
            >
              <div className="flex items-start">
                <action.icon className="h-8 w-8 mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-medium mb-2">{action.title}</h3>
                  <p className="text-sm opacity-80">{action.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Next.js Application</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Supabase Connected</span>
            </div>
            <div className="flex items-center">
              <div className={`h-3 w-3 ${false ? 'bg-red-500' : 'bg-green-500'} rounded-full mr-3`}></div>
              <span className="text-sm text-gray-600">
                {false ? 'Authentication Bypassed' : 'Authentication Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Testing Instructions */}
        {false && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">🧪 Testing Instructions</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>✅ Step 1 Complete:</strong> Successfully accessed admin dashboard with bypass</p>
              <p><strong>🎯 Next Steps:</strong></p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Click &quot;Manage Sessions&quot; to test session CRUD operations</li>
                <li>Click &quot;Upload Results&quot; to test results management</li>
                <li>Click &quot;Manage Teams&quot; to test team management</li>
                <li>Click &quot;Committee Management&quot; to test committee profiles</li>
              </ul>
              <p className="pt-2"><strong>🚨 Bypass Status:</strong> All authentication checks are skipped in development mode</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}