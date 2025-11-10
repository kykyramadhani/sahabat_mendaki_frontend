'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import { XCircle } from 'lucide-react';
import { getJson } from '@/lib/api';

export default function BookingFailedPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getJson(`/bookings/${bookingId}/with-payment`);
        setBooking(data);
        
        // Try to fetch item details
        if (data && data.itemId && data.itemType) {
          try {
            let itemData = null;
            if (data.itemType === 'gear') {
              try {
                itemData = await getJson(`/gear/${data.itemId}`);
              } catch (e) {
                const res = await getJson('/search', { type: 'gear', limit: 100 });
                itemData = (res?.data || []).find((x: any) => x.id === data.itemId);
              }
            } else if (data.itemType === 'service') {
              try {
                itemData = await getJson(`/services/${data.itemId}`);
              } catch (e) {
                const res = await getJson('/search', { type: 'service', limit: 100 });
                itemData = (res?.data || []).find((x: any) => x.id === data.itemId);
              }
            }
            
            if (itemData) {
              setBooking({ ...data, itemDetails: itemData });
            }
          } catch (err) {
            console.warn('Failed to fetch item details:', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const canRetryPayment = booking?.payment?.status === 'PENDING' && booking?.payment?.paymentUrl;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <XCircle className="w-24 h-24 text-red-600 mx-auto" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Pembayaran Gagal
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi.
          </p>

          {loading ? (
            <p className="text-gray-500">Memuat detail booking...</p>
          ) : booking ? (
            <>
              {booking.itemDetails && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 text-left">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {booking.itemType === 'service' ? 'Detail Guide' : 'Detail Peralatan'}
                  </h2>
                  <div className="flex gap-4">
                    <img 
                      src={booking.itemDetails.images?.[0]?.url || booking.itemDetails.imageUrl || booking.itemDetails.guide?.profilePicture || '/images/placeholder.png'} 
                      alt={booking.itemDetails.name || booking.itemDetails.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {booking.itemDetails.name || booking.itemDetails.title || booking.itemDetails.guide?.fullName}
                      </h3>
                      {booking.itemType === 'gear' && (
                        <p className="text-gray-600 text-sm">
                          {booking.itemDetails.category || 'Lainnya'}
                        </p>
                      )}
                      {booking.itemType === 'service' && (
                        <p className="text-gray-600 text-sm">
                          {booking.itemDetails.location || booking.itemDetails.specialty || '-'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Booking</h2>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Booking ID:</span>
                    <span className="text-gray-600 text-sm">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tipe:</span>
                    <span className="text-gray-600">
                      {booking.itemType === 'service' ? 'Guide Service' : 'Gear Rental'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tanggal:</span>
                    <span className="text-gray-600">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-medium">Total:</span>
                    <span className="text-2xl font-bold text-gray-800">
                      Rp{booking.totalAmount?.toLocaleString('id-ID') || '0'}
                    </span>
                  </div>
                  {booking.payment && (
                    <div className="flex justify-between">
                      <span className="font-medium">Status Pembayaran:</span>
                      <span className="text-red-600 font-semibold">{booking.payment.status}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-yellow-800">
                Detail booking tidak dapat dimuat. Silakan cek halaman booking Anda.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {canRetryPayment && (
              <a
                href={booking.payment.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                Coba Bayar Lagi
              </a>
            )}
            <button
              onClick={() => router.push('/bookings')}
              className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Lihat Semua Booking
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
