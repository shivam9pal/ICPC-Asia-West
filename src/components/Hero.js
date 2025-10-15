import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            ICPC Asia West Continent
          </h1>
          <p className="mt-6 text-xl sm:text-2xl max-w-3xl mx-auto text-blue-100">
            The premier programming contest for university students across the Asia West region
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/results"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 transition-colors duration-200"
            >
              View Results
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-900 transition-colors duration-200"
            >
              Selected Teams
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="relative border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-blue-200 mt-2">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-blue-200 mt-2">Universities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">1500+</div>
              <div className="text-blue-200 mt-2">Teams</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}