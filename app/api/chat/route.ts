import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  checkChatRateLimit,
  checkChatSessionRateLimit,
} from "@/lib/rate-limit";
import {
  processUserQuery,
  getRelevantPackages,
  buildAIContext,
} from "@/lib/ai-middleware";
import {
  filterResponse,
  getFallbackResponse,
  maybeAddContactCTA,
  truncateResponse,
} from "@/lib/ai-middleware/response-filter";
import {
  getPackagesForChat,
} from "@/services/get-packages";
import {
  getContactDetails,
} from "@/services/get-contact";
import { AI_CONFIG, SYSTEM_PROMPT, QUICK_PROMPTS } from "@/lib/ai-config";
import { STATIC_CHAT_CONTEXT } from "@/lib/ai-static-content";

// In-memory session storage (for production, use Redis or Firestore)
const chatSessions = new Map<string, ChatSession>();

// Track which sessions have received static context injection
const sessionsWithStaticContext = new Set<string>();

// Clean up old sessions every 30 minutes
setInterval(() => {
  const hourAgo = Date.now() - 60 * 60 * 1000;
  for (const [sessionId, session] of chatSessions.entries()) {
    if (session.lastActivity < hourAgo) {
      chatSessions.delete(sessionId);
      sessionsWithStaticContext.delete(sessionId);
    }
  }
}, 30 * 60 * 1000);

/**
 * Extract IP address from request
 */
function getIpAddress(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";
  return ip;
}

/**
 * Generate or retrieve session ID
 */
