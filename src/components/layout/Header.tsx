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
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="https://mcylrlbnywxrtclvusfx.supabase.co/storage/v1/object/public/images-sahabat-mendaki/ChatGPT%20Image%20Sep%202,%202025,%2005_39_13%20PM.png"
            alt="Sahabat Mendaki Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-full group-hover:opacity-90 transition-opacity"
          />
          <span className="text-xl font-bold text-green-700 group-hover:text-green-800 transition-colors">
            Sahabat Mendaki
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/search?type=gear" className="text-gray-600 hover:text-green-600 font-medium transition">Sewa Alat</Link>
          <Link href="/search?type=service" className="text-gray-600 hover:text-green-600 font-medium transition">Cari Guide</Link>

          {/* Role-based menu */}
          {user?.role === 'GEAR_OWNER' && (
            <Link href="/gear-management" className="text-blue-600 font-medium hover:text-blue-700">Kelola Gear</Link>
          )}

          {user?.role === 'GUIDE' && (
            <Link href="/guide-management" className="text-blue-600 font-medium hover:text-blue-700">Kelola Layanan</Link>
          )}

          {(user?.role === 'GUIDE' || user?.role === 'GEAR_OWNER') && (
            <Link href="/cashflow" className="text-orange-600 font-medium hover:text-orange-700">Cashflow</Link>
          )}

          {user?.role === 'CUSTOMER' && (
            <Link href="/bookings" className="text-gray-600 hover:text-green-600 font-medium">Booking Saya</Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-5">
              {/* USERNAME + ICON + LINK TO PROFILE */}
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition group"
              >
                <div className="bg-green-50 p-1.5 rounded-full group-hover:bg-green-100 transition">
                    <UserIcon size={18} className="text-green-600" />
                </div>
                <span className="text-sm">
                  Halo, <b>{user.fullName.split(' ')[0]}</b>
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium transition">Masuk</Link>
              <Link href="/signup" className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium shadow-sm hover:shadow">
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg animate-fade-in-down">
          <Link href="/search?type=gear" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium">Sewa Alat</Link>
          <Link href="/search?type=service" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium">Cari Guide</Link>

          {user ? (
            <>
              <div className="border-t my-1"></div>
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
                <Link href="/gear-management" onClick={() => setIsMenuOpen(false)} className="text-blue-600">
                  Kelola Gear
                </Link>
              )}

              {user.role === 'GUIDE' && (
                <Link href="/guide-management" onClick={() => setIsMenuOpen(false)} className="text-blue-600">
                  Kelola Layanan
                </Link>
              )}

              {(user.role === 'GUIDE' || user.role === 'GEAR_OWNER') && (
                <Link href="/cashflow" onClick={() => setIsMenuOpen(false)} className="text-orange-600">
                  Laporan Keuangan
                </Link>
              )}

              {user.role === 'CUSTOMER' && (
                <Link href="/bookings" onClick={() => setIsMenuOpen(false)} className="text-gray-700">
                  Booking Saya
                </Link>
              )}

              <hr />
              <button onClick={logout} className="text-red-500 text-left font-medium flex items-center gap-2">
                <LogOut size={16}/> Logout
              </button>
            </>
          ) : (
            <>
              <hr />
              <Link href="/login" className="text-green-600 font-bold">Masuk</Link>
              <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded text-center">Daftar</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}