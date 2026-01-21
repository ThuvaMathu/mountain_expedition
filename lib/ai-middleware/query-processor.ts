import { BLOCKED_WORDS, OUT_OF_SCOPE_KEYWORDS, AI_CONFIG } from "@/lib/ai-config";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Query Processor - Analyzes and processes user queries
 * - Detects intent (rule-based + AI for complex queries)
 * - Rewords vague questions
 * - Detects out-of-scope queries
 * - Checks for blocked content
 */

// Simple queries can be handled by rules
// Complex queries (multi-part, ambiguous, conversational) use AI
const COMPLEX_QUERY_THRESHOLD = 10; // words
const AMBIGUOUS_PATTERNS = [
  'maybe', 'perhaps', 'might', 'possibly', 'not sure',
  'what do you think', 'would you recommend', 'which is better',
  'compare', 'difference between', 'vs', 'versus'
];

/**
 * Check if a query needs AI processing
 */
function needsAIProcessing(query: string): boolean {
  const wordCount = query.split(/\s+/).length;
  const lowerQuery = query.toLowerCase();

  // Needs AI if:
  // 1. Query is long (complex/multi-part)
  if (wordCount > COMPLEX_QUERY_THRESHOLD) return true;

  // 2. Contains ambiguous/comparative patterns
  if (AMBIGUOUS_PATTERNS.some(pattern => lowerQuery.includes(pattern))) return true;

  // 3. Has multiple questions (indicated by multiple question marks)
  if ((query.match(/\?/g) || []).length > 1) return true;

  // 4. Conversational follow-ups lacking context
  if (/^(what about|how about|and|what if|but|also)/i.test(query)) return true;

  return false;
}

/**
 * Use Gemini to analyze complex queries
 * Returns: { intent, isComplex, extractedKeywords, needsContext }
 */
async function analyzeWithAI(
  query: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<{
  intent: ChatIntent;
  isComplex: boolean;
  extractedKeywords: string[];
  suggestedRewrite: string;
  confidence: number;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback to rule-based if API key missing
    return {
      intent: detectIntent(query),
      isComplex: false,
      extractedKeywords: [],
      suggestedRewrite: query,
      confidence: 0.7,
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log(`[Query Processor] Using Lite Model: ${AI_CONFIG.flash_lite.model}`);
    const model = genAI.getGenerativeModel({
      model: AI_CONFIG.flash_lite.model,
    });

    // Format history for context
    const historyText = conversationHistory
       .slice(-3) // Last 3 turns only
       .map(m => `${m.role}: ${m.content}`)
       .join('\n');

    const prompt = `Analyze this user query for a trekking/adventure travel chatbot and respond ONLY in JSON format.
    
Previous Context:
${historyText}

Current Query: "${query}"

Respond with this JSON structure (no markdown, no explanation):
{
  "intent": "greeting" | "information" | "pricing" | "booking" | "contact" | "unrelated",
  "isComplex": true/false,
  "extractedKeywords": ["keyword1", "keyword2"],
  "suggestedRewrite": "clearer version of the question if vague, else original",
  "confidence": 0.0-1.0
}

Rules:
- STRICTLY check if the query is related to trekking, adventure, tours, company info, or general enquiry.
- If query is about politics, religion, entertainment, sports, or unrelated topics → intent = "unrelated"
- If query mentions price, cost, budget → intent = "pricing"
- If query mentions booking, dates, availability → intent = "booking"
- If query mentions contact, phone, email, office → intent = "contact"
- Extract relevant trekking keywords (location, difficulty, season, etc.)
- Use 'Previous Context' to resolve vague queries.
- For "unrelated" intent, set confidence to 1.0`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      intent: parsed.intent || 'information',
      isComplex: parsed.isComplex || false,
      extractedKeywords: parsed.extractedKeywords || [],
      suggestedRewrite: parsed.suggestedRewrite || query,
      confidence: parsed.confidence || 0.8,
    };
  } catch (error) {
    console.error("AI query analysis failed, falling back to rules:", error);
    return {
      intent: detectIntent(query),
      isComplex: false,
      extractedKeywords: [],
      suggestedRewrite: query,
      confidence: 0.7,
    };
  }
}

// Profanity filter - checks for blocked words
export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BLOCKED_WORDS.some(word => lowerText.includes(word));
}

