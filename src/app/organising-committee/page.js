import Image from 'next/image'
import { Mail, MapPin, Code, Calendar, Users, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react' // Importing icons for better visual design



export const metadata = {
  title: 'Organising Committee & Contacts - ICPC Asia West Continent',
  description: 'Meet the key contacts and core teams for the ICPC Asia West Continent Championship at GLA University. Find venue and logistics information.',
}

// --- Component for individual person card (Small) ---
function PersonCard({ name, title, org, initialsColor = 'from-blue-500 to-red-500' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r text-white flex items-center justify-center font-semibold text-lg"
             style={{ backgroundImage: `linear-gradient(to right, ${initialsColor.split(' ')[0]}, ${initialsColor.split(' ')[2]})` }}>
          {initials}
        </div>
        <div className="flex-1">
          <div className="text-gray-900 font-bold">{name}</div>
          <div className="text-red-600 font-medium text-sm mb-2">{title}</div>
          <div className="text-gray-600 text-xs">{org}</div>
        </div>
      </div>
    </div>
  )
}

// --- Component for Leadership Card (Big with Image Placeholder) ---
function LeadershipCard({ name, title, org, imgSrc, description, initialsColor = 'from-blue-500 to-red-500' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl max-w-sm mx-auto p-8 text-center hover:shadow-xl transition-shadow duration-300">
      {/* Circular Avatar */}
      <div className="flex justify-center mb-6">
        {imgSrc ? (
          <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <Image
                src={imgSrc}
                alt={name}
                width={192}
                height={192}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        ) : (
          <div className="w-48 h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {initials}
          </div>
        )}
      </div>
      
      {/* Text Content */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-red-600 font-semibold mb-4">{title}</p>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        {description || org}
      </p>
      
      {/* Skill Tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">React</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Next.js</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Node.js</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Database Design</span>
      </div>
      
      {/* Social Icons */}
      <div className="flex justify-center gap-4">
        <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
          <Facebook className="w-5 h-5" />
        </a>
        <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
    </div>
  )
}

// --- Component for functional contact details ---
function ContactCard({ title, email, description, Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-md flex flex-col">
      <div className="flex items-center text-blue-700 mb-2">
        <Icon className="w-5 h-5 mr-2" />
        <h4 className="text-lg font-semibold">{title}</h4>
      </div>
      <a href={`mailto:${email}`} className="text-blue-500 hover:text-blue-600 font-medium break-words text-sm ml-7">
        {email}
      </a>
      <p className="text-gray-600 text-xs mt-2">{description}</p>
    </div>
  )
}

// --- Main Page Component ---
export default function OrganisingCommitteePage() {
  const coreTeam = [
    { name: "Suresh Chanda", title: "Contest Director", org: "GLA University", color: 'from-green-600 to-teal-600' },
    { name: "Priya Sharma", title: "Head of Technical Systems", org: "ICPC Regional Technical Team", color: 'from-purple-600 to-pink-600' },
    { name: "Vikram Singh", title: "Logistics and Hospitality Lead", org: "GLA University", color: 'from-orange-600 to-yellow-600' },
    { name: "Ritu Verma", title: "Volunteer Coordinator", org: "GLA Student Chapter", color: 'from-red-400 to-pink-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}

      {/* Hero */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Organising Committee</h1>
          <p className="text-xl text-gray-600">
            Dedicated to delivering a world-class ICPC Asia West Continent Championship experience.
          </p>
        </div>
      </section>

      <main className="pb-20 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* --- Championship Leadership (BIG CARDS) --- */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-200 pb-3 mb-8">Championship Leadership</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <LeadershipCard
                name="Phalguni"
                title="Chancellor Advisor"
                org="GLA University"
                description="Leading the strategic vision and academic excellence of the ICPC Asia West Continent Championship at GLA University."
                // Assuming image is at public/images/phalguni.jpg
                imgSrc="/images/phalguni.jpg" 
                initialsColor="from-gray-500 to-red-700"
              />
              <LeadershipCard
                name="Rohit Agrawal"
                title="Head, ICPC Asia West"
                org="Asia West Continent Championship"
                description="Overseeing the organization and coordination of the ICPC Asia West Continent Championship across all regional sites."
                // Assuming image is at public/images/rohit-agrawal.jpg
                imgSrc="/images/rohit-agrawal.jpg" 
                initialsColor="from-blue-600 to-purple-800"
              />
            </div>
          </section>

          

          {/* --- Venue & Logistics --- */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-200 pb-3 mb-8">Official Venue & Logistics</h2>
            <div className="bg-white rounded-2xl border border-blue-200 p-8 shadow-xl">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* GLA Logo */}
                <div className="flex-shrink-0 w-24 h-24 bg-blue-50 rounded-lg overflow-hidden flex items-center justify-center border border-blue-200">
                  <Image
                    src="/logos/gla-logo.png"
                    alt="GLA University Logo"
                    width={96}
                    height={96}
                    className="object-contain p-2"
                    priority
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                    <MapPin className="w-6 h-6 text-red-500 mr-2"/> Host: GLA University, Mathura
                  </h3>
                  <p className="text-gray-700 mt-2 mb-4 leading-relaxed">
                    The ICPC Asia West Continent Championship will be held at **GLA University, Mathura**, a globally recognised institution providing dedicated, world-class facilities to ensure a flawless competition experience.
                  </p>
                  
                  {/* Detailed Logistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Code className="w-5 h-5 text-green-600" />
                      <p><strong>Contest Venue:</strong> Main Computing Center, Block A.</p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <p><strong>Ceremonies:</strong> Viveka Auditorium (Capacity: 1500).</p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Users className="w-5 h-5 text-orange-600" />
                      <p><strong>Accommodation:</strong> On-campus housing blocks (details via email).</p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <p><strong>Venue Contact:</strong> <a href="mailto:icpc.logistics@gla.edu" className="text-blue-600 hover:underline">icpc.logistics@gla.edu</a></p>
                    </div>
                  </div>
                  <a href="/travel-guide" className="inline-flex mt-6 items-center text-lg font-semibold text-blue-700 hover:text-blue-800 transition">
                    View detailed Travel & Accommodation Guide →
                  </a>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* --- About ICPC Asia West (Updated) --- */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-200 pb-3 mb-8">About the Championship</h2>
            <div className="bg-blue-50 rounded-2xl border border-blue-300 p-8 shadow-inner">
              <h3 className="text-blue-900 font-extrabold text-2xl mb-3">ICPC Asia West & The Global Contest</h3>
              <p className="text-blue-900/90 leading-relaxed space-y-4 text-lg">
                <p>
                  The **International Collegiate Programming Contest (ICPC)** is the largest and most prestigious computer programming contest in the world, often referred to as the **"Olympics of Computer Programming"**. It is a global activity designed to provide college students with a vital opportunity to demonstrate and sharpen their problem-solving and computing skills.
                </p>
                <p>
                  The **ICPC Asia Regional Contests** invite Asian students to meet, establish friendships, and promote fair competition in programming. ICPC Asia West specifically organizes rigorous regional contests, culminating in this Continent Championship, to advance the top teams from the region toward the ultimate goal: the prestigious **ICPC World Finals**.
                </p>
                <p className="text-sm font-medium pt-2">
                  <span className="font-semibold">Global Sponsors:</span> **ICPC Foundation** is the Global Sponsor of this event, and **JetBrains** is the ICPC Global Programming Tools Sponsor.
                </p>
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* <Footer /> */}
    </div>
  )
}