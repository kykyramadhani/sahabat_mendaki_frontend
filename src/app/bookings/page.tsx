'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import { getJson } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    fetchBookings();
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson('/bookings');
      setBookings(data || []);
    } catch (err: any) {
      console.error('Failed to fetch bookings', err);
      setError(err?.data?.message || err?.message || 'Gagal memuat data booking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu Pembayaran' },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Terkonfirmasi' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Selesai' },
    };
    const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-12">
          <p className="text-center">Memuat...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Booking Saya</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Belum ada booking</p>
            <button
              onClick={() => router.push('/search')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Mulai Booking
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/bookings/${booking.id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {booking.itemType === 'service' ? 'Guide Service' : 'Gear Rental'}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Tanggal:</span> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Jumlah:</span> {booking.quantity} {booking.itemType === 'service' ? 'orang' : 'item'}
                    </p>
                    {booking.notes && (
                      <p className="text-gray-600 text-sm italic">Catatan: {booking.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      Rp{booking.totalAmount?.toLocaleString('id-ID') || '0'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Dibuat: {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
