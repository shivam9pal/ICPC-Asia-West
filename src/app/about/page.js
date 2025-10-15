import Image from 'next/image'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'About Us - ICPC Asia West Continent',
  description: 'Learn about the team behind the ICCP Asia West Championship platform, developed by Technova Solutions.',
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Abhay Pratap Singh',
      role: 'Full Stack Developer & Project Lead',
      image: '/team/abhay.jpg',
      bio: 'Passionate full-stack developer with expertise in React, Next.js, and modern web technologies. Leading the technical architecture of the ICPC platform.',
      skills: ['React', 'Next.js', 'Node.js', 'Database Design']
    },
    {
      name: 'Himanshu Patel',
      role: 'Frontend Developer & UI/UX Designer',
      image: '/team/himanshu.jpg',
      bio: 'Creative frontend developer specializing in user experience and responsive design. Crafting intuitive interfaces for competitive programming platforms.',
      skills: ['UI/UX Design', 'React', 'Tailwind CSS', 'Figma']
    },
    {
      name: 'Shivam Pal',
      role: 'Backend Developer & Database Specialist',
      image: '/team/shivam.jpg',
      bio: 'Backend specialist focusing on database optimization and API development. Ensuring robust and scalable solutions for championship management.',
      skills: ['Backend Development', 'Database', 'API Design', 'Supabase']
    }
  ]

  const projectFeatures = [
    {
      icon: '🏆',
      title: 'Championship Management',
      description: 'Complete system for managing ICPC Asia West championship sessions, results, and participants.'
    },
    {
      icon: '📊',
      title: 'Real-time Results',
      description: 'Dynamic results tracking and leaderboard management for live championship events.'
    },
    {
      icon: '🔧',
      title: 'Admin Dashboard',
      description: 'Comprehensive administrative interface for contest organizers and regional directors.'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Fully responsive platform accessible across all devices and screen sizes.'
    },
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with Supabase authentication and role-based access control.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Our Project
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Empowering competitive programming through innovative technology
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed">
              The ICPC Asia West Continent Championship platform is a comprehensive solution 
              designed to streamline contest management, team registration, and results tracking 
              for one of the world&apos;s most prestigious programming competitions.
            </p>
          </div>
        </div>
      </section> */}

      {/* Company Section
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-blue-600 text-white p-4 rounded-xl">
                <div className="text-3xl font-bold">TN</div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technova Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A forward-thinking technology agency specializing in modern web applications, 
              digital transformation, and innovative software solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At Technova Solutions, we believe in leveraging cutting-edge technology to solve 
                real-world challenges. Our team combines technical expertise with creative problem-solving 
                to deliver exceptional digital experiences.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Do</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  Custom Web Application Development
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  Contest & Event Management Platforms
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  Database Design & Optimization
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  Cloud Solutions & DevOps
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  UI/UX Design & Frontend Development
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-red-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🚀</span>
                  <span>Next.js 14 with App Router</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎨</span>
                  <span>Tailwind CSS for Modern Design</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🗄</span>
                  <span>Supabase for Backend & Auth</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  <span>Real-time Data Management</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🔐</span>
                  <span>Enterprise Security Standards</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📱</span>
                  <span>Fully Responsive Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Development Team
            </h2>
            <p className="text-xl text-gray-600">
              The talented developers behind the ICPC Asia West platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-red-100 flex items-center justify-center">
                  {/* Placeholder for team member photo */}
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools for managing competitive programming championships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack
      <section className="py-16 bg-gradient-to-r from-blue-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Built with Modern Technology
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold">Next.js 14</h3>
              <p className="text-sm opacity-90">React Framework</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-bold">Tailwind CSS</h3>
              <p className="text-sm opacity-90">Utility-first CSS</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl mb-2">🗄</div>
              <h3 className="font-bold">Supabase</h3>
              <p className="text-sm opacity-90">Backend & Auth</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <div className="text-2xl mb-2">☁</div>
              <h3 className="font-bold">Vercel</h3>
              <p className="text-sm opacity-90">Deployment</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Work with Technova Solutions?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Looking for custom web applications, contest management platforms, or digital transformation? 
            Let&apos;s discuss how we can help bring your vision to life.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-gray-300">technovasolution@gmail.com</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="font-bold mb-2">Services</h3>
              <p className="text-gray-300">Web Development & Digital Solutions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-bold mb-2">Expertise</h3>
              <p className="text-gray-300">Modern Tech Stack & Best Practices with Secure Solutions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}