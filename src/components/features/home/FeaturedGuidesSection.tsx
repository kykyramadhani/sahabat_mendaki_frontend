'use client';

import { useEffect, useState } from 'react';
import GuideCard from '@/components/shared/GuideCard';
import { ArrowRight } from 'lucide-react';
import { getJson } from '@/lib/api';

// NEW: Interface
interface FeaturedGuidesSectionProps {
  setPage: (page: string) => void;
}

export default function FeaturedGuidesSection({ setPage }: FeaturedGuidesSectionProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getJson('/search', { type: 'service', limit: 3 });
        setItems(res?.data || []);
      } catch (err) {
        console.warn('Failed to load featured guides', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          {items.map((item) => (
            <GuideCard
              key={item.id}
              guide={{
                id: item.id,
                name: item.guide?.fullName || item.title || item.name,
                rating: item.rating || 0,
                specialty: item.location || '',
                bio: item.description || item.guide?.bio || '',
                imageUrl: item.images?.[0]?.url || item.guide?.profilePicture || '/images/placeholder.png',
                pricePerDay: item.pricePerDay || item.price || 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}