'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { LogOut, Menu, User as UserIcon } from 'lucide-react';
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
            <Link href="/guide-management" className="text-blue-600 font-medium">Kelola Layanan</Link>
          )}

          {(user?.role === 'GUIDE' || user?.role === 'GEAR_OWNER') && (
            <Link href="/cashflow" className="text-orange-600 font-medium">Cashflow</Link>
          )}

          {user?.role === 'CUSTOMER' && (
            <Link href="/bookings" className="text-gray-600 hover:text-green-600">Booking Saya</Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-5">

              {/* USERNAME + ICON + LINK TO PROFILE */}
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
              >
                <UserIcon size={18} className="text-green-600" />
                <span className="text-sm">
                  Halo, <b>{user.fullName.split(' ')[0]}</b>
                </span>
              </Link>

              {/* Logout */}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg">
          <Link href="/search?type=gear" onClick={() => setIsMenuOpen(false)}>Sewa Alat</Link>
          <Link href="/search?type=service" onClick={() => setIsMenuOpen(false)}>Cari Guide</Link>

          {user ? (
            <>
              {/* Profile */}
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-green-700 font-medium"
              >
                <UserIcon size={18} /> Profil Saya
              </Link>

              {/* Role menu */}
              {user.role === 'GEAR_OWNER' && (
                <Link href="/gear-management" onClick={() => setIsMenuOpen(false)}>
                  Kelola Gear
                </Link>
              )}

              {user.role === 'GUIDE' && (
                <Link href="/guide-management" onClick={() => setIsMenuOpen(false)}>
                  Kelola Layanan
                </Link>
              )}

              {(user.role === 'GUIDE' || user.role === 'GEAR_OWNER') && (
                <Link href="/cashflow" onClick={() => setIsMenuOpen(false)} className="text-orange-600 font-medium">
                  Laporan Keuangan
                </Link>
              )}

              {user.role === 'CUSTOMER' && (
                <Link href="/bookings" onClick={() => setIsMenuOpen(false)}>
                  Booking Saya
                </Link>
              )}

              <hr />
              <button onClick={logout} className="text-red-500 text-left">
                Logout
              </button>
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