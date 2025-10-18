import { staticGalleryImages } from "@/lib/data/static-images";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { localBusinessSchema, organizationSchema } from "@/seo/schemas";
import { generateAboutMetadata } from "@/seo/metadata/about";
import { Awards2 } from "./awards";
export const metadata = generateAboutMetadata();

export default function AboutPage() {
  const timeline = [
    {
      title: "Everest",
      date: "23 May 2023",
      location: "Asia",
      height: "8848 m",
      summary:
        "The first woman from Tamil Nadu to stand on top of Mount Everest. Her climb began the quest for the Seven Summits. [cite: 239, 308]",
    },
    {
      title: "Elbrus",
      date: "21 Jul 2023",
      location: "Europe",
      height: "5642 m",
      summary:
        "Conquered Europe's highest peak as part of the Seven Summits challenge. [cite: 251, 311]",
    },
    {
      title: "Kilimanjaro",
      date: "12 Sept 2023",
      location: "Africa",
      height: "5895 m",
      summary:
        "Successfully summited Mount Kilimanjaro in Africa. [cite: 251, 353]",
    },
    {
      title: "Aconcagua",
      date: "13 Feb 2024",
      location: "South America",
      height: "6962 m",
      summary:
        "Reached the summit of Aconcagua, the highest peak in South America. [cite: 251, 353]",
    },
    {
      title: "Kosciuszko",
      date: "17 Mar 2024",
      location: "Australia",
      height: "2228 m",
      summary:
        "Conquered Mount Kosciuszko, the highest peak on the Australian continent. [cite: 251, 353]",
    },
    {
      title: "Vinson",
      date: "22 Dec 2024",
      location: "Antarctica",
      height: "4892 m",
      summary:
        "Successfully reached the summit of Mount Vinson in Antarctica. [cite: 251, 353]",
    },
    {
      title: "Denali",
      date: "16 Jun 2025",
      location: "North America",
      height: "6190 m",
      summary:
        "Final peak of the Seven Summits, achieving the record as the fastest Indian woman to complete all seven summits in 2 years and 25 days (755 days). [cite: 240, 251, 252, 306]",
    },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <header className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-50 to-white" />
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* <div>
                <span className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-200">
                  Seven Summits Pioneer
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  N. Muthamizh Selvi
                </h1>
                <p className="mt-3 text-lg text-gray-700">
                  Also known as {'"'}Muthamil Selvi Narayanan{'"'}, she made
                  history as the first person from Tamil Nadu to complete the
                  Seven Summits, culminating with Denali on June 16, 2025.
                  Reported by leading media, this milestone stands as a
                  testament to resilience, leadership, and purpose-driven
                  exploration.
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
              </div> */}
            <div>
              <span className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-200">
                The Global Peak Warrior
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Muthamilselvi Narayanan
              </h1>
              <p className="mt-3 text-lg text-gray-700">
                She is the first woman from Tamil Nadu to conquer Mount Everest
                and complete the Seven Summits, the tallest peaks on all seven
                continents. She also holds the record as the fastest Indian
                woman to achieve this legendary feat in just 2 years and 25
                days. Her mission is to ignite courage in others, especially
                women, to face challenges and achieve victories.
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
            <div className="grid gap-10 md:grid-cols-2 md:gap-14 ">
              <div className="order-2 md:order-1 relative overflow-hidden rounded-xl ring-1 ring-gray-200">
                <img
                  src="/mountaineer-crevasse-rescue.png"
                  alt="Training and preparation on glacier terrain"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Her Journey: Breaking Fear
                </h2>
                <p className="mt-4 text-gray-700">
                  Muthamilselvi's incredible journey was about more than just
                  climbing; it was about breaking fear. Her philosophy centers
                  on courage, discipline, and determination, proving that no
                  summit is ever out of reach. She advocates that fear must
                  never decide the limits of our lives, using her Seven Summits
                  feat to inspire true resilience.
                </p>
                <p className="mt-4 text-gray-700">
                  As the fastest Indian woman to complete the Seven Summits, her
                  mission is to ignite courage in others, especially women. She
                  is a Japanese Interpreter and Author of the book "Imayamathai
                  Thotta sathanai Payanam", using her story to show how to face
                  challenges head-on and achieve victories in their homes,
                  careers, and personal dreams.
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
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Explore, Inspire, Conquer
              </h1>
              <p className="mt-4 text-gray-700">
                Tamil Adventure Trekking Club, inspired by N. MutamilSelvi,
                brings together people passionate about mountains and
                exploration. We create a community where members grow, learn,
                and trek responsibly, embracing resilience, camaraderie, and
                nature.
              </p>
              <p className="mt-4 text-gray-700">
                Join us to challenge yourself, share experiences, and discover
                new heights—both in the mountains and within your own journey.
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
                src="/logos/logo.png"
                alt="Portrait of N. Muthamizh Selvi on a snowy summit"
                className="aspect-[3/2] w-full rounded-xl object-contain shadow-lg ring-1 ring-gray-200"
              />
            </div>
          </div>
        </section>
        {/* Seven Summits Timeline */}
        <section id="timeline" className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="md:flex md:items-end md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Seven Summits Timeline
              </h2>
              <p className="mt-2 max-w-2xl text-gray-600 md:mt-0">
                A focused, time-bound journey across continents, executed with
                precision logistics and safety-first decision-making.
              </p>
            </div>
            <ol className="mt-10 space-y-8">
              {timeline.map((item, idx) => (
                <li key={idx} className="relative pl-8">
                  <span className="absolute left-0 top-2 block h-5 w-5 rounded-full bg-teal-600 ring-4 ring-teal-100" />
                  <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-200">
                        {item.date}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.location}
                      </span>
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
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Denali: The Ultimate Test of Will
                </h2>
                <p className="mt-4 text-gray-700">
                  Denali was the final peak in the Seven Summits quest,
                  completing the feat in a record 2 years and 25 days. Known for
                  its extreme cold and unpredictable weather, the mountain
                  demanded every ounce of her training and discipline.
                  Navigating severe storms, high winds, and technical ice was
                  critical, where resilience meant systematic execution and
                  unwavering mental fortitude.
                </p>
                <p className="mt-4 text-gray-700">
                  Achieving the summit on June 16, 2025, was not only a personal
                  triumph but an inspiration for others, especially young people
                  and women, to pursue their own goals with discipline and
                  determination. Her philosophy remains clear: success is born
                  from preparation, courage, and a relentless focus on the
                  mission.
                </p>
              </div>
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-6">
                <h3 className="text-lg font-semibold text-teal-900">
                  Achievement Highlights
                </h3>
                <ul className="mt-3 space-y-2 text-teal-900/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" />
                    Completed the Seven Summits in 2 years and 25 days.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" />
                    Fastest Indian woman to achieve the legendary Seven Summits
                    feat.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" />
                    First woman from Tamil Nadu to complete the world's 7
                    tallest peaks.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Achievements & Records
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Fastest Indian Woman to Conquer
                </h3>
                <p className="mt-2 text-gray-700">
                  Set a national record by completing the Seven Summits (the
                  tallest peaks on all seven continents) in just 2 years and 25
                  days.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  First Tamil Woman on Everest
                </h3>
                <p className="mt-2 text-gray-700">
                  Became the first woman from Tamil Nadu to successfully stand
                  atop Mount Everest (8848 m) on May 23, 2023.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Seven Summits Pioneer
                </h3>
                <p className="mt-2 text-gray-700">
                  Achieved the complete Seven Summits feat, concluding the
                  historic journey on Denali (6190 m) on June 16, 2025.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Author & Storyteller
                </h3>
                <p className="mt-2 text-gray-700">
                  Authored the book "Imayamathai Thotta sathanai Payanam,"
                  narrating her Everest expedition and mountaineering
                  accomplishments.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Professional Interpreter
                </h3>
                <p className="mt-2 text-gray-700">
                  Works professionally as a Japanese Interpreter & Trainer
                  (Freelancer), balancing a rigorous career with her
                  expeditions.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Inspirational Mission
                </h3>
                <p className="mt-2 text-gray-700">
                  Dedicated to inspiring women and youth to break fear and face
                  challenges head-on, in line with her mantra of courage and
                  discipline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Awards Gallery */}
        <Awards2 />
        {/* Goals & Vision */}
        <section id="goals" className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Goals & Vision
                </h2>
                <ul className="mt-6 space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-teal-600" />
                    Expand mentorship for young climbers in Tamil Nadu and
                    beyond with skills, safety, and leadership.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-teal-600" />
                    Promote responsible, sustainable trekking and expedition
                    practices across all programs.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-teal-600" />
                    Build inclusive communities that empower women and
                    first-time mountaineers to thrive outdoors.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-6">
                <h3 className="text-lg font-semibold text-teal-900">
                  How You Can Help
                </h3>
                <p className="mt-2 text-teal-900/90">
                  Your support fuels training initiatives, safety education, and
                  outreach. Get involved as a partner, donor, or volunteer—and
                  help shape the next generation of explorers.
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
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Media & Gallery
              </h2>
              <p className="mt-2 max-w-2xl text-gray-600 md:mt-0">
                Coverage highlights include major outlets such as Times of
                India. Explore moments from training climbs to summit pushes.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {staticGalleryImages.slice(0, 8).map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.title}
                  className="h-48 w-full rounded-lg object-cover ring-1 ring-gray-200"
                />
              ))}
            </div>{" "}
            <div className="text-center mt-12">
              <Link href="/gallery">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 bg-transparent"
                >
                  View All Images
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Support / Get Involved */}
        <section id="support" className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-8 sm:p-10 text-white shadow-lg">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Be Part of the Next Chapter
                  </h2>
                  <p className="mt-3 text-teal-50">
                    Learn more about the Seven Summits journey, support upcoming
                    initiatives, or get involved in programs that equip the next
                    generation of climbers.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/blog"
                    className="inline-flex items-center rounded-md bg-white px-8 py-2 font-medium text-teal-800 shadow-sm hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    Learn More
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center rounded-md border border-white/30 bg-transparent px-8 py-2 font-medium text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    Get Involved
                  </a>
                  {/* <a
                      href="mailto:hello@example.com?subject=Support%20Muthamizh%20Selvi%27s%20Initiatives"
                      className="inline-flex items-center rounded-md bg-teal-900/40 px-4 py-2 font-medium text-white hover:bg-teal-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      Support Her Journey
                    </a> */}
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              For press and speaking engagements, please reach out via the
              contact page.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
