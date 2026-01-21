"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { Send, ChevronUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isMinimized: boolean;
  onExpand: () => void;
}

export function ChatInput({ onSend, isLoading, isMinimized, onExpand }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Show minimized state with expand button
  if (isMinimized) {
    return (
      <div className="border-t border-slate-200 px-4 py-2 bg-white">
        <button
          onClick={onExpand}
          className="flex w-full items-center justify-center gap-2 text-sm text-slate-600 hover:text-teal-600 transition-colors py-1"
        >
          <span>Continue chatting</span>
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-200 px-4 py-3 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about treks, pricing, booking..."
          disabled={isLoading}
          className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 sm:px-5 sm:py-3 sm:text-base"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md transition-all hover:from-teal-600 hover:to-cyan-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed sm:h-11 sm:w-11"
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      </form>
    </div>
  );
}
