'use client'

import Link from 'next/link'

export default function ICPCSidebar() {
  return (
    <div className="w-full lg:w-80 bg-white shadow-sm border-l border-gray-200 min-h-screen">
      <div className="p-6 space-y-8">
        
        {/* AWC Problem Set */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <h3 className="font-bold text-lg text-gray-900 mb-3 font-['Archivo_Black']">
            AWC Problem Set
          </h3>
          <a 
            href="#"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Download Problems
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
        </div>

        {/* List of Selected Teams */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
          <h3 className="font-bold text-lg text-gray-900 mb-3 font-['Archivo_Black']">
            List of Selected Teams
          </h3>
          <a 
            href="#"
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
          >
            View Teams List
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Championship Information */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
          <h3 className="font-bold text-lg text-gray-900 mb-3 font-['Archivo_Black']">
            Championship 2024-25
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold">Location:</span> Asia West Region</p>
            <p><span className="font-semibold">Date:</span> December 2024</p>
            <p><span className="font-semibold">Format:</span> Online Contest</p>
          </div>
        </div>

        {/* ICPC Global Links */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
          <h3 className="font-bold text-lg text-gray-900 mb-3 font-['Archivo_Black']">
            ICPC Global
          </h3>
          <div className="space-y-2">
            <a 
              href="https://icpc.global"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-orange-600 hover:text-orange-800 font-medium text-sm transition-colors"
            >
              ICPC Global Website
            </a>
            <a 
              href="https://icpc.global/blog"
              target="_blank"
              rel="noopener noreferrer" 
              className="block text-orange-600 hover:text-orange-800 font-medium text-sm transition-colors"
            >
              ICPC Asia Blog
            </a>
          </div>
        </div>

        {/* Sponsors */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-3 font-['Archivo_Black']">
            Sponsors
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-md border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">JB</span>
              </div>
              <span className="font-medium text-gray-800 text-sm">JetBrains</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-md border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">JS</span>
              </div>
              <span className="font-medium text-gray-800 text-sm">Jane Street</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-100">
          <h3 className="font-bold text-lg text-gray-900 mb-3 font-['Archivo_Black']">
            Quick Links
          </h3>
          <div className="space-y-2">
            <Link 
              href="/"
              className="block text-cyan-600 hover:text-cyan-800 font-medium text-sm transition-colors"
            >
              Home
            </Link>
            <a 
              href="/results"
              className="block text-cyan-600 hover:text-cyan-800 font-medium text-sm transition-colors"
            >
              Results
            </a>
            <a 
              href="/teams"
              className="block text-cyan-600 hover:text-cyan-800 font-medium text-sm transition-colors"
            >
              Teams
            </a>
            <a 
              href="/committee"
              className="block text-cyan-600 hover:text-cyan-800 font-medium text-sm transition-colors"
            >
              Committee
            </a>
          </div>
        </div>

        {/* Blinking Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-center text-sm text-yellow-800">
            <span className="animate-pulse font-semibold">🏆</span>
            <span className="mx-2 font-medium">Results are Live!</span>
            <span className="animate-pulse font-semibold">🏆</span>
          </p>
        </div>

      </div>
    </div>
  )
}