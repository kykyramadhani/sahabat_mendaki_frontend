'use client';

import { useState } from 'react';
import { GUIDE_DATA } from '@/data/mock';
import GuideCard from '@/components/shared/GuideCard';
import { Search, Filter } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredGuides = GUIDE_DATA.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Temukan Guide Profesional
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Jelajahi Lombok dengan aman dan nyaman didampingi pemandu berpengalaman.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
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
        <button className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          Guide tidak ditemukan. Coba kata kunci lain.
        </p>
      )}
      </div>
    </PageWrapper>
  );
}
