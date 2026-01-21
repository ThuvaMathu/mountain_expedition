import {
  Package,
  HeartPulse,
  Calendar,
  MapPin,
  CreditCard,
  Users,
  HelpCircle,
  Zap,
  Wifi,
  Utensils,
  Globe,
  Briefcase,
  Award,
  Users2,
  Tent,
} from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: any; 
  category: string;
}

export const faqs: FAQItem[] = [
  // --- EXISTING FAQs ---
  {
    id: "1",
    question: "What's included in my trekking package?",
    answer: "Our comprehensive packages include: all meals during the trek (breakfast, lunch, dinner, evening snacks), high-quality camping equipment (tents, sleeping bags), certified trekking guides, porter support for shared equipment, first aid kit, permits and forest entry fees, and basic toilet facilities. Personal gear like clothing and boots are not included.",
    icon: Package,
    category: "Package",
  },
  {
    id: "food-1",
    question: "What kind of food is served during the trek?",
    answer: "We provide nutritious, freshly cooked vegetarian meals suited for high altitude. Breakfast includes porridge, eggs, bread/roti; Lunch is typically packed (roti/sabzi or rice item) or hot lunch at camp; Dinner is an elaborate spread with soup, rice, roti, dal, sabzi, and dessert. We accommodate vegan and gluten-free requests with prior notice.",
    icon: Utensils,
    category: "Package",
  },
  {
    id: "2",
    question: "What fitness level is required for these treks?",
    answer: "Fitness requirements vary by trek difficulty. For easy treks (like Kedarkantha), basic cardio fitness with 30 minutes of daily exercise for 2 weeks prior is sufficient. For moderate treks, we recommend 4-6 weeks of preparation including jogging, strength training, and weekend hikes. For difficult high-altitude treks, 8-12 weeks of preparation is recommended. We provide a detailed preparation guide upon booking.",
    icon: HeartPulse,
    category: "Health",
  },
  {
    id: "health-2",
    question: "How do you handle High Altitude Sickness (AMS)?",
    answer: "Our itineraries are designed with proper acclimatization days. Our guides are trained to recognize AMS symptoms early. We carry oximeters to check oxygen levels daily and have emergency oxygen cylinders on all high-altitude treks. If symptoms persist, we have strict descent protocols to bring the trekker to lower altitude immediately.",
    icon: HeartPulse,
    category: "Health",
  },
  {
    id: "3",
    question: "What is your cancellation and refund policy?",
    answer: "We offer flexible cancellation: Full refund if cancelled 30+ days before departure; 75% refund for 15-29 days; 50% refund for 7-14 days; no refund within 7 days. However, you can transfer your booking to a future trek (valid for 1 year) or transfer to another person with a nominal fee of \u20B9500. In case of cancellations by us due to weather or other factors, full refund is provided.",
    icon: Calendar,
    category: "Booking",    
  },
  {
    id: "4",
    question: "Do you provide trekking equipment or should I bring my own?",
    answer: "We provide all camping equipment including high-quality 4-season tents, sleeping bags rated for -10\u00B0C, sleeping mats, dining tents, and toilet tents. You need to bring personal clothing, trekking shoes, backpack, and water bottles. We also offer rental for premium equipment like down jackets, trekking poles, and gaiters at nominal rates. A detailed packing list is shared after booking.",
    icon: Package,
    category: "Equipment",
  },
  {
    id: "5",
    question: "How do I reach the base camp? Is transport arranged?",
    answer: "Transport to base camp is not included in the basic package but can be added as an option. For most treks, we organize shared vehicle pickup from nearest major cities at additional cost. Detailed travel instructions including bus routes, train options, and recommended stay locations are provided. Our team can also help coordinate travel among participants from the same city.",
    icon: MapPin,
    category: "Logistics",
  },
  {
    id: "logistics-2",
    question: "Is there electricity or charging points on the trek?",
    answer: "Electricity is usually available only at the base camp. Once we start trekking, there are no charging points at higher campsites. We highly recommend carrying a high-capacity power bank (10,000mAh or 20,000mAh) to keep your phone and camera batteries charged for the duration of the trek.",
    icon: Zap,
    category: "Logistics",
  },
  {
    id: "logistics-3",
    question: "Will my phone work on the trek?",
    answer: "Mobile network connectivity is intermittent. You will likely have good signal (Jio/Airtel/BSNL) at the base camp and some lower campsites. However, as we go higher, network coverage becomes patchy or non-existent. We recommend informing your family beforehand about the limited connectivity.",
    icon: Wifi,
    category: "Logistics",
  },
  {
    id: "6",
    question: "What payment options do you offer? Do you have EMI?",
    answer: "We accept all major payment methods: UPI (GPay, PhonePe, Paytm), credit/debit cards, net banking, and wallets. For bookings above \u20B910,000, we offer EMI options through select credit cards (no-cost EMI on leading banks). A 30% advance is required to confirm booking, with the balance due 15 days before the trek. International payments are also accepted.",
    icon: CreditCard,
    category: "Payment",
  },
  {
    id: "7",
    question: "How large are the trek groups? What if I'm solo?",
    answer: "Our group sizes typically range from 8-15 trekkers, with 1 lead guide and 1 assistant guide per 6-8 participants. This ensures personalized attention and safety. Solo travelers are welcome - many of our participants join alone! We can help connect you with other trekkers from your city before the trip. Private custom treks are available for groups of 6+.",
    icon: Users,
    category: "Group",
  },
  {
    id: "8",
    question: "What safety measures do you have for emergencies?",
    answer: "Safety is our top priority. All our guides are certified in wilderness first aid and carry comprehensive medical kits. We have satellite communication for remote areas, emergency evacuation protocols, and partnerships with nearby hospitals. All participants are insured for the trek duration. We conduct daily health checks and maintain a strict turnaround time policy for safety.",
    icon: HelpCircle,
    category: "Safety",
  },

  // --- TAMIL ADVENTURE TREKKING CLUB (Community) ---
  {
    id: "tamil-1",
    question: "Is 'Seven Cats Studio' a Tamil adventure trekking club?",
    answer: "Yes! We are a Chennai-based adventure community with deep roots in Tamil Nadu. Founded by Muthamilselvi, the first Tamil woman to summit Mt. Everest, we aim to bring the spirit of high-altitude mountaineering to the Tamil community while welcoming adventurers from across the globe.",
    icon: Users2,
    category: "Community",
  },
  {
    id: "tamil-2",
    question: "Do your trek leaders speak Tamil?",
    answer: "Absolutely. All our main trek leaders are fluent in Tamil, English, and Hindi. We understand that communication is key to comfort and safety, especially for first-time trekkers from Tamil Nadu who feel more at home speaking their mother tongue.",
    icon: Users,
    category: "Community",
  },
  {
    id: "tamil-3",
    question: "What makes your trekking club unique in Chennai?",
    answer: "We are the only trekking organization in Chennai led directly by an Everest SUMMITER. Unlike general travel agencies, we are technical mountaineers. We focus on skill transfer, not just sightseeing, ensuring every participant learns the basics of mountain survival and ethics.",
    icon: Award,
    category: "Community",
  },
  {
    id: "tamil-4",
    question: "Do you organize local treks around Tamil Nadu?",
    answer: "Yes, we organize weekend treks to the Western Ghats (Ooty, Kodaikanal, Yercaud) and Eastern Ghats throughout the year. These are perfect for beginners to build fitness before attempting Himalayan expeditions. Check our calendar for upcoming local events.",
    icon: MapPin,
    category: "Community",
  },
  {
    id: "tamil-5",
    question: "Is there a community for Tamil trekkers to connect?",
    answer: "We have a vibrant community of over 5,000+ Tamil trekkers. We host monthly meetups in Chennai, fitness workshops at local parks, and movie screenings. It's a great space to find trekking partners and share stories.",
    icon: Users2,
    category: "Community",
  },
  {
    id: "tamil-6",
    question: "Do you offer Tamil camping food on your treks?",
    answer: "While we prioritize nutritious meals suitable for altitude (often North Indian style), we always try to include touches of home comfort \u2013 be it proper 'South Indian Filter Coffee' in the mornings or 'Sambar Rice' on acclimatization days, logistics permitting.",
    icon: Utensils,
    category: "Community",
  },
  {
    id: "tamil-7",
    question: "How can I join the Seven Cats Studio trekking club?",
    answer: "Membership is open to all! You can join by subscribing to our newsletter, following our social media handles, or participating in any of our treks. We also have a premium membership tier offering discounts on gear rental and priority booking for peak-season batches.",
    icon: Users2,
    category: "Community",
  },
  {
    id: "tamil-8",
    question: "Do you support women trekkers from Tamil Nadu?",
    answer: "Empowering women is our core mission. Led by a female Everest summiters, we organize special 'Women-Only' batches to create a safe, supportive environment for women to experience the wilderness. We have mentored hundreds of solo female travelers from Chennai and beyond.",
    icon: HeartPulse,
    category: "Community",
  },
  {
    id: "tamil-9",
    question: "Are you registered as a tour operator in Chennai?",
    answer: "Yes, we are a fully registered private limited company based in Chennai, Tamil Nadu, compliant with all local tourism and taxation laws. You can visit our office in Velachery to discuss your travel plans in person.",
    icon: Briefcase,
    category: "Community",
  },
  {
    id: "tamil-10",
    question: "Do you conduct workshops for schools and colleges in Tamil Nadu?",
    answer: "We regularly conduct 'Introduction to Mountaineering' workshops for schools and colleges across Tamil Nadu. Our sessions cover outdoor leadership, environmental conservation, and basic survival skills, aiming to inspire the next generation of explorers.",
    icon: Award,
    category: "Community",
  },

  // --- TOURS AND TRAVELS (Services) ---
  {
    id: "tours-1",
    question: "Do you offer corporate outbound training packages?",
    answer: "Yes, we specialize in high-impact Corporate Outbound Training (OBT) programs in the Himalayas and Western Ghats. Our programs focus on leadership, team building, and resilience, tailored for corporate teams from startups to MNCs.",
    icon: Briefcase,
    category: "Services",
  },
  {
    id: "tours-2",
    question: "Can you create customized family holiday packages?",
    answer: "We curate exclusive family adventure holidays that blend comfort with mild adventure. From glamping in Manali to cultural tours in Ladakh, we ensure the itinerary is age-appropriate for children and seniors alike.",
    icon: Globe,
    category: "Services",
  },
  {
    id: "tours-3",
    question: "Do you handle flight bookings from Chennai/Bangalore?",
    answer: "As a full-service travel partner, we assist with domestic and international flight bookings, train reservations, and airport transfers. We can bundle these with your trekking package for a seamless door-to-door experience.",
    icon: Globe,
    category: "Services",
  },
  {
    id: "tours-4",
    question: "Do you organize educational industrial visits (IV)?",
    answer: "We organize educational tours and industrial visits for engineering and arts colleges tailored to combine learning with nature exploration. Popular destinations include Manali, Rishikesh, and Ooty, with approved safety standards and faculty support.",
    icon: Users2,
    category: "Services",
  },
  {
    id: "tours-5",
    question: "Do you offer honeymoon adventure packages?",
    answer: "For couples who love the outdoors, we offer 'Adventure Honeymoon' packages. Imagine a private candlelight dinner under the stars at 10,000 ft or a couple's paragliding session. We handle all privacy and luxury arrangements.",
    icon: HeartPulse,
    category: "Services",
  },
  {
    id: "tours-6",
    question: "Can we book a private jeep tour to Spiti or Ladakh?",
    answer: "Absolutely. Our 'Road Trip Expeditions' to Spiti Valley, Ladakh, and Nort East India are very popular. We provide reliable 4x4 vehicles, experienced mountain drivers, and curated stay experiences at homestays and boutique hotels.",
    icon: MapPin,
    category: "Services",
  },
  {
    id: "tours-7",
    question: "Do you provide visa assistance for international treks?",
    answer: "For our international expeditions (like Everest Base Camp in Nepal or Kilimanjaro in Africa), we provide full visa guidance and documentation support. For Nepal, we handle all permit paperwork mandated by the local government.",
    icon: Globe,
    category: "Services",
  },
  {
    id: "tours-8",
    question: "Do you have partnerships with luxury hotels?",
    answer: "We have partnered with handpicked luxury properties and boutique eco-lodges in all our base locations (Rishikesh, Leh, Manali). If you prefer a luxury stay before or after your rough trek, we can arrange upgrades at competitive rates.",
    icon: Tent,
    category: "Services",
  },
  {
    id: "tours-9",
    question: "Can you organize photography tours?",
    answer: "We host specialized landscape and astrophotography tours led by expert mentors. These itineraries are slower-paced, allowing ample time for setting up shots during golden hours and stargazing sessions at zero-light pollution zones.",
    icon: Award,
    category: "Services",
  },
  {
    id: "tours-10",
    question: "Why should I choose your travel agency over online portals?",
    answer: "Online portals sell generic products. We sell personalized experiences backed by human expertise. When you call us, you speak to a mountaineer who has walked the trail, not a call center agent. We offer 24/7 on-ground support and transparent pricing with no hidden costs.",
    icon: HelpCircle,
    category: "Services",
  },
];

export const faqCategories = [
  "All", 
  "Community", 
  "Services", 
  "Package", 
  "Health", 
  "Booking", 
  "Equipment", 
  "Logistics", 
  "Payment", 
  "Group", 
  "Safety"
];
