import type { Metadata } from "next"
import Script from "next/script"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "About N. Muthamizh Selvi | Seven Summits Pioneer from Tamil Nadu",
  description:
    "Discover the inspiring journey of N. Muthamizh Selvi (Muthamil Selvi Narayanan), the first person from Tamil Nadu to complete the Seven Summits, culminating with Denali on June 16, 2025.",
  openGraph: {
    title: "About N. Muthamizh Selvi | Seven Summits Pioneer from Tamil Nadu",
    description:
      "Founder story, Seven Summits timeline, Denali near-death resilience, achievements, goals, and CTAs to support and get involved.",
    url: "https://example.com/about",
    type: "profile",
    images: [
      {
        url: "/placeholder-vwjca.png",
        width: 1200,
        height: 630,
        alt: "N. Muthamizh Selvi - Seven Summits Banner",
      },
    ],
  },
}

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "N. Muthamizh Selvi",
    alternateName: ["Muthamil Selvi Narayanan"],
    description: "First person from Tamil Nadu to complete the Seven Summits; completed Denali on June 16, 2025.",
    jobTitle: "Mountaineer, Expedition Leader",
    url: "https://example.com/about",
    sameAs: [],
    knowsAbout: ["Mountaineering", "Seven Summits", "High-altitude climbing", "Expeditions"],
    achievement: [
      "Completed the Seven Summits",
      "Denali summit on June 16, 2025",
      "Everest summit in May 2023",
      "Resilience during severe storm on Denali",
    ],
  }

  const timeline = [
    {
      title: "Everest",
      date: "May 2023",
      location: "Nepal/China",
      summary: "Summited the world's highest peak after a multi-week expedition and acclimatization rotations.",
    },
    {
      title: "Elbrus",
      date: "July 2023",
      location: "Russia (Caucasus)",
      summary: "Efficient ascent in volatile weather windows across the Caucasus.",
    },
    {
      title: "Kilimanjaro",
      date: "Sept 2023",
      location: "Tanzania",
      summary: "Uhuru Peak via a high-altitude trek focused on sustainable pacing.",
    },
    {
      title: "Aconcagua",
      date: "Feb 2024",
      location: "Argentina (Andes)",
      summary: "South America's highest peak via a carefully staged acclimatization plan.",
    },
    {
      title: "Kosciuszko",
      date: "Mar 2024",
      location: "Australia",
      summary: "Oceanic summit completed as part of the Seven Summits objective.",
    },
    {
      title: "Vinson",
      date: "Dec 2024",
      location: "Antarctica",
      summary: "Remote polar expedition requiring meticulous logistics and cold-weather systems.",
    },
    {
      title: "Denali",
      date: "Jun 16, 2025",
      location: "USA (Alaska Range)",
      summary: "Final Seven Summits peak, completed after navigating storms and severe conditions.",
    },
  ]

  const awards = [
    {
      title: "Seven Summits Completion Certificate",
      image: "/awards/seven-summits-certificate.png",
      description: "Official recognition for completing all Seven Summits",
    },
    {
      title: "Tamil Nadu State Adventure Award",
      image: "/awards/tn-adventure-award.png",
      description: "State recognition for mountaineering achievements",
    },
    {
      title: "National Geographic Explorer Recognition",
      image: "/awards/natgeo-explorer.png",
      description: "Recognition from National Geographic Society",
    },
    {
      title: "Everest Summit Certificate",
      image: "/awards/everest-certificate.png",
      description: "Official summit certificate from Nepal Department of Tourism",
    },
    {
      title: "Women in Adventure Leadership Award",
      image: "/awards/women-leadership.png",
      description: "Recognition for inspiring women in outdoor adventures",
    },
    {
      title: "Denali Completion Medal",
      image: "/awards/denali-medal.png",
      description: "Medal commemorating the completion of Denali expedition",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <header className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-50 to-white" />
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-200">
                Seven Summits Pioneer
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">N. Muthamizh Selvi</h1>
              <p className="mt-3 text-lg text-gray-700">
                Also known as {'"'}Muthamil Selvi Narayanan{'"'}, she made history as the first person from Tamil Nadu
                to complete the Seven Summits, culminating with Denali on June 16, 2025. Reported by leading media, this
                milestone stands as a testament to resilience, leadership, and purpose-driven exploration.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#timeline"
                  className="inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-white shadow-sm hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  View Seven Summits Timeline
                </a>
                <a
                  href="#support"
                  className="inline-flex items-center justify-center rounded-md border border-teal-200 bg-white px-4 py-2 text-teal-700 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  Support Her Journey
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="/mountaineer-female-teal.png"
                alt="Portrait of N. Muthamizh Selvi on a snowy summit"
                className="aspect-[3/2] w-full rounded-xl object-cover shadow-lg ring-1 ring-gray-200"
              />
            </div>
          </div>
        </section>
      </header>

      <main>
        {/* Founder Story */}
        <section className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              <div className="relative overflow-hidden rounded-xl ring-1 ring-gray-200">
                <img
                  src="/mountaineer-crevasse-rescue.png"
                  alt="Training and preparation on glacier terrain"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Founder Story</h2>
                <p className="mt-4 text-gray-700">
                  From early treks in the Western Ghats to the world's loftiest peaks, Muthamizh's path has been shaped
                  by discipline, mentorship, and an unwavering belief in what determined preparation can achieve. Her
                  Seven Summits pursuit was built on inclusive leadership, sustainability practices, and elevating local
                  communities along each route.
                </p>
                <p className="mt-4 text-gray-700">
                  She embraces a simple philosophy: preparation is power, resilience is a daily choice, and impact is
                  measured by the lives uplifted along the way. Each climb was not only a personal endeavor, but also an
                  invitation for others—especially young people and women—to discover their own summits, literal or
                  metaphorical.
                </p>
                <div className="mt-6">
                  <a
                    href="#goals"
                    className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-white shadow-sm hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    See Vision & Goals
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seven Summits Timeline */}
        <section id="timeline" className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="md:flex md:items-end md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Seven Summits Timeline</h2>
              <p className="mt-2 max-w-2xl text-gray-600 md:mt-0">
                A focused, time-bound journey across continents, executed with precision logistics and safety-first
                decision-making.
              </p>
            </div>
            <ol className="mt-10 space-y-8">
              {timeline.map((item, idx) => (
                <li key={idx} className="relative pl-8">
                  <span className="absolute left-0 top-2 block h-5 w-5 rounded-full bg-teal-600 ring-4 ring-teal-100" />
                  <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-200">
                        {item.date}
                      </span>
                      <span className="text-sm text-gray-500">{item.location}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{item.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Denali Resilience */}
        <section className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Storm on Denali: A Near‑Death Ordeal</h2>
                <p className="mt-4 text-gray-700">
                  Denali demanded everything—technical discipline, patience, and mental fortitude. During a sudden
                  storm, whiteout conditions, high winds, and sub-zero wind chills forced critical decisions. A
                  carefully rehearsed emergency protocol—anchoring, shelter management, and systematic
                  communication—made the difference between catastrophe and survival.
                </p>
                <p className="mt-4 text-gray-700">
                  The aftermath didn't just end in a summit; it forged a deeper commitment to safety, teamwork, and
                  leadership under pressure. Resilience isn't the absence of fear—it's the ability to focus and act with
                  clarity when it matters most.
                </p>
              </div>
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-6">
                <h3 className="text-lg font-semibold text-teal-900">Resilience Highlights</h3>
                <ul className="mt-3 space-y-2 text-teal-900/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" />
                    Emergency shelter and anchor protocols executed under blizzard conditions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" />
                    Team coordination with clear role assignment and time checks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" />
                    Post-storm recovery plan prioritized safety and capacity to continue
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Achievements</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Seven Summits Completed</h3>
                <p className="mt-2 text-gray-700">Historic completion across seven continents, concluded on Denali.</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Everest – May 2023</h3>
                <p className="mt-2 text-gray-700">
                  A pinnacle achievement following disciplined acclimatization cycles.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Denali – June 16, 2025</h3>
                <p className="mt-2 text-gray-700">
                  Final summit achieved despite severe storms and complex conditions.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Leadership & Mentorship</h3>
                <p className="mt-2 text-gray-700">
                  Advocacy for women in the outdoors and inclusive expedition culture.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Safety & Sustainability</h3>
                <p className="mt-2 text-gray-700">
                  Prioritizing risk management and responsible environmental practices.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Community Impact</h3>
                <p className="mt-2 text-gray-700">Programs that inspire youth, students, and aspiring mountaineers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Awards Gallery */}
        <section className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Awards & Recognition</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Recognition from national and international organizations for mountaineering achievements and leadership
                in adventure sports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={award.image || "/placeholder.svg"}
                      alt={award.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">{award.title}</h3>
                    <p className="text-sm text-gray-200">{award.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Goals & Vision */}
        <section id="goals" className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Goals & Vision</h2>
                <ul className="mt-6 space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-teal-600" />
                    Expand mentorship for young climbers in Tamil Nadu and beyond with skills, safety, and leadership.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-teal-600" />
                    Promote responsible, sustainable trekking and expedition practices across all programs.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-teal-600" />
                    Build inclusive communities that empower women and first-time mountaineers to thrive outdoors.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-6">
                <h3 className="text-lg font-semibold text-teal-900">How You Can Help</h3>
                <p className="mt-2 text-teal-900/90">
                  Your support fuels training initiatives, safety education, and outreach. Get involved as a partner,
                  donor, or volunteer—and help shape the next generation of explorers.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="#support"
                    className="inline-flex items-center rounded-md bg-teal-600 px-4 py-2 text-white shadow-sm hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    Support Her Journey
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center rounded-md border border-teal-200 bg-white px-4 py-2 text-teal-700 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    Partner With Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Media & Gallery */}
        <section className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="md:flex md:items-end md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Media & Gallery</h2>
              <p className="mt-2 max-w-2xl text-gray-600 md:mt-0">
                Coverage highlights include major outlets such as Times of India. Explore moments from training climbs
                to summit pushes.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <img
                src="/everest-summit-ridge-teal.png"
                alt="Everest summit ridge"
                className="h-48 w-full rounded-lg object-cover ring-1 ring-gray-200"
              />
              <img
                src="/denali-storm-camp.png"
                alt="Denali storm near high camp"
                className="h-48 w-full rounded-lg object-cover ring-1 ring-gray-200"
              />
              <img
                src="/vinson-antarctica-team-camp.png"
                alt="Vinson Massif team camp"
                className="h-48 w-full rounded-lg object-cover ring-1 ring-gray-200"
              />
              <img
                src="/placeholder-9xipr.png"
                alt="Technical training on ice wall"
                className="h-48 w-full rounded-lg object-cover ring-1 ring-gray-200"
              />
            </div>
          </div>
        </section>

        {/* Support / Get Involved */}
        <section id="support" className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-8 sm:p-10 text-white shadow-lg">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Be Part of the Next Chapter</h2>
                  <p className="mt-3 text-teal-50">
                    Learn more about the Seven Summits journey, support upcoming initiatives, or get involved in
                    programs that equip the next generation of climbers.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/blog"
                    className="inline-flex items-center rounded-md bg-white px-4 py-2 font-medium text-teal-800 shadow-sm hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    Learn More
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center rounded-md border border-white/30 bg-transparent px-4 py-2 font-medium text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    Get Involved
                  </a>
                  <a
                    href="mailto:hello@example.com?subject=Support%20Muthamizh%20Selvi%27s%20Initiatives"
                    className="inline-flex items-center rounded-md bg-teal-900/40 px-4 py-2 font-medium text-white hover:bg-teal-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    Support Her Journey
                  </a>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              For press and speaking engagements, please reach out via the contact page.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      {/* Structured data for SEO */}
      <Script id="about-json-ld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </div>
  )
}
