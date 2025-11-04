// src/app/page.tsx
'use client';

import HeroSection from '@/components/home/HeroSection';
import ValuePropsSection from '@/components/home/ValuePropsSection';
import FeaturedGearSection from '@/components/home/FeaturedGearSection';
import FeaturedGuidesSection from '@/components/home/FeaturedGuidesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialSection from '@/components/home/TestimonialSection';

export default function HomePage() {
  return (
    <>
      <HeroSection setPage={() => window.history.pushState({}, '', '/')} />
      <ValuePropsSection setPage={() => window.history.pushState({}, '', '/value')}/>
      <FeaturedGearSection setPage={() => window.history.pushState({}, '', '/gear')} />
      <FeaturedGuidesSection setPage={() => window.history.pushState({}, '', '/guides')} />
      <HowItWorksSection />
      <TestimonialSection />
    </>
  );
}