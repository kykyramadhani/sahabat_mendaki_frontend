'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import { getJson } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const id = params.id as string;

  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    fetchBookingDetail();
  }, [id, user, authLoading, router]);

  const fetchBookingDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJson(`/bookings/${id}/with-payment`);
      console.log('Booking detail response:', data);
      console.log('Booking keys:', Object.keys(data || {}));
      console.log('Start date:', data?.startDate, data?.booking?.startDate);
      console.log('Total amount:', data?.totalAmount, data?.booking?.totalAmount);
      setBooking(data);
      
      // Try to fetch item details if available
      const itemId = data?.itemId || data?.booking?.itemId;
      const itemType = data?.itemType || data?.booking?.itemType;
      
      if (itemId && itemType) {
        try {
          let itemData = null;
          if (itemType === 'gear') {
            try {
              itemData = await getJson(`/gear/${itemId}`);
            } catch (e) {
              // Fallback to search
              const res = await getJson('/search', { type: 'gear', limit: 100 });
              itemData = (res?.data || []).find((x: any) => x.id === itemId);
            }
          } else if (itemType === 'service') {
            try {
              itemData = await getJson(`/services/${itemId}`);
            } catch (e) {
              // Fallback to search
              const res = await getJson('/search', { type: 'service', limit: 100 });
              itemData = (res?.data || []).find((x: any) => x.id === itemId);
            }
          }
          
          if (itemData) {
            setBooking({ ...data, itemDetails: itemData });
          }
        } catch (err) {
          console.warn('Failed to fetch item details:', err);
          // Non-fatal, just continue without item details
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch booking detail', err);
      setError(err?.data?.message || err?.message || 'Gagal memuat detail booking');
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
      SETTLED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Lunas' },
      EXPIRED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Kadaluarsa' },
      FAILED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Gagal' },
      DENIED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
    };
    const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Tanggal tidak valid';
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const formatDateTime = (dateString: string | undefined | null) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Tanggal tidak valid';
      return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Tanggal tidak valid';
    }
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

  if (error) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => router.push('/bookings')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Kembali ke Daftar Booking
          </button>
        </div>
      </PageWrapper>
    );
  }

  if (!booking) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-gray-500">Booking tidak ditemukan</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Detail Booking</h1>
            <button
              onClick={() => router.push('/bookings')}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              ← Kembali
            </button>
          </div>

          {/* Item Details Section */}
          {booking.itemDetails && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {booking.itemType === 'service' ? 'Detail Guide' : 'Detail Peralatan'}
              </h2>
              <div className="flex gap-4">
                <img 
                  src={booking.itemDetails.images?.[0]?.url || booking.itemDetails.imageUrl || booking.itemDetails.guide?.profilePicture || '/images/placeholder.png'} 
                  alt={booking.itemDetails.name || booking.itemDetails.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {booking.itemDetails.name || booking.itemDetails.title || booking.itemDetails.guide?.fullName}
                  </h3>
                  {booking.itemType === 'gear' && (
                    <>
                      <p className="text-gray-600 text-sm mb-1">
                        Kategori: {booking.itemDetails.category || 'Lainnya'}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        Pemilik: {booking.itemDetails.owner?.storeName || booking.itemDetails.owner?.address || 'Toko'}
                      </p>
                      <p className="text-green-600 font-semibold">
                        Rp{(booking.itemDetails.rentalPricePerDay || booking.itemDetails.rentalPrice || 0).toLocaleString('id-ID')} / hari
                      </p>
                    </>
                  )}
                  {booking.itemType === 'service' && (
                    <>
                      <p className="text-gray-600 text-sm mb-1">
                        Lokasi: {booking.itemDetails.location || booking.itemDetails.specialty || '-'}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        Rating: {(booking.itemDetails.rating || 0).toFixed(1)} ⭐
                      </p>
                      <p className="text-green-600 font-semibold">
                        Rp{(booking.itemDetails.pricePerDay || booking.itemDetails.price || 0).toLocaleString('id-ID')} / hari
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {(booking.itemType || booking.booking?.itemType) === 'service' ? 'Guide Service' : 'Gear Rental'}
              </h2>
              {getStatusBadge(booking.status || booking.booking?.status || 'PENDING')}
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Booking ID:</span>
                <span className="text-gray-600 text-sm break-all">{booking.id || booking.booking?.id || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tanggal Mulai:</span>
                <span className="text-gray-600">{formatDate(booking.startDate || booking.booking?.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tanggal Selesai:</span>
                <span className="text-gray-600">{formatDate(booking.endDate || booking.booking?.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Jumlah:</span>
                <span className="text-gray-600">
                  {booking.quantity || booking.booking?.quantity || 0} {(booking.itemType || booking.booking?.itemType) === 'service' ? 'orang' : 'item'}
                </span>
              </div>
              {(booking.numberOfPeople || booking.booking?.numberOfPeople) && (
                <div className="flex justify-between">
                  <span className="font-medium">Jumlah Anggota:</span>
                  <span className="text-gray-600">{booking.numberOfPeople || booking.booking?.numberOfPeople} orang</span>
                </div>
              )}
              {(booking.notes || booking.booking?.notes) && (
                <div className="flex justify-between">
                  <span className="font-medium">Catatan:</span>
                  <span className="text-gray-600 text-right max-w-md">{booking.notes || booking.booking?.notes}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t">
                <span className="font-medium">Total Pembayaran:</span>
                <span className="text-2xl font-bold text-green-600">
                  Rp{(booking.totalAmount || booking.booking?.totalAmount || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Dibuat:</span>
                <span className="text-gray-600">{formatDateTime(booking.createdAt || booking.booking?.createdAt)}</span>
              </div>
            </div>
          </div>

          {booking.payment && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Pembayaran</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Status Pembayaran:</span>
                  {getStatusBadge(booking.payment.status)}
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Jumlah:</span>
                  <span className="text-gray-600">
                    Rp{booking.payment.amount?.toLocaleString('id-ID') || '0'}
                  </span>
                </div>
                {booking.payment.paymentUrl && booking.payment.status === 'PENDING' && (
                  <div className="pt-4">
                    <a
                      href={booking.payment.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700"
                    >
                      Lanjutkan Pembayaran
                    </a>
                  </div>
                )}
                {booking.payment.expiresAt && booking.payment.status === 'PENDING' && (
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Batas Waktu:</span>
                    <span className="text-red-600">{formatDateTime(booking.payment.expiresAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
