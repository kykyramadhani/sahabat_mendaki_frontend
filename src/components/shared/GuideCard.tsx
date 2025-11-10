'use client';
import { Star, MapPin } from 'lucide-react';
import Link from 'next/link';

interface GuideCardProps {
  guide: {
    id: string;
    name: string;
    rating?: number;
    specialty?: string;
    bio?: string;
    imageUrl?: string;
    pricePerDay?: number;
    variants?: any[];
  };
}

export default function GuideCard({ guide }: GuideCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 w-full">
        <img src={guide.imageUrl} alt={guide.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{guide.name}</h3>
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold">{(guide.rating ?? 0).toFixed(1)}</span>
          </div>
        </div>
        <p className="flex items-center gap-2 text-green-700 text-sm font-medium mb-3">
          <MapPin size={16} />
          Spesialisasi: {guide.specialty}
        </p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guide.bio}</p>
        <Link href={`/guides/${guide.id}`}>
          <button className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition">
            Lihat Profil Guide
          </button>
        </Link>
      </div>
    </div>
  );
}