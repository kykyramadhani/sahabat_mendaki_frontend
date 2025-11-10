'use client';

import { useEffect, useState } from 'react';
import GearCard from '@/components/shared/GearCard';
import { ArrowRight } from 'lucide-react';
import { getJson } from '@/lib/api';

// NEW: Interface
interface FeaturedGearSectionProps {
  setPage: (page: string) => void;  
}

export default function FeaturedGearSection({ setPage }: FeaturedGearSectionProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getJson('/search', { type: 'gear', limit: 4 });
        setItems(res?.data || []);
      } catch (err) {
        console.warn('Failed to load featured gear', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700">Peralatan Populer</h2>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setPage('gear'); }}
            className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-800"
          >
            Lihat Semua <ArrowRight size={20} />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <GearCard
              key={item.id}
              gear={{
                id: item.id,
                name: item.name || item.title,
                category: item.category || 'Lainnya',
                pricePerDay: item.rentalPricePerDay || item.rentalPrice || 0,
                vendor: item.owner?.storeName || item.owner?.address || 'Toko',
                imageUrl: item.images?.[0]?.url || '/images/placeholder.png',
                variants: [],
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}