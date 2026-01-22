"use client";

import { motion } from "framer-motion";
import {
  Newspaper,
  Quote,
  ArrowRight,
  ExternalLink,
  Mic,
  Trophy,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

interface PressMention {
  id: string;
  publication: string;
  logo: string;
  quote: string;
  date: string;
  link: string;
  color: string;
}

interface SpeakingEvent {
  id: string;
  event: string;
  role: string;
  year: string;
  location: string;
}

const pressMentions: PressMention[] = [
  {
    id: "1",
    publication: "Forbes Travel",
    logo: "F",
    quote: "Muthamilselvi Narayanan is redefining adventure tourism in India with her sustainable approach and unwavering commitment to safety.",
    date: "March 2024",
    link: "#",
    color: "text-blue-700",
  },
  {
    id: "2",
    publication: "National Geographic",
    logo: "NG",
    quote: "Seven summits achiever brings world-class expedition standards to Indian Himalayas, making dreams accessible to everyday adventurers.",
    date: "January 2024",
    link: "#",
    color: "text-yellow-600",
  },
  {
    id: "3",
    publication: "The Times of India",
    logo: "TOI",
    quote: "From classroom to Everest: The inspiring journey of India's pioneering female mountaineer and expedition leader.",
    date: "November 2023",
    link: "#",
    color: "text-slate-800",
  },
];

const speakingEvents: SpeakingEvent[] = [
  {
    id: "1",
    event: "TEDx Speaker",
    role: "Keynote Speaker",
    year: "2023",
    location: "Chennai",
  },
  {
    id: "2",
    event: "Adventure Tourism Summit",
    role: "Panel Expert",
    year: "2024",
    location: "New Delhi",
  },
  {
    id: "3",
    event: "Women in Sports Conclave",
    role: "Guest of Honor",
    year: "2024",
    location: "Mumbai",
  },
];

const logos = [
  { name: "Forbes", color: "text-blue-700" },
  { name: "Nat Geo", color: "text-yellow-600" },
  { name: "Times of India", color: "text-slate-700" },
  { name: "Outlook", color: "text-purple-600" },
  { name: "Conde Nast", color: "text-teal-600" },
  { name: "Lonely Planet", color: "text-blue-800" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

export function PressMediaSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-teal-100 via-cyan-50 to-blue-50 py-10 md:py-16 lg:py-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] [background-size:32px_32px]" />

      <div className="relative container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="mb-8 text-center sm:mb-10 md:mb-12"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 sm:mb-5 sm:px-5 sm:py-2.5"
          >
            <Newspaper className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
            <span className="text-xs font-semibold text-purple-700 sm:text-sm">
              As Seen In
            </span>
          </motion.div>

          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Recognized by{" "}
            <span className="bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Leading Media
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
            Our commitment to excellence has been featured in leading publications
            and acknowledged by industry experts worldwide.
          </p>
        </motion.div>

        {/* Publication Logos Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 overflow-hidden rounded-2xl bg-white p-6 shadow-lg sm:mb-12 sm:rounded-3xl sm:p-8"
        >
          <p className="mb-5 text-center text-xs font-medium text-slate-500 uppercase tracking-wider sm:text-sm">
            Featured In
          </p>
          {/* Mobile: horizontal scroll - Desktop: flex wrap centered */}
          <div className="flex flex-wrap items-center justify-center gap-6 overflow-x-auto pb-2 sm:gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                className="flex-shrink-0 transition-transform hover:scale-110"
              >
                <span
                  className={`text-xl font-bold sm:text-2xl md:text-3xl ${logo.color}`}
                >
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Press Mentions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-10 grid grid-cols-1 gap-5 sm:mb-12 md:grid-cols-2 lg:gap-6 xl:grid-cols-3"
        >
          {pressMentions.map((mention) => (
            <motion.a
              key={mention.id}
              href={mention.link}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-xl sm:rounded-3xl sm:p-6"
            >
              {/* Publication Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 sm:h-14 sm:w-14`}>
                  <span className={`text-lg font-bold ${mention.color} sm:text-xl`}>
                    {mention.logo}
                  </span>
                </div>
                <ExternalLink className="h-5 w-5 text-slate-400 transition-colors group-hover:text-teal-500" />
              </div>

              {/* Quote */}
              <div className="mb-4 flex-1">
                <Quote className="mb-2 h-6 w-6 text-teal-200" />
                <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                  {mention.quote}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-500 sm:text-sm">{mention.date}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-teal-600 sm:text-sm">
                  Read More
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Speaking Events & Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 gap-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white sm:rounded-3xl sm:p-8 lg:grid-cols-2">
            {/* Speaking Events */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Mic className="h-5 w-5 text-teal-400 sm:h-6 sm:w-6" />
                <h3 className="text-lg font-bold sm:text-xl">Speaking Events</h3>
              </div>
              <div className="space-y-3">
                {speakingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white sm:text-base">
                        {event.event}
                      </p>
                      <p className="text-xs text-slate-300 sm:text-sm">
                        {event.role} • {event.location}, {event.year}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Awards & Recognition */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
                <h3 className="text-lg font-bold sm:text-xl">Awards</h3>
              </div>
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.8 }}
                  className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
                >
                  <p className="text-sm font-semibold text-amber-400 sm:text-base">
                    Best Adventure Tourism Operator 2024
                  </p>
                  <p className="text-xs text-slate-300 sm:text-sm">
                    India Tourism Excellence Awards
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.9 }}
                  className="rounded-xl bg-white/10 p-4 backdrop-blur-sm"
                >
                  <p className="text-sm font-semibold text-amber-400 sm:text-base">
                    Women Achiever Award
                  </p>
                  <p className="text-xs text-slate-300 sm:text-sm">
                    Recognized for contributions to mountaineering
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
