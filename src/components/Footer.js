import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-stretch">
          
          {/* ICPC Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">ICPC Asia West Continent</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              The premier programming contest for university students across the Asia West region, 
              fostering algorithmic thinking and competitive programming excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Results
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Selected Teams
                </Link>
              </li>
              <li>
                <Link href="/committee" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Steering Committee
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>ICPC Asia West Championship</p>
              <p>Email: icpc.secretary@gmail.com</p>
              <p>
                <a 
                  href="https://icpc.global" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  Official ICPC Website
                </a>
              </p>
            </div>
          </div>

          {/* Right Side Image - Full Height */}
          <div className="flex items-center justify-center">
            <img
              src="/gla-logo.png"
              alt="ICPC Footer Image"
              className="w-full h-auto max-h-48 object-contain rounded-lg shadow-sm"
              onError={(e) => {
                console.log('Footer image failed to load');
                e.target.style.display = 'none';
              }}
            />
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ICPC Asia West Continent Championship. All rights reserved Technova Solutions Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  )
}
