// src/app/gear/page.tsx
'use client';

import { useEffect, useState } from 'react';
import GearCard from '@/components/shared/GearCard';
import { Search, Filter } from 'lucide-react';
import PageWrapper from '@/components/shared/PageWrapper';
import { getJson } from '@/lib/api';

export default function GearPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGear = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { type: 'gear', page: 1, limit: 24 };
      if (query) params.query = query;
      const res = await getJson('/search', params);
      setItems(res?.data || []);
    } catch (err: any) {
      console.error('Failed to fetch gear', err);
      setError(err?.data?.message || err?.message || 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGear();
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGear(searchTerm);
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Sewa Peralatan Mendaki</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Temukan semua kebutuhan perlengkapan mendaki Anda di sini. Kualitas terjamin, harga bersahabat.</p>

        <form onSubmit={onSearch} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari peralatan..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button type="button" onClick={() => fetchGear(searchTerm)} className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </form>

        {loading && <p>Memuat peralatan...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
              // map backend GearResult to GearCard props
              const gear = {
                id: item.id,
                name: item.name || item.title,
                category: item.category || 'Lainnya',
                pricePerDay: item.rentalPricePerDay || item.rentalPrice || 0,
                vendor: item.owner?.storeName || item.owner?.address || 'Toko',
                imageUrl: item.images?.[0]?.url || '/images/placeholder.png',
                variants: [],
              };
              return (
                <GearCard key={gear.id} gear={gear} />
              );
            })}
          </div>
        ) : (
          !loading && <p className="text-center text-gray-500 text-lg">Peralatan tidak ditemukan.</p>
        )}
      </div>
    </PageWrapper>
  );
}