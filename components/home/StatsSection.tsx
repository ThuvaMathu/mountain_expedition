import { Mountain, Users, Award, Globe } from "lucide-react"

export function StatsSection() {
  const stats = [
    { icon: Mountain, number: "50+", label: "Mountains Conquered", description: "Across all seven continents" },
    { icon: Users, number: "2,000+", label: "Happy Climbers", description: "Successfully guided to summits" },
    { icon: Award, number: "15", label: "Years Experience", description: "In professional mountaineering" },
    { icon: Globe, number: "25+", label: "Countries", description: "Where we operate expeditions" },
  ]

  return (
    <section className="py-16 bg-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-xl font-semibold mb-1">{stat.label}</div>
              <div className="text-teal-100 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