// Check if query is out of scope
export function isOutOfScope(text: string): boolean {
  const lowerText = text.toLowerCase();
  return OUT_OF_SCOPE_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Detect intent from user query (rule-based)
export function detectIntent(text: string): ChatIntent {
  const lowerText = text.toLowerCase();

  // Check for greetings first
  const greetings = ['hi', 'hello', 'hey', 'namaste', 'greetings', 'good morning', 'good evening'];
  if (greetings.some(g => lowerText.includes(g)) && text.split(' ').length < 5) {
    return 'greeting';
  }

  // Out of scope detection
  if (isOutOfScope(text)) {
    return 'unrelated';
  }

  // Contact intent
  const contactKeywords = ['contact', 'phone', 'email', 'call', 'reach', 'office', 'address', 'location'];
  if (contactKeywords.some(k => lowerText.includes(k))) {
    return 'contact';
  }

  // Pricing/cost intent
  const pricingKeywords = ['price', 'cost', 'how much', 'rate', 'fee', 'cheap', 'expensive', 'budget', 'budjet', 'affordable', 'discount'];
  if (pricingKeywords.some(k => lowerText.includes(k))) {
    return 'pricing';
  }

  // Booking intent
  const bookingKeywords = ['book', 'reserve', 'booking', 'enquire', 'available', 'dates', 'schedule', 'register', 'sign up'];
  if (bookingKeywords.some(k => lowerText.includes(k))) {
    return 'booking';
  }

  // Default to information for general trekking queries
  return 'information';
}

// Rewrite vague questions to be more specific
export function rewriteQuery(text: string, aiSuggestion?: string): string {
  // If AI provided a rewrite, use it
  if (aiSuggestion && aiSuggestion !== text) {
    return aiSuggestion;
  }

  let rewritten = text.trim();
  const lowerText = rewritten.toLowerCase();

  // Handle vague pricing queries
  if (/^(how much|price|cost|rate)/i.test(rewritten) && !/\b(trek|tour|package|trip|everest|kedar|roopkund)\b/i.test(rewritten)) {
    rewritten = "What are the prices for your trekking packages?";
  }

  // Handle vague "something" queries
  if (/\b(something easy|something hard|something fun|anything)\b/i.test(rewritten)) {
    if (lowerText.includes('easy')) {
      rewritten = "What are some beginner-friendly trekking options?";
    } else if (lowerText.includes('hard') || lowerText.includes('challenging')) {
      rewritten = "What are some advanced or challenging trekking expeditions?";
    } else {
      rewritten = "What trekking packages are available?";
    }
  }

  // Handle "best" without context
  if (/^best\b/i.test(rewritten)) {
    rewritten = "What are the best trekking packages available?";
  }

  // Handle "recommend" without specifics
  if (/^(recommend|suggest)\b$/i.test(rewritten)) {
    rewritten = "Can you recommend some popular trekking destinations?";
  }

  return rewritten;
}

// Main query processing function
export async function processUserQuery(
  query: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<ProcessedQuery> {
  const trimmedQuery = query.trim();

  // Check for profanity
  if (containsProfanity(trimmedQuery)) {
    return {
      originalQuery: trimmedQuery,
      processedQuery: '',
      intent: 'unrelated',
      confidence: 1,
    };
  }

  // Check if query needs AI processing
  const needsAI = needsAIProcessing(trimmedQuery);

  let intent: ChatIntent;
  let processedQuery: string;
  let confidence: number;
  let suggestedPackages: string[] = [];

  if (needsAI) {
    // Use Gemini for complex queries
    const analysis = await analyzeWithAI(trimmedQuery, conversationHistory);

    intent = analysis.intent;
    processedQuery = analysis.suggestedRewrite;
    confidence = analysis.confidence;

    // Extract keywords for package suggestions
    if (analysis.extractedKeywords.length > 0) {
      suggestedPackages = analysis.extractedKeywords;
    }
  } else {
    // Use rule-based for simple queries
    intent = detectIntent(trimmedQuery);
    processedQuery = rewriteQuery(trimmedQuery);
    confidence = 0.8; // Default confidence

    // Calculate confidence based on query clarity
    if (trimmedQuery.split(' ').length >= 5) {
      confidence = 0.9; // More specific query
    } else if (trimmedQuery.split(' ').length <= 2) {
      confidence = 0.6; // Vague query
    }

    // High confidence for out-of-scope
    if (intent === 'unrelated') {
      confidence = 1.0;
    }
  }

  return {
    originalQuery: trimmedQuery,
    processedQuery,
    intent,
    confidence,
    suggestedPackages,
  };
}

/**
 * Suggest relevant packages based on query
 */
export function suggestPackages(
  query: string,
  allPackages: any[],
  limit: number = 3
): string[] {
  const lowerQuery = query.toLowerCase();
  const suggested: string[] = [];

  // Filter packages based on query keywords
  const relevantPackages = allPackages.filter(pkg => {
    const pkgText = `${pkg.name} ${pkg.location} ${pkg.difficulty} ${pkg.description}`.toLowerCase();
    return pkg.status === 'active' && (
      lowerQuery.includes(pkg.location.toLowerCase()) ||
      lowerQuery.includes(pkg.difficulty.toLowerCase()) ||
      lowerQuery.includes(pkg.name.toLowerCase()) ||
      (pkg.category === 'domestic' && (lowerQuery.includes('india') || lowerQuery.includes('domestic'))) ||
      (pkg.category === 'international' && lowerQuery.includes('international'))
    );
  });

  // If no specific matches, return popular/active packages
  const packagesToSuggest = relevantPackages.length > 0
    ? relevantPackages
    : allPackages.filter(p => p.status === 'active').slice(0, limit);

  return packagesToSuggest.slice(0, limit).map(p => p.id);
}
