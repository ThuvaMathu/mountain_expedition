export const demoMountains: TMountainType[] = [
  {
    id: "demo_1",
    name: "Mount Everest",
    location: "Nepal/Tibet",
    altitude: 8849,
    difficulty: "Expert",
    bestSeason: "April-May, September-October",
    imageUrl: ["/images/mount-everest-summit.png"],
    price: 65000,
    rating: 4.9,
    totalReviews: 234,
    availableSlots: 30,
    description:
      "The world's highest peak, offering the ultimate mountaineering challenge.",
    longDescription:
      "Mount Everest, standing tall at 8,849 meters, is the highest mountain on Earth. Climbing Everest is a test of physical endurance and mental resilience, attracting mountaineers from all around the world.",
    duration: "60 days (including acclimatization)",
    groupSize: "Up to 10 climbers per expedition",
    included: [
      "Professional guide",
      "Base camp accommodation",
      "Meals during expedition",
      "Climbing permits",
      "Oxygen cylinders",
    ],
    notIncluded: [
      "International flights",
      "Personal climbing gear",
      "Travel insurance",
      "Visa fees",
    ],
    availableDates: [
      {
        date: "2024-05-15",
        slots: [
          {
            id: "slot_1",
            time: "04:00",
            maxParticipants: 8,
            bookedParticipants: 6,
            priceMultiplier: 1.2,
          },
          {
            id: "slot_2",
            time: "06:00",
            maxParticipants: 10,
            bookedParticipants: 8,
            priceMultiplier: 1.0,
          },
        ],
      },
      {
        date: "2024-05-20",
        slots: [
          {
            id: "slot_3",
            time: "05:00",
            maxParticipants: 12,
            bookedParticipants: 4,
            priceMultiplier: 1.0,
          },
        ],
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        description:
          "Arrive in Kathmandu, transfer to hotel, and attend a pre-expedition briefing with the guide team.",
        altitude: 1400,
      },
      {
        day: 50,
        title: "Summit Push",
        description:
          "Begin summit push at night, reaching the peak early morning for breathtaking views, then descend to Camp 4.",
        altitude: 8849,
      },
    ],
    safetyRating: "Good",
  },
  {
    id: "demo_2",
    name: "Mount Kilimanjaro",
    location: "Tanzania",
    altitude: 5895,
    difficulty: "Intermediate",
    bestSeason: "January-March, June-October",
    imageUrl: ["/images/mount-kilimanjaro.png"],
    price: 3500,
    rating: 4.7,
    totalReviews: 156,
    availableSlots: 45,
    description:
      "Africa's highest peak, known for its breathtaking landscapes and non-technical climb.",
    longDescription:
      "Mount Kilimanjaro is the tallest mountain in Africa and one of the most popular trekking destinations in the world. Its routes take you through lush rainforests, alpine deserts, and up to the icy summit of Uhuru Peak.",
    duration: "7 days",
    groupSize: "Up to 15 trekkers per group",
    included: [
      "Experienced trek leader",
      "Mountain huts/camping",
      "Meals during trek",
      "Park fees",
    ],
    notIncluded: [
      "Flights to Tanzania",
      "Tips for porters",
      "Travel insurance",
    ],
    availableDates: [
      {
        date: "2024-06-10",
        slots: [
          {
            id: "slot_1",
            time: "07:00",
            maxParticipants: 15,
            bookedParticipants: 10,
            priceMultiplier: 1.0,
          },
        ],
      },
      {
        date: "2024-09-05",
        slots: [
          {
            id: "slot_2",
            time: "07:30",
            maxParticipants: 12,
            bookedParticipants: 5,
            priceMultiplier: 1.1,
          },
        ],
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Moshi",
        description:
          "Meet the guide team, attend briefing, and prepare for trek.",
        altitude: 890,
      },
      {
        day: 3,
        title: "Shira Plateau",
        description: "Trek through moorland to reach the scenic Shira Plateau.",
        altitude: 3850,
      },
      {
        day: 6,
        title: "Summit Day",
        description:
          "Start early morning to reach Uhuru Peak for sunrise, then descend to base camp.",
        altitude: 5895,
      },
    ],
    safetyRating: "Good",
  },
];

