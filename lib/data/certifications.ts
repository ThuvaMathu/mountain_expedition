export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year?: string;
  icon: string;
  color: string;
  description?: string;
}

export const certifications: Certification[] = [
  {
    id: "iso",
    name: "ISO 9001:2015",
    issuer: "International Organization for Standardization",
    icon: "ShieldCheck",
    color: "text-green-600",
    description: "Quality Management System Certified",
  },
  {
    id: "govt-reg",
    name: "Government Registered",
    issuer: "Government of Tamil Nadu",
    icon: "Building",
    color: "text-blue-600",
    description: "Officially registered trekking organization",
  },
  {
    id: "aeta",
    name: "AETA Member",
    issuer: "Adventure Tour Operators Association of India",
    icon: "Users",
    color: "text-purple-600",
    description: "Member of Adventure Tour Operators Association",
  },
  {
    id: "insurance",
    name: "Insurance Covered",
    issuer: "National Insurance Provider",
    icon: "ShieldIcon",
    color: "text-teal-600",
    description: "Full coverage for all expeditions",
  },
];

export const govtRecognitions: Certification[] = [
  {
    id: "kalpana",
    name: "Kalpana Chawla Award",
    issuer: "Tamil Nadu State Government",
    year: "2023",
    icon: "Award",
    color: "text-amber-600",
    description: "Prestigious award for courage and daring enterprise",
  },
  {
    id: "cm-recognition",
    name: "CM Recognition & Support",
    issuer: "Government of Tamil Nadu",
    year: "2023",
    icon: "Star",
    color: "text-blue-700",
    description: "Honored by Chief Minister M.K. Stalin and Deputy CM Udhayanidhi Stalin",
  },
];
