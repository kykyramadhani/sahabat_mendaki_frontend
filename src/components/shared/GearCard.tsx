// src/components/shared/GearCard.tsx
import { GEAR_DATA } from '@/data/mock';

export default function GearCard({ gear }: { gear: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full">
        <img src={gear.imageUrl} alt={gear.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
          {gear.category}
        </span>
        <h3 className="text-lg font-bold text-gray-800 truncate">{gear.name}</h3>
        <p className="text-gray-600 text-sm mb-3">Toko: {gear.vendor}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Mulai dari</p>
            <p className="text-green-600 font-bold text-lg">
              Rp{gear.pricePerDay.toLocaleString('id-ID')}/hari
            </p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-700 transition">
            Sewa
          </button>
        </div>
      </div>
    </div>
  );
}