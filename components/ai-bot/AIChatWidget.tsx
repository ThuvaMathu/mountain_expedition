"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Minimize2, ChevronUp } from "lucide-react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { WELCOME_MESSAGE, QUICK_PROMPTS } from "@/lib/ai-config";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  actions?: {
    label: string;
    type: "link" | "action";
    value: string;
    primary?: boolean;
  }[];
}

interface AIChatWidgetProps {
  enabled?: boolean;
}

export function AIChatWidget({ enabled = true }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(QUICK_PROMPTS.greeting);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load session
      const savedSession = localStorage.getItem("ai_chat_session");
      if (savedSession) {
        setSessionId(savedSession);
      }

      // Load messages
      const savedMessages = localStorage.getItem("ai_chat_messages");
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          setMessages(parsed);
        } catch (e) {
          console.error("Failed to parse saved messages", e);
        }
      }

      // Fetch and cache context if not present
      const cachedContext = sessionStorage.getItem("ai_context");
      if (!cachedContext) {
        fetch("/api/chat/context")
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              sessionStorage.setItem("ai_context", JSON.stringify(data));
            }
          })
          .catch((err) => console.error("Failed to fetch AI context:", err));
      }
    }
  }, []);

  // Save session ID and messages
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionId) {
        localStorage.setItem("ai_chat_session", sessionId);
      }
      if (messages.length > 0) {
        localStorage.setItem("ai_chat_messages", JSON.stringify(messages));
      }
    }
  }, [sessionId, messages]);

  // Handle Restart
  const handleRestart = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai_chat_messages");
      localStorage.removeItem("ai_chat_session");
      setMessages([]);
      setSessionId("");
      setSuggestedPrompts(QUICK_PROMPTS.greeting);

      // Re-initialize with welcome message
      const welcomeMessage: ChatMessage = {
        id: `msg_${Date.now()}_welcome`,
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Handle Action Click
  const handleAction = useCallback((type: "link" | "action", value: string) => {
    if (type === "link") {
      window.open(value, "_blank");
    } else if (type === "action") {
      // In a real app, you might trigger a modal or routing here
      // For now, we'll simulate sending a message
      sendMessage(value);
    }
  }, []); // sendMessage dependency added below to avoid circular dependency issues if not hoisted

  // Send message to API
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Get cached context for first message or if specifically needed
      let contextData = null;
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem("ai_context");
        if (cached) {
          try {
            contextData = JSON.parse(cached);
          } catch (e) {
            console.error("Error parsing cached context", e);
          }
        }
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            sessionId,
            // Send context only if it's the start of a session or we have it cached
            // The backend can decide whether to use it or not
            context: contextData,
          }),
        });

        // Debug: Log complete response for troubleshooting
        const responseText = await response.text();
        console.log("[AIChatWidget] Raw Response:", responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error("[AIChatWidget] JSON Parse Error:", jsonError);
          throw new Error(`Server returned invalid response: ${responseText.substring(0, 50)}...`);
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to send message");
        }

        setSessionId(data.sessionId);

        const botMessage: ChatMessage = {
          id: `msg_${Date.now()}_bot`,
          role: "assistant",
          content: data.message,
          timestamp: Date.now(),
          actions: data.actions, // Capture actions from API
        };

        setMessages((prev) => [...prev, botMessage]);

        if (data.suggestedPrompts) {
          setSuggestedPrompts(data.suggestedPrompts);
        }
      } catch (err) {
        console.error("Chat error:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to send message. Please try again.";
        setError(errorMessage);

        const botMessage: ChatMessage = {
          id: `msg_${Date.now()}_error`,
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment or contact us directly through our website.",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId]
  );

  // Re-attach sendMessage to handleAction if needed, or keep separate. 
  // Since handleAction calls sendMessage, we need to ensure sendMessage is available.
  // The definition order above is fine in React functional component scope, 
  // but to be safe and clean, let's just use sendMessage directly in handleAction or 
  // define handleAction inside the component body as is.


  // Handle quick prompt click
  const handlePromptClick = useCallback((prompt: string) => {
    sendMessage(prompt);
  }, [sendMessage]);

  // Handle welcome message on first open
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `msg_${Date.now()}_welcome`,
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  if (!enabled) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16 sm:shadow-xl sm:shadow-teal-500/40"
            aria-label="Open chat"
          >
            {/* Pulse animation */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-20" />
            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-[380px] sm:bottom-8 sm:right-8 sm:max-w-[420px]"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl border border-slate-200">
              {/* Header */}
              <ChatHeader
                onClose={() => setIsOpen(false)}
                onMinimize={() => setIsMinimized(!isMinimized)}
                isMinimized={isMinimized}
                onRestart={handleRestart}
              />

              {/* Messages - Hide when minimized */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-[400px] sm:h-[450px] overflow-y-auto">
                      <ChatMessages
                        messages={messages}
                        isLoading={isLoading}
                        error={error}
                        messagesEndRef={messagesEndRef}
                        onAction={handleAction}
                      />
                    </div>

                    {/* Suggested Prompts */}
                    {messages.length <= 2 && !isLoading && (
                      <div className="px-4 pb-3">
                        <SuggestedPrompts
                          prompts={suggestedPrompts}
                          onPromptClick={handlePromptClick}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input - Always visible */}
              <ChatInput
                onSend={sendMessage}
                isLoading={isLoading}
                isMinimized={isMinimized}
                onExpand={() => setIsMinimized(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
