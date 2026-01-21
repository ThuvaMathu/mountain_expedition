"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Users, Calendar } from "lucide-react";
import { certifications, govtRecognitions } from "@/lib/data/certifications";
import { pressLogos } from "@/lib/data/press-logos";
import { SlideUp } from "@/components/ui/motion-wrapper";
import { Marquee } from "@/components/ui/marquee";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Award,
  Users,
  Calendar,
};

export function TrustSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-8 md:py-10 lg:py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SlideUp className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 mb-2 md:mb-3 shadow-lg">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
            Trust & Recognition
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-xs md:text-sm">
            Certified, recognized, and trusted by government bodies and media organizations
          </p>
        </SlideUp>

        {/* Trust Marquee - Left to Right */}
        <SlideUp>
          <div className="relative mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
              <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-600" />
              <h3 className="font-semibold text-gray-900 text-xs md:text-sm">Certifications & Partners</h3>
            </div>
            <div className="relative bg-gradient-to-r from-teal-50/50 via-transparent to-teal-50/50 rounded-xl md:rounded-2xl py-3 md:py-4">
              <Marquee pauseOnHover>
                {certifications.map((cert) => {
                  const Icon = iconMap[cert.icon] || ShieldCheck;
                  return (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="mx-3 md:mx-4 w-48 md:w-64 flex-shrink-0"
                    >
                      <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-3 shadow-sm border border-teal-100">
                        <div className="flex items-center gap-1.5 md:gap-2">
                          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${cert.color} bg-opacity-10 flex items-center justify-center shrink-0`}>
                            <Icon className={`w-3 h-3 md:w-4 md:h-4 ${cert.color}`} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 text-[10px] md:text-xs truncate">{cert.name}</h4>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </Marquee>
            </div>
          </div>
        </SlideUp>

        {/* Media & Government Recognition - Compact */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-5">
          {/* Government Recognition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg md:rounded-xl p-3 md:p-4 lg:p-5 border border-amber-100"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
              <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600" />
              <h3 className="font-semibold text-gray-900 text-xs md:text-sm">Government Recognition</h3>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              {govtRecognitions.map((rec) => (
                <div key={rec.id} className="flex items-center gap-1.5 md:gap-2">
                  <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-[10px] md:text-xs font-medium text-gray-900">{rec.name}</p>
                    <p className="text-[10px] md:text-xs text-gray-600">{rec.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Media Coverage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 lg:p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
              <h3 className="font-semibold text-gray-900 text-xs md:text-sm">Media Coverage</h3>
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {pressLogos.map((press) => (
                <span
                  key={press.id}
                  className={`px-2 py-0.5 md:px-3 md:py-1 bg-gray-50 rounded-full text-[10px] md:text-xs font-semibold ${press.color}`}
                >
                  {press.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
