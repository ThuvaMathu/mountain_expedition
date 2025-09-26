import { Users, Award, Globe, Calendar, MapPin, Mountain } from "lucide-react";

// 👇 map `id` → lucide icon
export const statIconMapper: Record<string, React.ComponentType<any>> = {
  "mountains-conquered": Mountain,
  "happy-climbers": Users,
  "years-experience": Award,
  countries: Globe,
  "successful-expeditions": Calendar,
  "base-camps-established": MapPin,
};
