import { 
  Target, 
  Users, 
  Globe, 
  Award, 
  Heart,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react'

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To democratize access to work opportunities by connecting skilled professionals with businesses worldwide through our innovative microjob marketplace.'
    },
    {
      icon: Lightbulb,
      title: 'Vision',
      description: 'A world where anyone can find meaningful work and businesses can access top talent instantly, regardless of location or traditional barriers.'
    },
    {
      icon: Heart,
      title: 'Values',
      description: 'We believe in fairness, transparency, and empowering individuals to build successful careers while helping businesses thrive.'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former tech executive with 15+ years in marketplace platforms',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Full-stack engineer passionate about scalable systems',
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'UX designer focused on creating intuitive user experiences',
      avatar: 'ER'
    },
    {
      name: 'David Kim',
      role: 'Head of Operations',
      bio: 'Operations expert with deep marketplace experience',
      avatar: 'DK'
    }
  ]

  const milestones = [
    {
      year: '2024',
      title: 'Prominis Launch',
      description: 'Platform launched with core microjob marketplace features'
    },
    {
      year: '2024',
      title: '10,000 Users',
      description: 'Reached our first major user milestone'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded to serve users in 50+ countries'
    },
    {
      year: '2025',
      title: 'Future Goals',
      description: 'AI-powered matching and advanced analytics'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-gradient">Prominis</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the future of work by connecting talented professionals 
              with businesses through our innovative microjob marketplace platform.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Prominis was born from a simple observation: the traditional job market 
                  was failing both workers and employers. Skilled professionals struggled 
                  to find meaningful work, while businesses couldn't access the talent 
                  they needed quickly and efficiently.
                </p>
                <p>
                  We envisioned a platform that would break down these barriers, creating 
                  a marketplace where microjobs could be posted, discovered, and completed 
                  with unprecedented speed and quality. Our platform combines the best of 
                  technology with human expertise to create opportunities for everyone.
                </p>
                <p>
                  Today, Prominis serves thousands of users worldwide, facilitating 
                  millions of dollars in transactions and helping professionals build 
                  successful careers while enabling businesses to scale efficiently.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
                    <div className="text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary-600 mb-2">50,000+</div>
                    <div className="text-gray-600">Jobs Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning-600 mb-2">$2M+</div>
                    <div className="text-gray-600">Paid to Workers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
                    <div className="text-gray-600">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Prominis, working to revolutionize the future of work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-semibold text-xl">
                    {member.avatar}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones in our mission to transform the world of work
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="card">
                      <div className="text-primary-600 font-bold text-lg mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Have questions about Prominis? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@prominis.com"
                className="btn-primary"
              >
                Contact Us
              </a>
              <a
                href="/register"
                className="btn-outline"
              >
                Join Prominis
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
