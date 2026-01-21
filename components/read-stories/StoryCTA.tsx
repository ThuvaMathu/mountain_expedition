import Link from "next/link";
import { ArrowRight, Mountain } from "lucide-react";

export function StoryCTA() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 text-white sm:rounded-3xl">
      <div className="flex items-center justify-center mb-4">
        <Mountain className="h-10 w-10 text-teal-400 sm:h-12 sm:w-12" />
      </div>

      <h3 className="text-xl font-bold text-center mb-2 sm:text-2xl md:text-3xl">
        Ready to Create Your Own Story?
      </h3>

      <p className="text-slate-300 text-center mb-6 text-sm sm:text-base">
        Join 500+ adventurers who achieved their mountain dreams with us.
        Your summit story is waiting to be written.
      </p>

      <div className="flex flex-col gap-3 sm:gap-4">
        <Link
          href="/trekking"
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-5 py-3 rounded-xl font-semibold text-center transition-all hover:from-teal-600 hover:to-cyan-600 hover:scale-105 sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-base"
        >
          Browse Expeditions
          <ArrowRight className="h-4 w-4 ml-2 inline-block" />
        </Link>

        <Link
          href="/contact"
          className="w-full border-2 border-teal-500 text-teal-400 hover:bg-teal-500/10 px-5 py-3 rounded-xl font-semibold text-center transition-colors sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-base"
        >
          Plan Custom Trip
        </Link>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-slate-700 flex flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 sm:text-sm">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-teal-400">97%</span> Summit Success
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-teal-400">15+ Years</span> Experience
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          Certified Guides
        </div>
      </div>
    </div>
  );
}
