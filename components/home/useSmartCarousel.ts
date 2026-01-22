'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { HeroSlide } from './HeroSection.types';

interface UseSmartCarouselProps {
  slides: HeroSlide[];
  autoplayDelay?: number; // Delay for image slides in milliseconds
}

export function useSmartCarousel({ slides, autoplayDelay = 5000 }: UseSmartCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Register video element
  const registerVideo = useCallback((index: number, videoElement: HTMLVideoElement | null) => {
    if (videoElement) {
      videoRefs.current.set(index, videoElement);
    } else {
      videoRefs.current.delete(index);
    }
  }, []);

  // Clear any existing timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Navigate to next slide
  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  // Navigate to previous slide
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  // Handle slide change
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    
    // Clear any existing timer
    clearTimer();
    
    // Pause all videos
    videoRefs.current.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
    
    const currentSlide = slides[newIndex];
    
    if (currentSlide.type === 'video') {
      // For video slides, play the video
      const videoElement = videoRefs.current.get(newIndex);
      if (videoElement) {
        videoElement.currentTime = 0;
        
        // Attempt to play with retry logic
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Video started playing successfully
            })
            .catch((error) => {
              // Silently handle common autoplay restrictions
              // The video will still be visible as a poster/first frame
              // Set fallback timer to advance slide
              if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
                // Browser blocked autoplay or doesn't support format
                timerRef.current = setTimeout(scrollNext, autoplayDelay);
              } else {
                // Other errors - log but continue
                console.warn('Video playback interrupted:', error.message);
                timerRef.current = setTimeout(scrollNext, autoplayDelay);
              }
            });
        }
      }
    } else {
      // For image slides, set timer to advance after delay
      timerRef.current = setTimeout(scrollNext, autoplayDelay);
    }
  }, [emblaApi, slides, clearTimer, scrollNext, autoplayDelay]);

  // Handle video end event
  const handleVideoEnd = useCallback(() => {
    scrollNext();
  }, [scrollNext]);

  // Initialize Embla
  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      clearTimer();
    };
  }, [emblaApi, onSelect, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      videoRefs.current.forEach((video) => {
        video.pause();
      });
    };
  }, [clearTimer]);

  return {
    emblaRef,
    emblaApi,
    selectedIndex,
    scrollNext,
    scrollPrev,
    registerVideo,
    handleVideoEnd,
  };
}
