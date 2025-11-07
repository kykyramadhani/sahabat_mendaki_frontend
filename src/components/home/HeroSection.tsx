'use client';

interface HeroSectionProps {
  setPage: (path: string) => void;  
}

export default function HeroSection({ setPage }: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] min-h-[500px] text-white">
      {/* ... isi sama seperti sebelumnya ... */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); setPage('guides'); }}
          className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-transform hover:scale-105"
        >
          Cari Guide
        </a>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); setPage('gear'); }}
          className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-transform hover:scale-105"
        >
          Sewa Peralatan
        </a>
      </div>
    </section>
  );
}