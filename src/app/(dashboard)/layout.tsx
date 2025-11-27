'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Proteksi Dashboard: Redirect jika tidak login
    if (!loading && !user) {
      router.push('/login');
    }
    // Proteksi Dashboard: Redirect jika Customer nyasar ke sini
    if (!loading && user && user.role === 'CUSTOMER') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat Dashboard...</p>
      </div>
    );
  }

  // Jika user tidak ada (sedang redirect), jangan render children untuk mencegah flash
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar atau Sub-Header khusus Dashboard bisa ditaruh sini */}
      <div className="bg-white border-b px-6 py-4 mb-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-semibold text-gray-700">
            Dashboard Mitra &mdash; {user.role === 'GEAR_OWNER' ? 'Pemilik Gear' : 'Guide'}
          </span>
        </div>
      </div>
      
      <main>{children}</main>
    </div>
  );
}