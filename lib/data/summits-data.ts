export interface Summit {
  id: number;
  name: string;
  date: string;
  location: string;
  continent: string;
  height: string;
  heightMeters: number;
  summary: string;
  // Coordinates for world map positioning (percentage)
  mapX: number;
  mapY: number;
  // Thumbnail image
  image: string;
  // Order in the journey
  order: number;
}

export const summitsData: Summit[] = [
  {
    id: 1,
    name: "Everest",
    date: "23 May 2023",
    location: "Nepal/China",
    continent: "Asia",
    height: "8848 m",
    heightMeters: 8848,
    summary: "First woman from Tamil Nadu to summit. The beginning of the Seven Summits quest.",
    mapX: 72,
    mapY: 38,
    image: "/images/summits/everest.jpg",
    order: 1,
  },
  {
    id: 2,
    name: "Elbrus",
    date: "21 Jul 2023",
    location: "Russia",
    continent: "Europe",
    height: "5642 m",
    heightMeters: 5642,
    summary: "Europe's highest peak conquered as part of the Seven Summits challenge.",
    mapX: 58,
    mapY: 28,
    image: "/images/summits/elbrus.jpg",
    order: 2,
  },
  {
    id: 3,
    name: "Kilimanjaro",
    date: "12 Sept 2023",
    location: "Tanzania",
    continent: "Africa",
    height: "5895 m",
    heightMeters: 5895,
    summary: "Successfully summited the rooftop of Africa.",
    mapX: 52,
    mapY: 60,
    image: "/images/summits/kilimanjaro.jpg",
    order: 3,
  },
  {
    id: 4,
    name: "Aconcagua",
    date: "13 Feb 2024",
    location: "Argentina",
    continent: "South America",
    height: "6962 m",
    heightMeters: 6962,
    summary: "Reached the summit of the highest peak in South America.",
    mapX: 28,
    mapY: 65,
    image: "/images/summits/aconcagua.jpg",
    order: 4,
  },
  {
    id: 5,
    name: "Kosciuszko",
    date: "17 Mar 2024",
    location: "Australia",
    continent: "Australia",
    height: "2228 m",
    heightMeters: 2228,
    summary: "Conquered the highest peak on the Australian continent.",
    mapX: 88,
    mapY: 75,
    image: "/images/summits/kosciuszko.jpg",
    order: 5,
  },
  {
    id: 6,
    name: "Vinson",
    date: "22 Dec 2024",
    location: "Antarctica",
    continent: "Antarctica",
    height: "4892 m",
    heightMeters: 4892,
    summary: "Successfully reached the summit of Mount Vinson in Antarctica.",
    mapX: 32,
    mapY: 88,
    image: "/images/summits/vinson.jpg",
    order: 6,
  },
  {
    id: 7,
    name: "Denali",
    date: "16 Jun 2025",
    location: "USA",
    continent: "North America",
    height: "6190 m",
    heightMeters: 6190,
    summary: "Final peak completing Seven Summits in record 2 years 25 days.",
    mapX: 18,
    mapY: 30,
    image: "/images/summits/denali.jpg",
    order: 7,
  },
];

// Total journey stats
export const journeyStats = {
  totalSummits: 7,
  totalDays: 755,
  totalYears: 2,
  totalHeightMeters: 39657, // Sum of all peaks
  totalHeightKilometers: 39.66,
  continents: 7,
};

// Journey timeline for progress indicator
export const journeyTimeline = [
  { date: "May 2023", event: "Everest Summit", completed: true },
  { date: "Jul 2023", event: "Elbrus Summit", completed: true },
  { date: "Sep 2023", event: "Kilimanjaro Summit", completed: true },
  { date: "Feb 2024", event: "Aconcagua Summit", completed: true },
  { date: "Mar 2024", event: "Kosciuszko Summit", completed: true },
  { date: "Dec 2024", event: "Vinson Summit", completed: true },
  { date: "Jun 2025", event: "Denali Summit - Record Complete", completed: true },
];
