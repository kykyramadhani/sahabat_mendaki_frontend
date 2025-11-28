'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/shared/PageWrapper';
import { CheckCircle } from 'lucide-react';
import { getJson } from '@/lib/api';

export default function BookingSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // 1. Ambil data raw dari backend { booking: {...}, payments: [...] }
        const rawData = await getJson(`/bookings/${bookingId}/with-payment`);
        
        // 2. Ambil objek booking intinya saja
        const coreBooking = rawData.booking; 
        const payments = rawData.payments;

        // Debugging
        console.log('Core Booking:', coreBooking);

        if (!coreBooking) {
            throw new Error("Data booking tidak ditemukan dalam response");
        }
        
        // 3. Siapkan object state akhir (gabungkan booking + payment info)
        // Kita pakai array payments[0] karena ini success page (pembayaran terakhir)
        let finalBookingState = { 
            ...coreBooking, 
            paymentInfo: payments && payments.length > 0 ? payments[0] : null 
        };
        
        // 4. Fetch Item Details (Service/Gear)
        if (coreBooking.itemId && coreBooking.itemType) {
          try {
            let itemData = null;
            
            // Coba fetch direct endpoint dulu
            const endpoint = coreBooking.itemType === 'gear' 
                ? `/gear/${coreBooking.itemId}` 
                : `/services/${coreBooking.itemId}`;
            
            try {
                itemData = await getJson(endpoint);
            } catch (e) {
                // Fallback ke search jika endpoint direct gagal
                const searchType = coreBooking.itemType === 'gear' ? 'gear' : 'service';
                const res = await getJson('/search', { type: searchType, limit: 100 });
                itemData = (res?.data || []).find((x: any) => x.id === coreBooking.itemId);
            }
            
            if (itemData) {
              finalBookingState.itemDetails = itemData;
            }
          } catch (err) {
            console.warn('Failed to fetch item details:', err);
          }
        }

        // 5. Set State dengan struktur yang sudah datar (flattened)
        setBooking(finalBookingState);

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

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Pembayaran Berhasil!
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Terima kasih! Pembayaran Anda telah berhasil diproses.
          </p>

          {loading ? (
            <p className="text-gray-500">Memuat detail booking...</p>
          ) : booking ? (
            <>
              {/* ITEM CARD */}
              {booking.itemDetails && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 text-left flex gap-4 items-start shadow-sm">
                  <img 
                    src={booking.itemDetails.images?.[0]?.url || booking.itemDetails.imageUrl || booking.itemDetails.guide?.profilePicture || '/images/placeholder.png'} 
                    alt="Item"
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800 mb-1">
                      {booking.itemDetails.name || booking.itemDetails.title || booking.itemDetails.guide?.fullName}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                        {booking.itemType === 'gear' 
                            ? `Kategori: ${booking.itemDetails.category || 'Alat'}` 
                            : `Lokasi: ${booking.itemDetails.location || 'Lombok'}`
                        }
                    </p>
                    {/* Tampilkan rincian dari bookingDetails jika ada */}
                    {booking.bookingDetails?.priceBreakdown && (
                        <p className="text-xs text-gray-500 mt-2 italic">
                            {booking.bookingDetails.priceBreakdown}
                        </p>
                    )}
                  </div>
                </div>
              )}

              {/* DETAILS TABLE */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-left shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Rincian Pesanan</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Booking ID</span>
                    <span className="text-gray-800 font-mono text-sm">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Tipe</span>
                    <span className="text-gray-800 font-semibold capitalize">
                      {booking.itemType === 'service' ? 'Jasa Guide' : 'Sewa Alat'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Tanggal Mulai</span>
                    <span className="text-gray-800">{formatDate(booking.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Tanggal Selesai</span>
                    <span className="text-gray-800">{formatDate(booking.endDate)}</span>
                  </div>
                  
                  {/* Variant Display */}
                  {booking.bookingDetails?.selectedVariants && booking.bookingDetails.selectedVariants.length > 0 && (
                      <div className="py-2">
                          <p className="font-medium text-gray-500 mb-1">Pilihan Varian:</p>
                          <ul className="bg-gray-50 p-2 rounded text-sm text-gray-700 space-y-1">
                              {booking.bookingDetails.selectedVariants.map((v: any, i: number) => (
                                  <li key={i} className="flex justify-between">
                                      <span>Item {i+1}:</span>
                                      <span className="font-semibold">{Object.entries(v).map(([k, val]) => `${k}: ${val}`).join(', ')}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}

                  <div className="flex justify-between pt-4 border-t mt-2">
                    <span className="font-bold text-gray-800 text-lg">Total Dibayar</span>
                    <span className="text-2xl font-bold text-green-600">
                      Rp{Number(booking.totalAmount).toLocaleString('id-ID')}
                    </span>
                  </div>
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
            <button
              onClick={() => router.push('/bookings')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 shadow-md transition"
            >
              Lihat Semua Booking
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}