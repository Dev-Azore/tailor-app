import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractiveDemo } from '@/components/landing/InteractiveDemo';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsAndFAQ } from '@/components/landing/TestimonialsAndFAQ';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const metadata = {
  title: 'TailorApp — Modern Measurement & Client Management for Tailors',
  description:
    'The premier bespoke measurement management system for independent tailors, fashion designers, and couture studios. Record immutable fitting snapshots.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#040e1e] text-slate-100 flex flex-col selection:bg-[#84F200] selection:text-[#071A34]">
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
