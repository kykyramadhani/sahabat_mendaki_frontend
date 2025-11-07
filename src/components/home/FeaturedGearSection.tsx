'use client';
import { GEAR_DATA, Gear } from '@/data/mock';  // Import Gear type
import GearCard from '@/components/shared/GearCard';
import { ArrowRight } from 'lucide-react';

// NEW: Interface
interface FeaturedGearSectionProps {
  setPage: (page: string) => void;  
}

export default function FeaturedGearSection({ setPage }: FeaturedGearSectionProps) {  // FIXED
  const featuredGear = GEAR_DATA.slice(0, 4);
  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Peralatan Populer</h2>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setPage('gear'); }}
            className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-800"
          >
            Lihat Semua <ArrowRight size={20} />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGear.map((gear: Gear) => (  // FIXED: Type gear
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      </div>
    </section>
  );
}