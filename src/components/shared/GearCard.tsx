'use client';

import Link from 'next/link';
import { Image as ImageIcon } from 'lucide-react';

interface GearCardProps {
  gear: {
    id: string;
    name: string;
    category: string;
    pricePerDay: number;
    vendor?: string;
    imageUrl?: string;
    variants?: any[];
  };
}

export default function GearCard({ gear }: GearCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      
      {/* IMAGE CONTAINER (ASPECT SQUARE / KOTAK) */}
      <div className="relative aspect-square bg-gray-100 w-full overflow-hidden">
        {gear.imageUrl ? (
          <img 
            src={gear.imageUrl} 
            alt={gear.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageIcon size={48} />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="inline-block bg-green-50 text-green-700 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full">
            {gear.category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-1" title={gear.name}>
          {gear.name}
        </h3>
        
        <p className="text-gray-500 text-xs mb-4">
          Toko: {gear.vendor || 'Mitra Sahabat Mendaki'}
        </p>
        
        {/* Footer (Harga & Tombol) - mt-auto agar selalu di bawah */}
        <div className="mt-auto flex justify-between items-end border-t pt-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Harga Sewa</p>
            <p className="text-green-600 font-bold text-lg">
              Rp{gear.pricePerDay.toLocaleString('id-ID')}<span className="text-sm font-normal text-gray-500">/hari</span>
            </p>
          </div>
          
          <Link href={`/gear/${gear.id}`}>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors shadow-sm">
              Sewa
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}