'use client';

import { useEffect, useState } from 'react';
import GuideCard from '@/components/shared/GuideCard';
import { Search, Filter } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import { getJson } from '@/lib/api';

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { type: 'service', page: 1, limit: 24 };
      if (query) params.query = query;
      const res = await getJson('/search', params);
      setItems(res?.data || []);
    } catch (err: any) {
      console.error('Failed to fetch guides', err);
      setError(err?.data?.message || err?.message || 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGuides(searchTerm);
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Temukan Guide Profesional</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Jelajahi Lombok dengan aman dan nyaman didampingi pemandu berpengalaman.</p>

        <form onSubmit={onSearch} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari guide (e.g., Rizki, Rinjani...)"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button type="button" onClick={() => fetchGuides(searchTerm)} className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </form>

        {loading && <p>Memuat guide...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              // map service result to GuideCard props
              const guide = {
                id: item.id,
                name: item.guide?.fullName || item.title || item.name,
                rating: item.rating || 0,
                specialty: item.location || item.specialty || '',
                bio: item.description || item.guide?.bio || '',
                imageUrl: item.images?.[0]?.url || item.guide?.profilePicture || '/images/placeholder.png',
                pricePerDay: item.pricePerDay || item.price || 0,
                variants: [],
              };
              return <GuideCard key={guide.id} guide={guide} />;
            })}
          </div>
        ) : (
          !loading && <p className="text-center text-gray-500 text-lg">Guide tidak ditemukan. Coba kata kunci lain.</p>
        )}
      </div>
    </PageWrapper>
  );
}
