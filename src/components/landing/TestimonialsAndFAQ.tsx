'use client';

import { useState } from 'react';
import { ChevronDown, Star, Quote } from 'lucide-react';

const FAQS = [
  {
    q: 'How does TailorApp prevent fitting mistakes for Kaftans & Babban Riga?',
    a: 'Traditional paper slips get torn, lost, or misplaced by apprentices. TailorApp freezes every single measurement ticket into a permanent digital snapshot with exact dates. When a client orders a new Kaftan or Babban Riga 6 months later, you can replicate the exact cut or compare it against new measurements.',
  },
  {
    q: 'Can I add custom fields for Nigerian traditional cuts?',
    a: 'Yes! You can customize blueprints for Kano Kaftan, Babban Riga, Senator wear, Agbada, Abayas, Corset Gowns, and 6-Piece Skirts. Set custom names in Hausa or English (Tsawon Riga, Hannu, Kirji, Wando) with custom units in Inches or Centimeters.',
  },
  {
    q: 'Can I use TailorApp directly on my phone in the workshop?',
    a: 'Yes! TailorApp is an installable Progressive Web App (PWA). Open it on your phone browser (Chrome or Safari) and tap "Install App" or "Add to Home Screen". It opens in full screen like a native mobile app without requiring huge app store downloads.',
  },
  {
    q: 'Is my client list and measurement notebook private?',
    a: '100% private. Every tailor account is completely isolated using Supabase PostgreSQL Row-Level Security (RLS). No other tailor or competitor can ever see your clients, phone numbers, or design measurements.',
  },
  {
    q: 'How can I contact the team in Kano?',
    a: 'Our physical hub is located at No.1 & 2 Ayumsa Plaza, Sabo Bakin Zuwo Road, Kano State, Nigeria. You can reach our support line at +234 706 111 0002 or email support@tailorapp.com.',
  },
];

const MASTER_TESTIMONIALS = [
  {
    quote:
      'In our workshop at Bn Isma\'il Clothing, precision is our standard. TailorApp eliminated lost client measurements and allows our cutting masters to reference fitting history instantly.',
    author: 'Auwal Isma\'il',
    role: 'CEO, Bn Isma\'il Clothing',
    location: 'Kano State, Nigeria',
  },
  {
    quote:
      'Managing hundreds of luxury couture clients used to take stacks of notebooks. With TailorApp, my apprentices and I pull up accurate Babban Riga and Kaftan measurements in seconds.',
    author: 'Isma\'il Zubairu',
    role: 'CEO, Kankara Couture and More',
    location: 'Kano State, Nigeria',
  },
  {
    quote:
      'Yamani Clothing relies on immaculate finishing. The immutable snapshot feature ensures that when VIP clients order from abroad, their outfits fit flawlessly without re-measuring.',
    author: 'Huzaifa Tukur',
    role: 'CEO, Yamani Clothing',
    location: 'Kano State, Nigeria',
  },
  {
    quote:
      'Recording custom sleeve lengths and female corset contours on mobile during fittings saves hours. TailorApp is the best tool modern Nigerian tailors can have.',
    author: 'Haroon Aminu Isah',
    role: 'Lead Designer, KF Modeling and Stitches',
    location: 'Kano State, Nigeria',
  },
];

export function TestimonialsAndFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-[#040e1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Real Master Tailor Endorsements */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#84F200]">
              Endorsed by Master Tailors
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Trusted by Premier Ateliers
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Leading couture brands in Kano and Nigeria power their bespoke workshops with TailorApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {MASTER_TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#071A34] p-7 rounded-3xl border border-[#0B2545] hover:border-[#84F200]/40 transition-all duration-300 relative flex flex-col justify-between shadow-xl"
              >
                <Quote className="w-8 h-8 text-[#84F200]/20 absolute top-6 right-6 pointer-events-none" />
                <div>
                  <div className="flex gap-1 mb-3 text-[#84F200]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#84F200]" />
                    ))}
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#0B2545] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{t.author}</div>
                    <div className="text-xs text-[#84F200] font-semibold">{t.role}</div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 bg-[#040e1e] px-2.5 py-1 rounded-lg border border-[#0B2545]">
                    {t.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#84F200]">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#0B2545] bg-[#071A34] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:text-[#84F200] transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white text-base sm:text-lg">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#84F200]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-[#0B2545] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
