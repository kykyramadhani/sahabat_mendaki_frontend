'use client';
import HeroSection from '@/components/features/home/HeroSection';
import ValuePropsSection from '@/components/features/home/ValuePropsSection';
import FeaturedGearSection from '@/components/features/home/FeaturedGearSection';
import FeaturedGuidesSection from '@/components/features/home/FeaturedGuidesSection';
import HowItWorksSection from '@/components/features/home/HowItWorksSection';
import TestimonialSection from '@/components/features/home/TestimonialSection';

export default function HomePage() {
  return (
    <>
      <HeroSection setPage={() => window.history.pushState({}, '', '/')} />
      <ValuePropsSection setPage={() => window.history.pushState({}, '', '/value')} />
      <FeaturedGearSection setPage={() => window.history.pushState({}, '', '/gear')} />
      <FeaturedGuidesSection setPage={() => window.history.pushState({}, '', '/guides')} />
      <HowItWorksSection />
      <TestimonialSection />
    </>
  );
}