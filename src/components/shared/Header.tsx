'use client';

import { Mountain, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const NavLinksData = [
    { href: '/', label: 'Home' },
    { href: '/gear', label: 'Sewa Alat' },
    { href: '/guides', label: 'Cari Guide' },
    { href: '/about', label: 'Tentang Kami' },
  ];

  const handleNav = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const handleBooking = () => {
    router.push('/#how-it-works');
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    router.push('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); handleNav('/'); }}
          className="flex items-center gap-2"
        >
          <Mountain className="w-8 h-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-800">
            Sahabat<span className="text-green-600">Mendaki</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {NavLinksData.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Tombol Login */}
          <button
            onClick={handleLogin}
            className="border border-green-600 text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Login
          </button>

          <button
            onClick={handleBooking}
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-shadow shadow-md ml-2"
          >
            Booking Sekarang
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-xl z-40">
          <nav className="flex flex-col p-4">
            {NavLinksData.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                className="py-3 px-4 text-lg text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {link.label}
              </a>
            ))}

            {/* Tombol Login (Mobile) */}
            <button
              onClick={handleLogin}
              className="mt-3 border border-green-600 text-green-600 text-center py-3 px-4 rounded-lg font-semibold hover:bg-green-50"
            >
              Login
            </button>

            <button
              onClick={handleBooking}
              className="mt-3 bg-green-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-green-700"
            >
              Booking Sekarang
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
