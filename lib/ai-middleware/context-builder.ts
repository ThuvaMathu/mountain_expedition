/**
 * Context Builder - Fetches and formats context data for the AI
 * - Packages and tours
 * - Contact information
 * - FAQs
 * - Company stats
 */

/**
 * Format packages into a concise context string for the AI
 */
export function formatPackagesContext(packages: TMountainType[]): string {
  if (!packages || packages.length === 0) {
    return "No packages currently available.";
  }

  // Group by category and type
  const domesticTrekking = packages.filter(p => p.category === 'domestic' && p.type === 'trekking');
  const internationalTrekking = packages.filter(p => p.category === 'international' && p.type === 'trekking');
  const tours = packages.filter(p => p.type === 'tour');

  let context = "### AVAILABLE PACKAGES (Live Availability Data)\n\n";

  const formatPackageLine = (pkg: TMountainType) => {
    const price = pkg.priceINR ? `₹${pkg.priceINR.toLocaleString()}` : pkg.priceUSD ? `$${pkg.priceUSD}` : 'Enquire';
    
    // Format dates: Take next 3 dates
    let datesStr = "";
    if (pkg.availableDates && pkg.availableDates.length > 0) {
      const nextDates = pkg.availableDates.slice(0, 3).map(d => d.date).join(", ");
      datesStr = ` | Dates: ${nextDates}${pkg.availableDates.length > 3 ? '...' : ''}`;
    } else {
      datesStr = " | Dates: Contact for details";
    }

    return `- ${pkg.name} (${pkg.difficulty}, ${pkg.duration}): ${price} | Slots: ${pkg.availableSlots}${datesStr}\n`;
  };

  // Domestic trekking
  if (domesticTrekking.length > 0) {
    context += `**Domestic Treks (${domesticTrekking.length}):**\n`;
    domesticTrekking.slice(0, 5).forEach(pkg => {
      context += formatPackageLine(pkg);
    });
    context += "\n";
  }

  // International trekking
  if (internationalTrekking.length > 0) {
    context += `**International Expeditions (${internationalTrekking.length}):**\n`;
    internationalTrekking.slice(0, 5).forEach(pkg => {
      context += formatPackageLine(pkg);
    });
    context += "\n";
  }

  // Tours
  if (tours.length > 0) {
    context += `**Tours (${tours.length}):**\n`;
    tours.slice(0, 3).forEach(pkg => {
      context += formatPackageLine(pkg);
    });
  }

  return context;
}

/**
 * Format contact information for the AI
 */
export function formatContactContext(contact: TContactDetails): string {
  if (!contact) return "Contact information not available.";

  return `### CONTACT INFORMATION
- Email: ${contact.email}
- Phone: ${contact.phone}
- Emergency: ${contact.emergencyPhone}
- Address: ${contact.address}
${contact.socialMedia?.instagram ? `- Instagram: ${contact.socialMedia.instagram}` : ''}`;
}

/**
 * Format FAQs for the AI
 */
export function formatFAQsContext(faqs: FAQ[], limit: number = 10): string {
  if (!faqs || faqs.length === 0) return "";

  let context = "### FREQUENTLY ASKED QUESTIONS\n\n";
  faqs.slice(0, limit).forEach((faq, index) => {
    context += `Q${index + 1}: ${faq.question}\nA: ${faq.answer}\n\n`;
  });

  return context;
}

/**
 * Format company stats for the AI
 */
export function formatStatsContext(stats?: TStat[]): string {
  if (!stats || stats.length === 0) {
    return "### COMPANY STATS\n- 15+ Years of Experience\n- 97% Summit Success Rate\n- 500+ Successful Expeditions\n- 50+ Expert Guides";
  }

  let context = "### COMPANY STATS\n";
  stats.slice(0, 6).forEach(stat => {
    context += `- ${stat.title}: ${stat.value}\n`;
  });

  return context;
}

/**
 * Build complete AI context from all data sources
 */
export function buildAIContext(data: {
  packages: TMountainType[];
  contact: TContactDetails;
  faqs: FAQ[];
  stats?: TStat[];
}): string {
  const { packages, contact, faqs, stats } = data;

  let context = "=== TAMIL ADVENTURE CLUB - CONTEXT DATA ===\n\n";

  // Add company overview
  context += "Tamil Adventure Club is a premier trekking company with 15+ years of experience organizing safe and successful expeditions in the Indian Himalayas and international peaks.\n\n";

  // Add packages
  context += formatPackagesContext(packages) + "\n";

  // Add contact info
  context += formatContactContext(contact) + "\n";

  // Add FAQs
  if (faqs && faqs.length > 0) {
    context += formatFAQsContext(faqs, 8) + "\n";
  }

  // Add stats
  context += formatStatsContext(stats) + "\n";

  context += "=== END CONTEXT ===";

  return context;
}

/**
 * Extract relevant packages based on user query
 * This helps the AI provide specific package recommendations
 */
export function getRelevantPackages(
  query: string,
  allPackages: TMountainType[],
  limit: number = 5
): TMountainType[] {
  const lowerQuery = query.toLowerCase();
  const difficulty = ['beginner', 'intermediate', 'advanced', 'expert'].find(d => lowerQuery.includes(d));

  return allPackages
    .filter(p => p.status === 'active' || p.status === undefined)
    .filter(p => {
      // Match difficulty if specified
      if (difficulty && p.difficulty.toLowerCase() !== difficulty) return false;

      // Match category keywords
      if (lowerQuery.includes('domestic') || lowerQuery.includes('india')) {
        return p.category === 'domestic';
      }
      if (lowerQuery.includes('international')) {
        return p.category === 'international';
      }
      if (lowerQuery.includes('tour') && !lowerQuery.includes('trek')) {
        return p.type === 'tour';
      }
      if (lowerQuery.includes('trek')) {
        return p.type === 'trekking';
      }

      return true;
    })
    .slice(0, limit);
}

/**
 * Format specific packages for AI response
 */
export function formatPackagesForResponse(packages: TMountainType[]): string {
  if (packages.length === 0) return "";

  let response = "\n\n**Recommended Packages:**\n\n";
  packages.forEach(pkg => {
    const price = pkg.priceINR
      ? `Starting from ₹${(pkg.priceINR / 1000).toFixed(0)}k`
      : pkg.priceUSD
      ? `Starting from $${pkg.priceUSD}`
      : "Contact for pricing";

    response += `• **${pkg.name}** (${pkg.duration})\n`;
    response += `  ${pkg.location} • ${pkg.difficulty} difficulty\n`;
    response += `  ${price}\n\n`;
  });

  return response;
}
