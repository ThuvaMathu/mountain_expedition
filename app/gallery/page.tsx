import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const images = [
  { src: "/everest-base-camp.png", title: "Everest Base Camp" },
  { src: "/placeholder-hbowb.png", title: "Kilimanjaro Summit" },
  { src: "/denali-ridge.png", title: "Denali Ridge" },
  { src: "/himalaya-valley.png", title: "Himalayan Valley" },
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow overflow-hidden">
              <img src={img.src || "/placeholder.svg"} alt={img.title} className="w-full h-48 object-cover" />
              <div className="p-3 text-gray-800 font-medium">{img.title}</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
