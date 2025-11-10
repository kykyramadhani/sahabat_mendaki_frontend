'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import DatePicker from 'react-datepicker';
import { getJson, postJsonAuth } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import 'react-datepicker/dist/react-datepicker.css';

export default function GearDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [gear, setGear] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [quantity, setQuantity] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // try direct gear endpoint first
        try {
          const g = await getJson(`/gear/${id}`);
          setGear(g);
          return;
        } catch (e) {
          // fallback to search
        }

        const res = await getJson('/search', { type: 'gear', limit: 100 });
        const found = (res?.data || []).find((x: any) => x.id === id);
        if (found) setGear(found);
        else setError('Peralatan tidak ditemukan.');
      } catch (err: any) {
        console.error('Failed to load gear', err);
        setError(err?.data?.message || err?.message || 'Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <PageWrapper><p className="text-center p-8">Memuat...</p></PageWrapper>;
  if (error) return <PageWrapper><p className="text-center p-8 text-red-600">{error}</p></PageWrapper>;
  if (!gear) return <PageWrapper><p className="text-center text-gray-500">Peralatan tidak ditemukan.</p></PageWrapper>;

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  // Calculate duration: difference in days (matching backend calculation)
  // Example: 11 Nov - 12 Nov = 1 day
  const duration = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    : 0;
  const pricePerDay = gear.rentalPricePerDay || gear.rentalPrice || 0;
  const total = pricePerDay * duration * quantity;

  const handleBooking = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    if (!startDate || !endDate) {
      alert('Pilih tanggal booking terlebih dahulu');
      return;
    }

    if (duration <= 0) {
      alert('Durasi booking tidak valid');
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        itemType: 'gear',
        itemId: gear.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        quantity: quantity,
        notes: notes || undefined,
      };

      console.log('Creating booking:', bookingData);
      const response = await postJsonAuth('/bookings', bookingData);
      
      console.log('Booking response:', response);
      
      // Backend returns { booking, payment }
      if (response.payment && response.payment.paymentUrl) {
        // Redirect to Midtrans payment page
        window.location.href = response.payment.paymentUrl;
      } else {
        alert('Booking berhasil dibuat!');
        router.push('/bookings');
      }
    } catch (err: any) {
      console.error('Booking failed:', err);
      alert(err?.data?.message || err?.message || 'Gagal membuat booking');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 bg-white">
        <h1 className="text-gray-700 text-4xl font-bold text-center mb-8">
          Detail Booking {gear.name || gear.title}
        </h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img 
              src={gear.images?.[0]?.url || '/images/placeholder.png'} 
              alt={gear.name || gear.title} 
              className="w-full h-80 object-cover rounded-lg shadow-md" 
            />
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Deskripsi</h3>
              <p className="text-gray-600">{gear.description || 'Tidak ada deskripsi'}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-gray-600 mb-2">Kategori: {gear.category || 'Lainnya'}</p>
              <p className="text-gray-600 mb-2">Pemilik: {gear.owner?.storeName || gear.owner?.address || 'Toko'}</p>
              <p className="text-green-600 font-bold text-2xl mb-6">
                Rp{pricePerDay.toLocaleString('id-ID')} / hari
              </p>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Jumlah:</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)} 
                    className="bg-green-200 px-4 py-2 rounded hover:bg-green-300 text-gray-600" 
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="text-xl text-gray-600">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)} 
                    className="bg-green-200 px-4 py-2 rounded hover:bg-green-300 text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Pilih Tanggal Sewa:</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <DatePicker 
                    selected={startDate} 
                    onChange={setStartDate} 
                    selectsStart 
                    startDate={startDate} 
                    endDate={endDate}
                    minDate={new Date()}
                    placeholderText="Tanggal Mulai" 
                    className="text-gray-600 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <DatePicker 
                    selected={endDate} 
                    onChange={setEndDate} 
                    selectsEnd 
                    startDate={startDate} 
                    endDate={endDate} 
                    minDate={startDate ?? new Date()}
                    placeholderText="Tanggal Selesai" 
                    className="text-gray-600 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Catatan (Opsional):</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk penyewa..."
                  className="text-gray-600 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-green-50 text-gray-600 p-4 rounded-lg mb-6">
              <p>Durasi: {duration} hari</p>
              <p>Harga per hari: Rp{pricePerDay.toLocaleString('id-ID')}</p>
              <p>Jumlah: {quantity}</p>
              <p className="text-green-600 font-bold text-xl mt-2">
                Total: Rp{total.toLocaleString('id-ID')}
              </p>
            </div>

            <button 
              onClick={handleBooking} 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={duration <= 0 || bookingLoading}
            >
              {bookingLoading ? 'Memproses...' : 'Booking & Bayar'}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
