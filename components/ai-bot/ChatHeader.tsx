"use client";

import { Mountain, X, Minimize2, Maximize2, RefreshCcw } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  onRestart: () => void;
}

export function ChatHeader({ onClose, onMinimize, isMinimized, onRestart }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 sm:px-5">
      {/* Logo and Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <Mountain className="h-4 w-4 text-white sm:h-5 sm:w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white sm:text-base">
            Tamil Adventure Club
          </h2>
          <p className="text-xs text-teal-100 hidden sm:block">
            AI Trekking Assistant
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Restart */}
        <button
          onClick={onRestart}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 sm:h-8 sm:w-8"
          aria-label="Restart conversation"
          title="Restart conversation"
        >
          <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* Minimize/Maximize */}
        <button
          onClick={onMinimize}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 sm:h-8 sm:w-8"
          aria-label={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? (
            <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 sm:h-8 sm:w-8"
          aria-label="Close chat"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}
