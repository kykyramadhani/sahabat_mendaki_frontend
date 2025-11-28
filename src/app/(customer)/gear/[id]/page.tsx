'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/shared/PageWrapper';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // State Varian
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>[]>([]);

  const [quantity, setQuantity] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const g = await getJson(`/gear/${id}`);
        setGear(g);
      } catch (e) {
        // Fallback search
        try {
            const res = await getJson('/search', { type: 'gear', limit: 100 });
            const found = (res?.data || []).find((x: any) => x.id === id);
            if (found) setGear(found);
            else setError('Peralatan tidak ditemukan.');
        } catch (err: any) {
            setError('Gagal memuat data.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const hasVariants = gear?.variants && gear.variants.length > 0;

  useEffect(() => {
    if (!hasVariants) return;
    const defaultVariantState = gear.variants.reduce((acc: any, variant: any) => {
      acc[variant.name] = ''; 
      return acc;
    }, {} as Record<string, string>);

    setSelectedVariants(current => {
      const newArray = [...current.slice(0, quantity)];
      while (newArray.length < quantity) {
        newArray.push({ ...defaultVariantState });
      }
      return newArray;
    });
  }, [quantity, hasVariants, gear?.variants]);

  const handleVariantChange = (itemIndex: number, variantName: string, value: string) => {
    setSelectedVariants(current => {
      const newVariants = [...current];
      newVariants[itemIndex] = { ...newVariants[itemIndex] };
      newVariants[itemIndex][variantName] = value;
      return newVariants;
    });
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  // --- PERBAIKAN 1: DURASI SESUAI BACKEND (HAPUS +1) ---
  // Backend: (End - Start). Misal Tgl 1 ke Tgl 2 = 1 Hari (24 jam)
  // Jika tanggal sama, minimal 1 hari.
  const duration = startDate && endDate
    ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)))
    : 0;

  const pricePerDay = gear?.rentalPricePerDay || gear?.rentalPrice || 0;
  const total = pricePerDay * duration * quantity;

  const areVariantsIncomplete = hasVariants && selectedVariants.some(variantSet => 
    Object.values(variantSet).some(option => option === '')
  );

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
    // Validasi tambahan agar End Date tidak sebelum Start Date
    if (endDate < startDate) {
        alert('Tanggal selesai harus setelah tanggal mulai');
        return;
    }
    
    if (areVariantsIncomplete) {
      alert('Harap pilih semua opsi varian.');
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
        bookingDetails: {
          selectedVariants: selectedVariants
        }
      };

      console.log('Creating booking:', bookingData);
      
      // --- PERBAIKAN 2: REQUEST BOOKING & HANDLE PAYMENT URL LANGSUNG ---
      const response = await postJsonAuth('/bookings', bookingData);
      console.log('Booking response:', response);

      // Backend return structure: { booking: {...}, payment: { paymentUrl: "..." } }
      if (response.payment && response.payment.paymentUrl) {
        // Redirect langsung ke Midtrans
        window.location.href = response.payment.paymentUrl;
      } else {
        // Jika gratis atau tidak ada payment link (jarang terjadi)
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

  if (loading) return <PageWrapper><p className="text-center p-8">Memuat...</p></PageWrapper>;
  if (error) return <PageWrapper><p className="text-center p-8 text-red-600">{error}</p></PageWrapper>;
  if (!gear) return <PageWrapper><p className="text-center text-gray-500">Peralatan tidak ditemukan.</p></PageWrapper>;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 bg-white">
        <h1 className="text-gray-700 text-4xl font-bold text-center mb-8">
          Detail Booking {gear.name || gear.title}
        </h1>
        <div className="grid md:grid-cols-2 gap-12">
          {/* ... (Bagian Gambar & Info Produk SAMA SEPERTI SEBELUMNYA) ... */}
          <div>
            <img 
              src={gear.images?.[0]?.url || '/images/placeholder.png'} 
              alt={gear.name} 
              className="w-full h-80 object-cover rounded-lg shadow-md" 
            />
            <div className="mt-4">
                <h3 className="font-bold">Deskripsi</h3>
                <p className="text-gray-600">{gear.description}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
               {/* ... (Bagian Info Harga & Stock SAMA) ... */}
               <p className="text-green-600 font-bold text-2xl mb-6">
                Rp{pricePerDay.toLocaleString('id-ID')} / hari
              </p>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Jumlah:</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleQuantityChange(quantity - 1)} className="bg-green-200 px-4 py-2 rounded" disabled={quantity <= 1}>−</button>
                  <span className="text-xl">{quantity}</span>
                  <button onClick={() => handleQuantityChange(quantity + 1)} className="bg-green-200 px-4 py-2 rounded">+</button>
                </div>
              </div>

              {/* Varian Logic (Tetap) */}
              {hasVariants && (
                <div className="mb-6">
                    <label className="font-bold">Pilih Varian:</label>
                    {Array.from({ length: quantity }).map((_, index) => (
                    <div key={index} className="mb-4 p-3 border rounded bg-gray-50">
                        <span className="text-sm font-bold">Item {index + 1}</span>
                        {gear.variants.map((variant: any) => (
                        <div key={variant.name} className="mt-2">
                            <label className="text-xs text-gray-500">{variant.name}</label>
                            <select
                            value={selectedVariants[index]?.[variant.name] || ''}
                            onChange={(e) => handleVariantChange(index, variant.name, e.target.value)}
                            className="w-full border p-1 rounded"
                            >
                            <option value="">Pilih...</option>
                            {variant.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        ))}
                    </div>
                    ))}
                </div>
              )}

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
                    className="border p-2 rounded w-full"
                  />
                  <DatePicker 
                    selected={endDate} 
                    onChange={setEndDate} 
                    selectsEnd 
                    startDate={startDate} 
                    endDate={endDate} 
                    minDate={startDate ?? new Date()}
                    placeholderText="Tanggal Selesai" 
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
              
              <textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Catatan..." 
                className="w-full border p-2 rounded mb-4"
              />
            </div>

            <div className="bg-green-50 text-gray-600 p-4 rounded-lg mb-6">
              <p>Durasi: {duration} hari</p>
              <p>Total: <span className="font-bold text-xl text-green-600">Rp{total.toLocaleString('id-ID')}</span></p>
            </div>

            <button 
              onClick={handleBooking} 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
              disabled={duration <= 0 || bookingLoading || areVariantsIncomplete}
            >
              {bookingLoading ? 'Memproses...' : 'Booking & Bayar'}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}