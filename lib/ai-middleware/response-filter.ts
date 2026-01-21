import { OUT_OF_SCOPE_KEYWORDS } from "@/lib/ai-config";

/**
 * Response Filter - Validates and filters AI responses
 * - Ensures responses stay within scope
 * - Removes mentions of competitors
 * - Validates data accuracy
 * - Adds appropriate CTAs
 */

const COMPETITOR_KEYWORDS = [
  'thrillophilia',
  'travel triangle',
  'makemytrip',
  'yatra',
  'booking.com',
  'expedia',
  'tripadvisor',
  'thrilloc',
  // Add competitor names as needed
];

const UNSAFE_PATTERNS = [
  'we guarantee 100%',
  'completely risk-free',
  'no acclimatization needed',
  'no experience required for everest',
  // Add more unsafe claim patterns
];

/**
 * Check if response contains competitor mentions
 */
export function containsCompetitorMention(text: string): boolean {
  const lowerText = text.toLowerCase();
  return COMPETITOR_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

/**
 * Check if response contains unsafe claims
 */
export function containsUnsafeClaims(text: string): boolean {
  const lowerText = text.toLowerCase();
  return UNSAFE_PATTERNS.some(pattern => lowerText.includes(pattern));
}

/**
 * Check if response is within scope (trekking/adventure related)
 */
export function isResponseInScope(text: string): boolean {
  const lowerText = text.toLowerCase();

  // If response discusses out-of-scope topics at length
  const outOfScopeMentions = OUT_OF_SCOPE_KEYWORDS.filter(keyword =>
    lowerText.includes(keyword)
  );

  if (outOfScopeMentions.length >= 2) {
    return false;
  }

  // Valid trekking-related keywords
  const validKeywords = [
    'trek', 'trekking', 'mountain', 'peak', 'expedition', 'adventure',
    'himalaya', 'everest', 'kedar', 'roopkund', 'hampta', 'valley',
    'tour', 'package', 'booking', 'contact', 'price', 'cost',
    'duration', 'difficulty', 'safety', 'guide', 'camp', 'summit',
    'altitude', 'acclimat', 'training', 'fitness', 'gear', 'equipment',
    'season', 'weather', 'route', 'itinerary', 'group', 'departure'
  ];

  return validKeywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Clean and filter AI response
 */
export function filterResponse(response: string): {
  filtered: boolean;
  cleanedResponse: string;
  reason?: string;
} {
  let cleanedResponse = response.trim();

  // Check for competitor mentions
  if (containsCompetitorMention(cleanedResponse)) {
    return {
      filtered: true,
      cleanedResponse: "I'm here to help you with information about Tamil Adventure Club's trekking packages. Would you like me to tell you about our upcoming expeditions?",
      reason: 'competitor_mention',
    };
  }

  // Check for unsafe claims
  if (containsUnsafeClaims(cleanedResponse)) {
    return {
      filtered: true,
      cleanedResponse: cleanedResponse.replace(/100% (guaranteed|sure)/gi, 'with high success rate')
        .replace(/completely risk-free/gi, 'with proper safety measures'),
      reason: 'unsafe_claim',
    };
  }

  // Ensure response stays in scope
  if (!isResponseInScope(cleanedResponse)) {
    return {
      filtered: true,
      cleanedResponse: "I specialize in trekking and adventure travel. Let me help you with information about our trekking packages, safety guidelines, and booking details.",
      reason: 'out_of_scope',
    };
  }

  // Clean up any AI disclaimers
  cleanedResponse = cleanedResponse
    .replace(/as an ai (language model|assistant)/gi, '')
    .replace(/i don't have (real-time|current|latest)/gi, '')
    .replace(/please note/gi, '')
    .replace(/^note:\s*/gim, '')
    .trim();

  // Add CTA if response is informational and lacks one
  const needsCTA = !cleanedResponse.includes('?') &&
    !cleanedResponse.includes('contact') &&
    !cleanedResponse.includes('booking') &&
    !cleanedResponse.includes('website') &&
    !cleanedResponse.includes('details');

  if (needsCTA) {
    cleanedResponse += '\n\nWould you like me to share our contact details for booking?';
  }

  return {
    filtered: false,
    cleanedResponse,
  };
}

/**
 * Generate fallback response for out-of-scope queries
 */
export function getFallbackResponse(intent: string): string {
  const responses: Record<string, string> = {
    unrelated: "I specialize in trekking and adventure tours for Tamil Adventure Club. I'd be happy to help you with:\n\n• Information about our trekking packages\n• Pricing and booking details\n• Safety and preparation tips\n• Contact information\n\nWhat would you like to know about our adventures?",
    profanity: "I'm here to help with trekking and adventure travel information. Please let me know how I can assist you with our packages or booking details.",
    error: "I apologize for the technical difficulty. Please try again or contact us directly at our office.",
  };

  return responses[intent] || responses.error;
}

/**
 * Validate response length
 */
export function validateResponseLength(response: string): boolean {
  const wordCount = response.split(/\s+/).length;
  return wordCount >= 5 && wordCount <= 300; // Min 5 words, max 300 words
}

/**
 * Truncate response if too long
 */
export function truncateResponse(response: string, maxWords: number = 200): string {
  const words = response.split(/\s+/);
  if (words.length <= maxWords) return response;

  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * Add contact CTA to response if appropriate
 */
export function maybeAddContactCTA(response: string, intent: string): string {
  const hasCTA = response.toLowerCase().includes('contact') ||
    response.toLowerCase().includes('book') ||
    response.toLowerCase().includes('call') ||
    response.includes('📞') ||
    response.includes('📧');

  if (hasCTA) return response;

  const ctAs: Record<string, string> = {
    pricing: "\n\nFor the most accurate pricing and availability, please contact our office directly.",
    information: "\n\nWould you like more details about any specific trek or expedition?",
    booking: "\n\nReady to book? Contact us to check availability and reserve your spot!",
    greeting: "\n\nHow can I help you today? Are you looking for information about a specific trek?",
  };

  return response + (ctAs[intent] || ctAs.information);
}
