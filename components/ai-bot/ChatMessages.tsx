"use client";

import { useState, useEffect } from "react";
import { User, Bot, AlertCircle, Check, ExternalLink } from "lucide-react";
import type { ChatMessage } from "./AIChatWidget";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onAction: (type: "link" | "action", value: string) => void;
}

const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const speed = 10; // Fast typing speed (ms)

    // Reset if text changes significantly (basic check)
    setDisplayedText("");

    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <>{displayedText}</>;
};

export function ChatMessages({ messages, isLoading, error, messagesEndRef, onAction }: ChatMessagesProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const isBot = message.role === "assistant";
        const shouldAnimate = isLastMessage && isBot;

        return (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${message.role === "user"
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
            >
              {message.role === "user" ? (
                <User className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              ) : (
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 ${message.role === "user"
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md"
                }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap sm:text-base break-words">
                {shouldAnimate ? (
                  <Typewriter
                    text={message.content}
                    onComplete={() => {
                      // Optional: Scroll to bottom after typing finishes ensures visibility
                      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
                    }}
                  />
                ) : (
                  message.content
                )}
              </p>

              {/* Action Buttons - Only show after typing is done (or if not animating)
                  For simplicity, we show them immediately but they might push content down. 
                  Maybe cleaner to always show them. */}
              {message.actions && message.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => onAction(action.type, action.value)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${action.primary
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                        }`}
                    >
                      {action.label}
                      {action.type === "link" && <ExternalLink className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              )}

              <p
                className={`text-[10px] sm:text-xs mt-1 ${message.role === "user" ? "text-teal-100" : "text-slate-400"
                  }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        );
      })}

      {/* Error Message */}
      {error && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Typing Indicator */}
      {isLoading && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
            <Bot className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
