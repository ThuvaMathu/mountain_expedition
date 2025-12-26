import Link from "next/link";
import { ArrowRight, Mountain } from "lucide-react";

export function BlogCTA() {
    return (
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-center mb-4">
                <Mountain className="h-12 w-12" />
            </div>

            <h3 className="text-2xl font-bold text-center mb-3">
                Ready for Your Next Adventure?
            </h3>

            <p className="text-teal-100 text-center mb-6">
                Explore our mountain expeditions and start planning your journey to the summit.
            </p>

            <div className="flex flex-col gap-3">
                <Link
                    href="/mountains"
                    className="w-full bg-white text-teal-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold text-center transition-colors inline-flex items-center justify-center"
                >
                    Browse Expeditions
                    <ArrowRight className="h-5 w-5 ml-2" />
                </Link>

                <Link
                    href="/contact"
                    className="w-full border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                    Contact Us
                </Link>
            </div>
        </div>
    );
}
