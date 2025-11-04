// src/components/home/HeroSection.tsx
'use client';

interface Props {
  setPage: (path: string) => void;
}

export default function HeroSection({ setPage }: Props) {
  return (
    <section className="relative h-[80vh] min-h-[500px] text-white">
      <div className="absolute inset-0">
        <img
          src="/images/rinjani.jpg"
          alt="Pemandangan Rinjani"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          Sewa Guide & Alat Mendaki di Lombok
        </h1>
        <p className="text-2xl md:text-3xl font-light mb-8">
          GEAR SIAP, GUIDE JAGO
        </p>
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
      </div>
    </section>
  );
}