function getOrCreateSession(sessionId?: string): string {
  if (!sessionId) {
    sessionId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  if (!chatSessions.has(sessionId)) {
    chatSessions.set(sessionId, {
      sessionId,
      messages: [],
      createdAt: Date.now(),
      lastActivity: Date.now(),
    });
  }

  return sessionId;
}

/**
 * Get conversation history for Gemini
 * Injects static content on first message of new session
 */
function getChatHistory(sessionId: string, isFirstMessage: boolean): Array<{ role: string; parts: Array<{ text: string }> }> {
  const session = chatSessions.get(sessionId);
  if (!session) return [];

  const history: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  // Inject static content as first system message on new session
  if (isFirstMessage && !sessionsWithStaticContext.has(sessionId)) {
    console.log(`[chat API] Injecting static context for session ${sessionId}`);
    history.push({
      role: "user",
      parts: [{ text: `[CONTEXT INJECTION - Read and remember this information for our conversation]\n\n${STATIC_CHAT_CONTEXT}\n\nEND CONTEXT. I have read this context and will use it to answer questions.` }],
    });
    history.push({
      role: "model",
      parts: [{ text: "I've read and understood the context about Tamil Adventure Club. I'm ready to answer questions about trekking packages, safety, booking, and company information. How can I help you?" }],
    });
    sessionsWithStaticContext.add(sessionId);
  }

  // Add actual conversation history (excluding system messages)
  const conversationHistory = session.messages
    .filter((m) => m.role !== "system")
    .slice(-10) // Only last 10 messages to manage token usage
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

  return [...history, ...conversationHistory];
}

/**
 * POST /api/chat - Main chat endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, sessionId: providedSessionId, context } = body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Message is required", sessionId: "" },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Message too long. Please keep it under 1000 characters.", sessionId: "" },
        { status: 400 }
      );
    }

    // Get IP address
    const ipAddress = getIpAddress(request);

    // Check rate limits
    const ipRateLimit = checkChatRateLimit(ipAddress);
    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please wait a moment and try again.",
          sessionId: providedSessionId || "",
        },
        { status: 429 }
      );
    }

    // Get or create session
    const sessionId = getOrCreateSession(providedSessionId);

    // Check session rate limit
    const sessionRateLimit = checkChatSessionRateLimit(sessionId);
    if (!sessionRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "You've reached the message limit. Please start a new conversation.",
          sessionId: "",
        },
        { status: 429 }
      );
    }

    const session = chatSessions.get(sessionId)!;

    // Add user message to session
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content: message.trim(),
      timestamp: Date.now(),
    };
    session.messages.push(userMessage);
    session.lastActivity = Date.now();

    console.log(`[chat API] Session: ${sessionId}, Message: "${message.trim()}"`);

    // Process query
    const processedQuery = await processUserQuery(
      message,
      session.messages.slice(-5).map((m) => ({ role: m.role, content: m.content }))
    );

    console.log(`[chat API] Processed query - intent: ${processedQuery.intent}, confidence: ${processedQuery.confidence}`);

    // Handle profanity or blocked content
    if (processedQuery.processedQuery === "") {
      const fallback = getFallbackResponse("profanity");
      console.log("[chat API] Blocked content detected, returning fallback");
      return NextResponse.json({
        success: true,
        message: fallback,
        sessionId,
        intent: "unrelated",
      } as ChatResponse);
    }

    // Handle out-of-scope queries
    if (processedQuery.intent === "unrelated") {
      const fallback = getFallbackResponse("unrelated");
      console.log("[chat API] Out-of-scope query detected, returning fallback");
      const botMessage: ChatMessage = {
        id: `msg_${Date.now()}_bot`,
        role: "assistant",
        content: fallback,
        timestamp: Date.now(),
      };
      session.messages.push(botMessage);

      return NextResponse.json({
        success: true,
        message: fallback,
        sessionId,
        intent: "unrelated",
      } as ChatResponse);
    }

    // Fetch context data (Start with client context if available, otherwise fetch)
    // In production, you would validate this context or refresh it if stale
    let contextData = context;
    if (!contextData || !contextData.packages) {
       console.log("[chat API] No client context, fetching packages for chat session...");
       const [packages, contactDetails] = await Promise.all([
          getPackagesForChat(sessionId),
          getContactDetails(),
       ]);
       contextData = {
          packages,
          contact: contactDetails,
          faqs: contactDetails.faqs || [],
       };
    } else {
       console.log("[chat API] Using client-provided cached context");
    }

    // Build context string using the resolved data
    // Handle potential partial data structure from client
    const packages = contextData.packages || [];
    const contact = contextData.contact || {};
    const faqs = contextData.faqs || [];

    const contextStr = buildAIContext({
      packages,
      contact,
      faqs,
    });

    // Get relevant packages for this query
    const relevantPackages = getRelevantPackages(message, packages);
    console.log(`[chat API] Found ${relevantPackages.length} relevant packages for query`);

    // Prepare enhanced prompt with context
    let enhancedPrompt = processedQuery.processedQuery;

    // Add context about relevant packages if any
    if (relevantPackages.length > 0) {
      enhancedPrompt += "\n\nRelevant packages for this query:";
      relevantPackages.forEach((pkg) => {
        const price = pkg.priceINR
          ? `₹${(pkg.priceINR / 1000).toFixed(0)}k`
          : pkg.priceUSD
          ? `$${pkg.priceUSD}`
          : "Enquire for pricing";
        enhancedPrompt += `\n- ${pkg.name}: ${pkg.location}, ${pkg.difficulty}, ${pkg.duration}, ${price}`;
      });
    }

    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "AI service is not configured. Please contact support.",
          sessionId,
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log(`[Chat API] Using Default Model: ${AI_CONFIG.default.model}`);
    const model = genAI.getGenerativeModel({
      model: AI_CONFIG.default.model,
      systemInstruction: SYSTEM_PROMPT,
    });

    // Check if this is the first message (before adding current message, messages.length was 1 or 0)
    const isFirstMessage = session.messages.length <= 1;

    // Get chat history (injects static content on first message)
    const history = getChatHistory(sessionId, isFirstMessage);

    // Generate response with auto-retry mechanism
    let aiResponse: string = "";
    let lastError: any;
    
    // Try up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const chat = model.startChat({
          history,
          generationConfig: {
            temperature: AI_CONFIG.default.temperature,
            maxOutputTokens: AI_CONFIG.default.maxTokens,
          },
        });

        const result = await chat.sendMessage(
          `${contextStr}\n\nUser Question: ${enhancedPrompt}`
        );

        aiResponse = result.response.text();
        
        // If successful, break the loop
        if (aiResponse) break;
      } catch (geminiError) {
        console.warn(`[Chat API] Attempt ${attempt} failed:`, geminiError);
        lastError = geminiError;
        
        // Wait 1 second before retrying, if not the last attempt
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // If all attempts failed, use fallback
    if (!aiResponse) {
      console.error("[Chat API] All retry attempts failed. Last error:", lastError);
      const fallback = getFallbackResponse("error");
      return NextResponse.json({
        success: true,
        message: fallback,
        sessionId,
      } as ChatResponse);
    }

    // Filter and clean response
    const filtered = filterResponse(aiResponse);
    let finalResponse = filtered.filtered
      ? filtered.cleanedResponse
      : filtered.cleanedResponse;

    // Truncate if too long
    finalResponse = truncateResponse(finalResponse, 200);

    // Final safety check: Ensure response is not empty
    if (!finalResponse || finalResponse.trim().length === 0) {
      finalResponse = getFallbackResponse("unrelated"); // Fallback for empty responses
    }

    // Add CTA if appropriate
    if (!filtered.filtered) {
      finalResponse = maybeAddContactCTA(finalResponse, processedQuery.intent);
    }

    // Add bot message to session
    const botMessage: ChatMessage = {
      id: `msg_${Date.now()}_bot`,
      role: "assistant",
      content: finalResponse,
      timestamp: Date.now(),
    };
    session.messages.push(botMessage);
    session.lastActivity = Date.now();

    // Determine suggested prompts based on intent
    let suggestedPrompts: string[] = [];
    if (processedQuery.intent === "greeting") {
      suggestedPrompts = QUICK_PROMPTS.greeting;
    } else if (processedQuery.intent === "pricing") {
      suggestedPrompts = QUICK_PROMPTS.pricing;
    } else if (processedQuery.intent === "booking") {
      suggestedPrompts = QUICK_PROMPTS.booking;
    } else if (processedQuery.intent === "contact") {
      suggestedPrompts = QUICK_PROMPTS.contact;
    } else if (processedQuery.intent === "information") {
      suggestedPrompts = QUICK_PROMPTS.information;
    }

    // Generate actions based on intent
    const actions: { label: string; type: "link" | "action"; value: string; primary?: boolean }[] = [];

    if (processedQuery.intent === "booking") {
      actions.push({ label: "Book Now", type: "link", value: "/contact", primary: true });
      actions.push({ label: "Check Availability", type: "action", value: "Check availability for next month" });
    } else if (processedQuery.intent === "contact") {
      actions.push({ label: "Email Us", type: "link", value: "mailto:info@tamiladventuretrekkingclub.com", primary: true });
      actions.push({ label: "Call Us", type: "link", value: "tel:+918015640943" });
    } else if (processedQuery.intent === "information") {
      actions.push({ label: "Explore Tours", type: "link", value: "/trekking", primary: true });
    } else if (processedQuery.intent === "pricing") {
       actions.push({ label: "Request Quote", type: "link", value: "/contact", primary: true });
    }

    return NextResponse.json({
      success: true,
      message: finalResponse,
      sessionId,
      suggestedPrompts,
      intent: processedQuery.intent,
      actions,
    } as ChatResponse);

  } catch (error) {
    console.error("Chat API error:", error);
    // Safe failure: sessionId might not be defined if error happened early
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred. Please try again later.",
        sessionId: "",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat - Get session history
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { success: false, message: "Session ID is required" },
      { status: 400 }
    );
  }

  const session = chatSessions.get(sessionId);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Session not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    messages: session.messages,
  });
}
