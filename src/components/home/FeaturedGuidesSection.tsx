'use client';

import { GUIDE_DATA } from '@/data/mock';
import GuideCard from '@/components/shared/GuideCard';
import { ArrowRight } from 'lucide-react';

export default function FeaturedGuidesSection({ setPage }: { setPage: (page: string) => void }) {
  const featuredGuides = GUIDE_DATA.slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700">Guide Pilihan Kami</h2>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setPage('guides'); }}
            className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-800"
          >
            Lihat Semua <ArrowRight size={20} />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>
    </section>
  );
}