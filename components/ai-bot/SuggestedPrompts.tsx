"use client";

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export function SuggestedPrompts({ prompts, onPromptClick }: SuggestedPromptsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500 font-medium">Popular questions:</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100 hover:border-teal-300 sm:px-4 sm:py-2 sm:text-sm"
          >
            {prompt.length > 25 ? prompt.substring(0, 25) + "..." : prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
