"use client";

interface TypingIndicatorProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function TypingIndicator({ size = "md", color = "currentColor" }: TypingIndicatorProps) {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  const dotSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      <span
        className={`${dotSize} rounded-full bg-current animate-bounce`}
        style={{ animationDelay: "0ms" }}
      />
      <span
        className={`${dotSize} rounded-full bg-current animate-bounce`}
        style={{ animationDelay: "150ms" }}
      />
      <span
        className={`${dotSize} rounded-full bg-current animate-bounce`}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
