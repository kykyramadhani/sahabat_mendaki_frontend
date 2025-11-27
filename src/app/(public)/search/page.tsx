"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, Suspense } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import { getJson } from '@/lib/api';
import GearCard from '@/components/shared/GearCard';
import GuideCard from '@/components/shared/GuideCard';

// --- 1. PISAHKAN LOGIKA UTAMA KE KOMPONEN BARU ---
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State form
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [limit, setLimit] = useState('10');

  // State data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const doSearch = useCallback(async (page = 1, overrides: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { 
        query: overrides.query !== undefined ? overrides.query : query, 
        page, 
        limit: Number((overrides.limit !== undefined ? overrides.limit : limit) || 10) 
      };

      const currentType = overrides.type !== undefined ? overrides.type : type;
      const currentLocation = overrides.location !== undefined ? overrides.location : location;
      const currentMin = overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
      const currentMax = overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
      const currentCat = overrides.category !== undefined ? overrides.category : category;
      const currentSort = overrides.sort !== undefined ? overrides.sort : sort;

      if (currentType) params.type = currentType;
      if (currentLocation) params.location = currentLocation;
      if (currentMin) params.minPrice = Number(currentMin);
      if (currentMax) params.maxPrice = Number(currentMax);
      if (currentCat) params.category = currentCat;
      if (currentSort) params.sort = currentSort;

      const data = await getJson('/search', params);
      setResults(data?.data || []);
      setPagination(data?.pagination || null);
    } catch (err: any) {
      console.error(err);
      const serverMsg = err?.data?.message || err?.message || (err && JSON.stringify(err));
      setError(serverMsg || 'Gagal mengambil hasil. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [query, type, location, minPrice, maxPrice, category, sort, limit]);

  useEffect(() => {
    const q = searchParams.get('query') || '';
    const t = searchParams.get('type') || '';
    const loc = searchParams.get('location') || '';
    const min = searchParams.get('minPrice') || '';
    const max = searchParams.get('maxPrice') || '';
    const cat = searchParams.get('category') || '';
    const s = searchParams.get('sort') || '';
    const lim = searchParams.get('limit') || '10';
    const page = Number(searchParams.get('page') || '1');

    setQuery(q);
    setType(t);
    setLocation(loc);
    setMinPrice(min);
    setMaxPrice(max);
    setCategory(cat);
    setSort(s);
    setLimit(lim);

    doSearch(page, {
      query: q, type: t, location: loc, minPrice: min, maxPrice: max, category: cat, sort: s, limit: lim
    });
  }, [searchParams, doSearch]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getJson('/search', { type: 'gear', limit: 100 });
        const gearItems = res?.data || [];
        const setCats = new Set<string>();
        gearItems.forEach((g: any) => {
          if (g.category) setCats.add(g.category);
        });
        setCategories(Array.from(setCats).sort());
      } catch (err) {
        console.warn('Failed to fetch categories', err);
      }
    })();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (query) qs.set('query', query);
    if (type) qs.set('type', type);
    if (location) qs.set('location', location);
    if (minPrice) qs.set('minPrice', minPrice);
    if (maxPrice) qs.set('maxPrice', maxPrice);
    if (category) qs.set('category', category);
    if (sort) qs.set('sort', sort);
    if (limit) qs.set('limit', limit);
    qs.set('page', '1');
    router.push(`/search?${qs.toString()}`);
  };

  const renderItem = (item: any, idx: number) => {
    if (item.rentalPricePerDay !== undefined || item.category) {
      const gear = {
        id: item.id,
        name: item.name,
        category: item.category || 'Lainnya',
        pricePerDay: item.rentalPricePerDay || item.rentalPrice || 0,
        vendor: item.owner?.storeName || item.owner?.storeAddress || 'Toko',
        imageUrl: item.images?.[0]?.url || item.imageUrl || '/images/placeholder.png',
        variants: item.variants || [],
      };
      return (
        <div key={item.id || idx} className="w-full md:w-1/3 p-2">
          <GearCard gear={gear} />
        </div>
      );
    }
    const guide = {
      id: item.id,
      name: item.guide?.fullName || item.title || item.name,
      rating: item.rating || 0,
      specialty: item.location || item.specialty || '',
      bio: item.description || item.guide?.bio || '',
      imageUrl: item.images?.[0]?.url || item.guide?.profilePicture || '/images/placeholder.png',
      pricePerDay: item.pricePerDay || item.price || 0,
      variants: item.variants || [],
    };
    return (
      <div key={item.id || idx} className="w-full md:w-1/3 p-2">
        <GuideCard guide={guide} />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cari</h1>

      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Kata kunci..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded-md flex-1 min-w-[200px]"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded-md">
          <option value="">Semua</option>
          <option value="gear">Gear (Sewa)</option>
          <option value="service">Service (Guide)</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded-md">
          <option value="">Urutkan</option>
          <option value="price_asc">Harga: Terendah</option>
          <option value="price_desc">Harga: Tertinggi</option>
          <option value="rating_desc">Rating: Tertinggi</option>
          <option value="newest">Terbaru</option>
        </select>
        <select value={limit} onChange={(e) => setLimit(e.target.value)} className="border p-2 rounded-md w-24">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        <input type="text" placeholder="Lokasi" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 rounded-md w-32" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded-md w-40">
          <option value="">Kategori</option>
          {categories.map((c) => (
            <option value={c} key={c}>{c}</option>
          ))}
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md">Cari</button>
      </form>

      {loading && <p>Memuat hasil...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-wrap -m-2">
        {results.length === 0 && !loading && <p>Tidak ada hasil.</p>}
        {results.map(renderItem)}
      </div>

      {pagination && (
        <div className="mt-6 flex items-center gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => {
                const qs = new URLSearchParams(window.location.search);
                qs.set('page', String(pagination.page - 1));
                router.push(`/search?${qs.toString()}`);
            }}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => {
                const qs = new URLSearchParams(window.location.search);
                qs.set('page', String(pagination.page + 1));
                router.push(`/search?${qs.toString()}`);
            }}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// --- 2. KOMPONEN PEMBUNGKUS DENGAN SUSPENSE ---
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Memuat pencarian...</div>}>
      <SearchContent />
    </Suspense>
  );
}