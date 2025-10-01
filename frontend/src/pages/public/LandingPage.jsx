import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Briefcase, 
  Shield,
  Zap,
  Globe,
  Award,
  TrendingUp
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Quick & Easy',
      description: 'Post jobs or find work in minutes with our streamlined platform'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe escrow system ensures you get paid for completed work'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with talented professionals from around the world'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Verified professionals with ratings and reviews'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      company: 'TechCorp',
      content: 'Prominis has revolutionized how we handle our marketing projects. The quality of work and speed of delivery is unmatched.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Freelance Developer',
      company: 'Independent',
      content: 'I\'ve found consistent, well-paying projects through Prominis. The platform makes it easy to showcase my skills and build relationships.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Content Creator',
      company: 'Creative Agency',
      content: 'The variety of projects available on Prominis keeps my work interesting and my income steady. Highly recommended!',
      rating: 5,
      avatar: 'ER'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Active Users' },
    { number: '50,000+', label: 'Jobs Completed' },
    { number: '$2M+', label: 'Paid to Workers' },
    { number: '4.9/5', label: 'Average Rating' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get Work Done with
              <span className="text-gradient block">Prominis</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The leading microjob marketplace connecting skilled professionals with businesses worldwide. 
              Post jobs, find talent, and get work done efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3 flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/about"
                className="btn-outline text-lg px-8 py-3"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Prominis?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the most efficient platform for microjobs with features that matter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started on Prominis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Requesters */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                For Requesters
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Post your job with clear requirements</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Review applications and choose the best fit</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Pay securely through our escrow system</span>
                </div>
              </div>
            </div>

            {/* For Taskers */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                For Taskers
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Browse jobs that match your skills</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Submit compelling proposals</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Deliver quality work and get paid</span>
                </div>
              </div>
            </div>

            {/* For Everyone */}
            <div className="text-center">
              <div className="w-20 h-20 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-warning-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Build Success
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Build your reputation with reviews</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Access analytics and insights</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Grow your business or career</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who trust Prominis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join Prominis today and discover a new way to work and hire talent
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

