"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Loader2 } from "lucide-react";

type HeightClass =
  | "h-24"
  | "h-28"
  | "h-32"
  | "h-36"
  | "h-40"
  | "h-44"
  | "h-48"
  | "h-56"
  | "h-64"
  | "h-72"
  | "h-80";

interface AppImageProps extends Omit<ImageProps, "height" | "width"> {
  /** Tailwind height class (one of the union) — default "h-48" */
  height?: HeightClass;
  /** If true, image will be loaded eagerly */
  priority?: boolean;
  /** fallback src when src is falsy */
  fallbackSrc?: string;
  className?: string;
}

export function ImageLoader({
  src,
  alt,
  height = "h-48",
  priority = false,
  fallbackSrc = "/placeholder.svg",
  className = "",
  ...props
}: AppImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // onLoadingComplete receives { naturalWidth, naturalHeight } in Next 13+
  const handleLoaded = () => setIsLoading(false);

  return (
    <div className={`${height} w-full relative overflow-hidden`}>
      {/* Spinner while loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600/40" />
        </div>
      )}

      <Image
        src={(src as any) || fallbackSrc}
        alt={alt || ""}
        fill
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        placeholder="blur"
        blurDataURL={fallbackSrc}
        className={`object-cover transition-transform duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        onLoadingComplete={handleLoaded}
        {...props}
      />
    </div>
  );
}
