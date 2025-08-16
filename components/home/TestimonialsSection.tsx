import { Star, Quote } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'California, USA',
      mountain: 'Mount Kilimanjaro',
      rating: 5,
      text: 'Summit Quest made my dream of climbing Kilimanjaro come true. The guides were incredible, and I felt safe every step of the way. Highly recommended!',
      image: '/placeholder.svg?height=80&width=80'
    },
    {
      name: 'Michael Chen',
      location: 'Singapore',
      mountain: 'Everest Base Camp',
      rating: 5,
      text: 'The Everest Base Camp trek was life-changing. The organization was flawless, and the team\'s expertise showed throughout the journey.',
      image: '/placeholder.svg?height=80&width=80'
    },
    {
      name: 'Emma Rodriguez',
      location: 'Madrid, Spain',
      mountain: 'Aconcagua',
      rating: 5,
      text: 'Professional, safe, and absolutely amazing experience. The Summit Quest team went above and beyond to ensure our success on Aconcagua.',
      image: '/placeholder.svg?height=80&width=80'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Climbers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our adventurers have to say about their experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 relative">
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                  <div className="text-sm text-blue-600">{testimonial.mountain}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