export const demoPosts: TBlogPost[] = [
  {
    id: "1",
    title: "Conquering Everest: A Journey to the Top of the World",
    content: `
                <h2>The Ultimate Challenge</h2>
                <p>Standing at 29,032 feet above sea level, Mount Everest represents the ultimate challenge for any mountaineer. My journey to the summit in May 2023 was the culmination of years of preparation, training, and unwavering determination.</p>
                
                <h3>Preparation Phase</h3>
                <p>The preparation for Everest began months before the actual expedition. Physical conditioning, altitude training, and technical skill development were crucial components of my preparation strategy.</p>
                
                <h3>Base Camp to Summit</h3>
                <p>The journey from Base Camp to the summit involved multiple acclimatization rotations, each pushing the boundaries of human endurance. The final summit push was both physically and mentally demanding, requiring every ounce of strength and determination.</p>
                
                <h3>Lessons Learned</h3>
                <p>Everest taught me that preparation is everything, but adaptability is equally important. Weather conditions, team dynamics, and personal resilience all play crucial roles in determining success.</p>
              `,
    author: "N. Muthamizh Selvi",
    tags: ["Everest", "Himalayas", "Seven Summits"],
    slug: "conquering-everest-journey-top-world",
    mainImageUrl: "/blog/everest.png",
    desc: "",
    published: false,
  },
  {
    id: "2",
    title: "The Beauty and Challenge of the Himalayas",
    content: `
                <h2>A Land of Contrasts</h2>
                <p>The Himalayas offer some of the most spectacular and challenging terrain on Earth. From the bustling streets of Kathmandu to the serene silence of high-altitude camps, every step of the journey reveals new wonders.</p>
                
                <h3>Cultural Richness</h3>
                <p>The people of the Himalayas have developed a unique culture adapted to life at high altitude. Their resilience, hospitality, and deep connection to the mountains provide valuable lessons for any visitor.</p>
                
                <h3>Environmental Challenges</h3>
                <p>Climate change is having a significant impact on the Himalayan region. Glacial retreat, changing weather patterns, and increased unpredictability make mountaineering more challenging than ever.</p>
              `,
    author: "N. Muthamizh Selvi",
    tags: ["Himalayas", "Culture", "Adventure"],
    slug: "beauty-challenge-himalayas",
    mainImageUrl: "/blog/himalaya.png",
    desc: "",
    published: false,
  },
  {
    id: "3",
    title: "Denali: Surviving the Storm",
    content: `
                <h2>The Final Summit</h2>
                <p>Denali, the highest peak in North America, was the final mountain in my Seven Summits journey. What should have been a celebration nearly became a tragedy when a severe storm trapped our team near the summit.</p>
                
                <h3>The Storm Hits</h3>
                <p>The weather changed rapidly from clear skies to whiteout conditions. Wind speeds exceeded 60 mph, and temperatures dropped to life-threatening levels. Our carefully planned summit attempt became a fight for survival.</p>
                
                <h3>Emergency Protocols</h3>
                <p>Years of training and preparation kicked in as we implemented emergency protocols. Proper shelter construction, team communication, and systematic decision-making made the difference between life and death.</p>
                
                <h3>Lessons in Resilience</h3>
                <p>The experience on Denali reinforced that mountaineering is not just about reaching summits—it's about making smart decisions, supporting your team, and knowing when to push forward or retreat.</p>
                
                <h3>Completing the Seven Summits</h3>
                <p>Despite the challenges, we successfully summited Denali on June 16, 2025, completing my Seven Summits journey. This achievement represents not just personal accomplishment, but a testament to the power of preparation, teamwork, and perseverance.</p>
              `,
    author: "N. Muthamizh Selvi",
    tags: ["Denali", "Survival", "Resilience"],
    slug: "denali-surviving-storm",
    mainImageUrl: "/blog/denali.png",
    desc: "",
    published: false,
  },
];

export const mockMountain: TMountainType = {
  id: "",
  name: "Mount Everest",
  location: "Nepal/Tibet",
  altitude: 8849,
  difficulty: "Expert",
  bestSeason: "April - May",
  imageUrl: [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ],
  price: 65000,
  rating: 4.8,
  totalReviews: 234,
  availableSlots: 12,
  description:
    "The world's highest peak, offering the ultimate mountaineering challenge.",
  longDescription:
    "Mount Everest, standing at 8,849 meters above sea level, represents the pinnacle of mountaineering achievement. This expedition offers experienced climbers the opportunity to stand atop the world's highest peak. Our comprehensive program includes acclimatization rotations, expert Sherpa support, and all necessary equipment for a safe and successful summit attempt.",
  duration: "65 days",
  groupSize: "6-12 climbers",
  included: [
    "All permits and fees",
    "Experienced expedition leader",
    "Sherpa support (1:1 ratio)",
    "Base camp accommodation",
    "All meals during expedition",
    "Oxygen and medical supplies",
    "Satellite communication",
    "Airport transfers in Kathmandu",
  ],
  notIncluded: [
    "International flights",
    "Nepal visa fees",
    "Personal climbing equipment",
    "Travel insurance",
    "Personal expenses",
    "Tips for staff",
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival in Kathmandu",
      description: "Meet the team, gear check, and expedition briefing",
      altitude: 1400,
    },
    {
      day: 2,
      title: "Fly to Lukla, Trek to Phakding",
      description: "Scenic flight to Lukla and begin trek",
      altitude: 2610,
    },
    {
      day: 3,
      title: "Trek to Namche Bazaar",
      description: "Cross suspension bridges and climb to Sherpa capital",
      altitude: 3440,
    },
    // Add more days...
  ],
  safetyRating: "Good",
  availableDates: [],
};
