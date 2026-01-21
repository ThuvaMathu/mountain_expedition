"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { LucideIcon, icons } from "lucide-react";
import { StatItem } from "@/lib/data/stats-data";

interface StatCounterProps {
  stat: StatItem;
  delay?: number;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Mountain: icons.Mountain,
  Clock: icons.Clock,
  Award: icons.Award,
  ArrowUp: icons.ArrowUp,
  Trophy: icons.Trophy,
  BookOpen: icons.BookOpen,
  Globe: icons.Globe,
  Users: icons.Users,
  Shield: icons.Shield,
  ShieldCheck: icons.ShieldCheck,
  Building: icons.Building,
  Star: icons.Star,
};

function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(value * eased);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {typeof value === "number" && value % 1 !== 0
        ? count.toFixed(1)
        : Math.floor(count)}
      {suffix}
    </span>
  );
}

export function StatCounter({ stat, delay = 0, className = "" }: StatCounterProps) {
  const Icon = iconMap[stat.icon] || icons.Award;

  // Extract numeric value from stat.value (handles "12+", "755", etc.)
  const numericValue = parseFloat(stat.value.replace(/[^\d.]/g, "")) || 0;
  const suffix = stat.value.match(/[^\d.]+$/)?.[0] || "";
  const prefix = stat.prefix || "";

  return (
    <div
      className={`${stat.bgColor} rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <div
        className={`${stat.color} mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-sm`}
      >
        <Icon className="h-7 w-7" strokeWidth={2.5} />
      </div>
      <div className={`${stat.color} text-3xl md:text-4xl font-bold mb-2`}>
        <Counter value={numericValue} suffix={suffix} prefix={prefix} />
      </div>
      <div className="text-sm md:text-base font-semibold text-gray-900 mb-1">
        {stat.label}
      </div>
      {stat.description && (
        <div className="text-xs text-gray-600 max-w-[150px] mx-auto">
          {stat.description}
        </div>
      )}
    </div>
  );
}
