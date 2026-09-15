import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveDemo } from '@/components/landing/InteractiveDemo';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsAndFAQ } from '@/components/landing/TestimonialsAndFAQ';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const metadata = {
  title: 'TailorApp — Digital Measurement Book for Tailors & Fashion Designers',
  description:
    'A simple and reliable digital measurement management system for independent tailors and fashion designers. Never lose customer measurements again.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#040e1e] text-slate-100 flex flex-col selection:bg-[#2e7d32] selection:text-white">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <InteractiveDemo />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsAndFAQ />
      </main>
      <LandingFooter />
    </div>
  );
}
