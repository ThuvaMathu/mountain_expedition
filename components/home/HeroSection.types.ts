export type SlideType = 'image' | 'video';

export interface HeroSlide {
  id: string | number;
  type: SlideType;
  src: string;
  title: string;
  subtitle: string;
  ctaLink: string;
  ctaText: string;
}
