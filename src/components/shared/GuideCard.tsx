'use client';

import { Star, MapPin, Image as ImageIcon } from 'lucide-react';
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
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      
      {/* IMAGE CONTAINER (ASPECT 4:3 / LANDSCAPE) */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
        {guide.imageUrl ? (
          <img 
            src={guide.imageUrl} 
            alt={guide.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageIcon size={48} />
          </div>
        )}
        
        {/* Rating Badge (Overlay) */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-gray-800">{(guide.rating ?? 0).toFixed(1)}</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">{guide.name}</h3>
        
        <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-3">
          <MapPin size={14} className="text-green-600" />
          <span className="truncate">{guide.specialty || 'Pemandu Gunung'}</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {guide.bio || 'Guide berpengalaman siap menemani perjalanan mendaki Anda dengan aman dan nyaman.'}
        </p>
        
        {/* Tombol Full Width di Bawah */}
        <div className="mt-auto">
          <Link href={`/guides/${guide.id}`} className="block w-full">
            <button className="w-full bg-white border border-green-600 text-green-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Lihat Profil
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}