"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getJson } from '@/lib/api';
import GearCard from '@/components/shared/GearCard';
import GuideCard from '@/components/shared/GuideCard';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [limit, setLimit] = useState('10');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const doSearch = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { query, page, limit: Number(limit || 10) };
      if (type) params.type = type;
      if (location) params.location = location;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);
      if (category) params.category = category;
      if (sort) params.sort = sort;

      const data = await getJson('/search', params);
      setResults(data?.data || []);
      setPagination(data?.pagination || null);
    } catch (err: any) {
      console.error(err);
      // show server-provided message when available
      const serverMsg = err?.data?.message || err?.message || (err && JSON.stringify(err));
      setError(serverMsg || 'Gagal mengambil hasil. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On mount, parse query params from window.location (avoid useSearchParams to prevent SSR issues)
    try {
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search);
        const q = sp.get('query') || '';
        const t = sp.get('type') || '';
        const loc = sp.get('location') || '';
        const min = sp.get('minPrice') || '';
        const max = sp.get('maxPrice') || '';
        const cat = sp.get('category') || '';
        const s = sp.get('sort') || '';
        const lim = sp.get('limit') || '10';
        const page = Number(sp.get('page') || '1');

        setQuery(q);
        setType(t);
        setLocation(loc);
        setMinPrice(min);
        setMaxPrice(max);
        setCategory(cat);
        setSort(s);
        setLimit(lim);

        if (q || t || loc || min || max || cat) {
          doSearch(page);
        }

        // Fetch categories for gear dropdown by requesting gear results and extracting unique categories
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
            // non-fatal: just log
            console.warn('Failed to fetch categories', err);
          }
        })();
      }
    } catch (err) {
      console.warn('Failed to parse search params', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    doSearch(1);
  };

  const renderItem = (item: any, idx: number) => {
    // detect gear by presence of rentalPricePerDay or category
    if (item.rentalPricePerDay !== undefined || item.category) {
      const gear = {
        id: item.id,
        name: item.name,
        category: item.category || 'Lainnya',
        pricePerDay: item.rentalPricePerDay || item.rentalPrice || 0,
        vendor: item.owner?.storeName || item.owner?.storeAddress || 'Toko',
        imageUrl: item.images?.[0]?.url || item.imageUrl || '/images/placeholder.png',
        variants: [],
      };
      return (
        <div key={item.id || idx} className="w-full md:w-1/3 p-2">
          <GearCard gear={gear} />
        </div>
      );
    }

    // treat as service/guide
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

    return (
      <div key={item.id || idx} className="w-full md:w-1/3 p-2">
        <GuideCard guide={guide} />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cari</h1>

      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Kata kunci (mis. hike, rinjani, backpack)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded-md flex-1"
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
        <input type="text" placeholder="Lokasi" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 rounded-md" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded-md">
          <option value="">Semua Kategori</option>
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
            onClick={() => doSearch(pagination.page - 1)}
            className="px-3 py-2 border rounded"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => doSearch(pagination.page + 1)}
            className="px-3 py-2 border rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
