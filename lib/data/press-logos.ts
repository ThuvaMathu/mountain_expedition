export interface PressLogo {
  id: string;
  name: string;
  type: "print" | "digital" | "tv" | "radio";
  logo?: string; // Path to logo image if available
  url?: string; // Link to article/coverage
  color: string;
}

export const pressLogos: PressLogo[] = [
  {
    id: "toi",
    name: "Times of India",
    type: "digital",
    color: "text-gray-800",
    url: "https://timesofindia.indiatimes.com/",
  },
  {
    id: "vikatan",
    name: "Aval Vikatan",
    type: "print",
    color: "text-orange-600",
  },
  {
    id: "puthiya",
    name: "Puthiya Thalaimurai",
    type: "tv",
    color: "text-red-600",
  },
  {
    id: "dinamalar",
    name: "Dinamalar",
    type: "print",
    color: "text-red-700",
  },
  {
    id: "dinathanthi",
    name: "Dina Thanthi",
    type: "print",
    color: "text-yellow-600",
  },
  {
    id: "sun",
    name: "Sun News",
    type: "tv",
    color: "text-red-500",
  },
];

export const partnerLogos: PressLogo[] = [
  {
    id: "aeta",
    name: "AETA",
    type: "digital",
    color: "text-teal-700",
  },
  {
    id: "tata",
    name: "Tata Steel",
    type: "digital",
    color: "text-blue-800",
  },
  {
    id: "govt",
    name: "Govt of Tamil Nadu",
    type: "digital",
    color: "text-blue-900",
  },
];
