'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
          ⛰️ Sahabat Mendaki
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/search?type=gear" className="text-gray-600 hover:text-green-600">Sewa Alat</Link>
          <Link href="/search?type=service" className="text-gray-600 hover:text-green-600">Cari Guide</Link>
          
          {/* Role-based menu */}
          {user?.role === 'GEAR_OWNER' && (
            <Link href="/gear-management" className="text-blue-600 font-medium">Kelola Gear</Link>
          )}

          {user?.role === 'GUIDE' && (
            <>
              <Link href="/guide-management" className="text-blue-600 font-medium">Kelola Layanan</Link>

              {/* ➜ LINK CASHFLOW DITAMBAHKAN DI SINI */}
              <Link href="/guide-management/cashflow" className="text-orange-600 font-medium">
                Cashflow
              </Link>
            </>
          )}
          {user?.role === 'CUSTOMER' && (
            <Link href="/bookings" className="text-gray-600 hover:text-green-600">Booking Saya</Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Halo, <b>{user.fullName.split(' ')[0]}</b></span>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium">Masuk</Link>
              <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Dropdown (Sederhana) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg">
          <Link href="/search?type=gear" onClick={() => setIsMenuOpen(false)}>Sewa Alat</Link>
          <Link href="/search?type=service" onClick={() => setIsMenuOpen(false)}>Cari Guide</Link>
          {user ? (
            <>
              {user.role === 'GEAR_OWNER' && <Link href="/gear-management">Kelola Gear</Link>}
              {user.role === 'GUIDE' && <Link href="/guide-management">Kelola Layanan</Link>}
              {user.role === 'CUSTOMER' && <Link href="/bookings">Booking Saya</Link>}
              <hr />
              <button onClick={logout} className="text-red-500 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-green-600 font-bold">Masuk</Link>
              <Link href="/signup">Daftar</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}