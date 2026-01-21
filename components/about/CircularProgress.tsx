"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { LucideIcon, icons } from "lucide-react";

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  icon: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  suffix?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Mountain: icons.Mountain,
  Clock: icons.Clock,
  Award: icons.Award,
  Target: icons.Target,
  Globe: icons.Globe,
  Trophy: icons.Trophy,
  Flag: icons.Flag,
  CircleCheck: icons.CircleCheck,
};

const sizeClasses = {
  sm: { wrapper: "w-24 h-24 md:w-28 md:h-28", text: "text-lg md:text-xl" },
  md: { wrapper: "w-32 h-32 md:w-40 md:h-40", text: "text-xl md:text-2xl" },
  lg: { wrapper: "w-36 h-36 md:w-44 md:w-48", text: "text-2xl md:text-3xl" },
};

const colorMap: Record<string, { stroke: string; text: string; ring: string }> = {
  teal: { stroke: "stroke-teal-500", text: "text-teal-600", ring: "ring-teal-100" },
  blue: { stroke: "stroke-blue-500", text: "text-blue-600", ring: "ring-blue-100" },
  purple: { stroke: "stroke-purple-500", text: "text-purple-600", ring: "ring-purple-100" },
  amber: { stroke: "stroke-amber-500", text: "text-amber-600", ring: "ring-amber-100" },
  rose: { stroke: "stroke-rose-500", text: "text-rose-600", ring: "ring-rose-100" },
};

export function CircularProgress({
  value,
  max,
  label,
  icon,
  color = "teal",
  size = "md",
  suffix = "",
}: CircularProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);

  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 54; // radius of 54
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const colors = colorMap[color] || colorMap.teal;
  const sizeClass = sizeClasses[size];
  const Icon = iconMap[icon] || icons.Award;

  useEffect(() => {
    if (isInView) {
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setProgress(percentage * eased);
        setCount(value * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [isInView, percentage, value]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className={`${sizeClass.wrapper} relative`}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${colors.stroke} transition-all duration-1000 ease-out`}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${colors.ring} rounded-full p-2 mb-1`}>
            <Icon className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div className={`${colors.text} ${sizeClass.text} font-bold tabular-nums`}>
            {Math.floor(count)}
            {suffix}
          </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="font-semibold text-gray-900 text-sm">{label}</div>
        {max > 1 && (
          <div className="text-xs text-gray-500">of {max} {suffix === "m" ? "meters" : ""}</div>
        )}
      </div>
    </div>
  );
}
