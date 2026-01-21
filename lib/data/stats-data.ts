export interface StatItem {
  id: string;
  value: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
  bgColor: string;
  prefix?: string;
  suffix?: string;
  highlight?: boolean;
}

export const achievementStats: StatItem[] = [
  {
    id: "summits",
    value: "7",
    label: "Seven Summits",
    description: "Tallest peaks on all continents",
    icon: "Mountain",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    highlight: true,
  },
  {
    id: "days",
    value: "755",
    label: "Days to Complete",
    description: "Fastest Indian Woman Record",
    icon: "Clock",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    highlight: true,
  },
  {
    id: "first",
    value: "1",
    label: "Tamil Woman on Everest",
    description: "Historic achievement",
    icon: "Award",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    prefix: "First ",
  },
  {
    id: "height",
    value: "8848",
    label: "Highest Point",
    description: "Mount Everest summit",
    icon: "ArrowUp",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    suffix: "m",
  },
  {
    id: "awards",
    value: "12+",
    label: "Awards & Recognitions",
    description: "National & International",
    icon: "Trophy",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    id: "author",
    value: "1",
    label: "Bestselling Author",
    description: "Imayamathai Thotta sathanai Payanam",
    icon: "BookOpen",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    prefix: "Published ",
  },
];

export const heroStats: StatItem[] = [
  {
    id: "summits",
    value: "7",
    label: "Summits",
    icon: "Mountain",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    suffix: "/7",
  },
  {
    id: "days",
    value: "755",
    label: "Days",
    icon: "Clock",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    suffix: " days",
  },
  {
    id: "awards",
    value: "12",
    label: "Awards",
    icon: "Trophy",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    suffix: "+",
  },
  {
    id: "continents",
    value: "7",
    label: "Continents",
    icon: "Globe",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    suffix: "/7",
  },
];
