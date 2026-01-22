"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { faqs, faqCategories } from "@/lib/constants/faqs";

const categories = faqCategories;

export function FAQSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredFAQs = activeCategory === "All"
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const displayedFAQs = filteredFAQs.slice(0, visibleCount);
  const hasMore = filteredFAQs.length > visibleCount;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(5);
    setOpenItems(new Set());
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-10 md:py-14 lg:py-16"
    >
      {/* Background Elements */}
      <div className="absolute right-0 top-1/4 h-80 w-80 translate-x-1/2 rounded-full bg-amber-100/20 blur-3xl" />

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
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 sm:mb-5 sm:px-5 sm:py-2.5"
          >
            <HelpCircle className="h-4 w-4 text-teal-600 sm:h-5 sm:w-5" />
            <span className="text-xs font-semibold text-teal-700 sm:text-sm">
              Got Questions? We've Got Answers
            </span>
          </motion.div>

          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg">
            Everything you need to know before your adventure. Can't find what
            you're looking for? Our team is here to help.
          </p>
        </motion.div>

        {/* Category Pills - Horizontal Scroll on Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Mobile: Horizontal scroll - Desktop: Flex wrap centered */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide sm:flex-wrap sm:justify-center px-4 -mx-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all sm:text-sm ${activeCategory === category
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto max-w-3xl space-y-3"
        >
          <AnimatePresence mode="wait">
            {displayedFAQs.map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = openItems.has(faq.id);

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.05 * (index % 8) }}
                  className={`overflow-hidden rounded-xl border transition-all duration-300 sm:rounded-2xl ${isOpen
                    ? "border-teal-200 bg-teal-50/50 shadow-lg"
                    : "border-slate-200 bg-white"
                    }`}
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-start gap-3 p-4 text-left sm:gap-4 sm:p-5"
                  >
                    {/* Icon */}
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12 ${isOpen ? "bg-teal-500" : "bg-slate-100"
                      }`}>
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isOpen ? "text-white" : "text-slate-600"
                        }`} />
                    </div>

                    {/* Question */}
                    <div className="flex flex-1 items-center justify-between gap-2">
                      <h3 className={`text-sm font-semibold leading-snug sm:text-base ${isOpen ? "text-teal-700" : "text-slate-800"
                        }`}>
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform sm:h-6 sm:w-6 ${isOpen ? "rotate-180 text-teal-500" : ""
                          }`}
                      />
                    </div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pl-[4.5rem] sm:px-5 sm:pb-5 sm:pl-[5.5rem]">
                          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="group inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-teal-400 hover:text-teal-600"
            >
              <span>Load More Questions</span>
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        )}

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center sm:mt-12"
        >
          <div className="mx-auto max-w-xl rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-xl sm:rounded-3xl sm:p-8">
            <p className="mb-4 text-base font-semibold text-white sm:text-lg md:text-xl">
              Still have questions?
            </p>
            <p className="mb-5 text-sm text-slate-300 sm:text-base">
              Our team is available 24/7 to help you plan your perfect adventure.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-teal-600 hover:to-cyan-600 hover:scale-105 sm:py-3.5"
              >
                Call Us Now
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:py-3.5"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
