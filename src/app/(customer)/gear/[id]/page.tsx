'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/shared/PageWrapper';
import DatePicker from 'react-datepicker';
import { getJson, postJsonAuth } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import 'react-datepicker/dist/react-datepicker.css';
import { Image as ImageIcon } from 'lucide-react';

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

  // Durasi sesuai backend (inklusif)
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

      const response = await postJsonAuth('/bookings', bookingData);

      if (response.payment && response.payment.paymentUrl) {
        window.location.href = response.payment.paymentUrl;
      } else {
        router.push(`/bookings/${response.booking.id}/success`);
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
        <h1 className="text-gray-700 text-3xl md:text-4xl font-bold text-center mb-8">
          Detail Sewa: {gear.name || gear.title}
        </h1>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          
          {/* --- IMAGE SECTION (FIXED) --- */}
          <div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md bg-gray-100 border border-gray-200">
              {gear.images?.[0]?.url ? (
                <img 
                  src={gear.images[0].url} 
                  alt={gear.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon size={64} />
                </div>
              )}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2">Deskripsi Produk</h3>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{gear.description}</p>
            </div>
          </div>
          {/* ----------------------------- */}

          <div className="flex flex-col justify-between">
            <div>
               <p className="text-green-600 font-bold text-3xl mb-6">
                Rp{pricePerDay.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">/ hari</span>
              </p>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Jumlah Sewa:</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleQuantityChange(quantity - 1)} className="bg-green-100 hover:bg-green-200 px-4 py-2 rounded text-green-700 transition" disabled={quantity <= 1}>−</button>
                  <span className="text-xl text-gray-700 font-medium w-8 text-center">{quantity}</span>
                  <button onClick={() => handleQuantityChange(quantity + 1)} className="bg-green-100 hover:bg-green-200 px-4 py-2 rounded text-green-700 transition" disabled={quantity >= (gear.stock || 99)}>+</button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Stok tersedia: {gear.stock}</p>
              </div>

              {/* Varian Logic (Tetap) */}
              {hasVariants && (
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Pilih Varian:</label>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {Array.from({ length: quantity }).map((_, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-gray-50">
                            <span className="text-sm font-semibold text-gray-700 mb-2 block">Item {index + 1}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {gear.variants.map((variant: any) => (
                                <div key={variant.name}>
                                    <label className="block text-xs text-gray-500 mb-1">{variant.name}</label>
                                    <select
                                    value={selectedVariants[index]?.[variant.name] || ''}
                                    onChange={(e) => handleVariantChange(index, variant.name, e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                    >
                                    <option value="">Pilih...</option>
                                    {variant.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                ))}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Pilih Tanggal Sewa:</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full">
                    <DatePicker 
                        selected={startDate} 
                        onChange={setStartDate} 
                        selectsStart 
                        startDate={startDate} 
                        endDate={endDate}
                        minDate={new Date()}
                        placeholderText="Mulai Sewa" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="w-full">
                    <DatePicker 
                        selected={endDate} 
                        onChange={setEndDate} 
                        selectsEnd 
                        startDate={startDate} 
                        endDate={endDate} 
                        minDate={startDate ?? new Date()}
                        placeholderText="Selesai Sewa" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Catatan (Opsional):</label>
                <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    placeholder="Contoh: Tolong siapkan yang warna merah..." 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                />
              </div>
            </div>

            <div className="bg-green-50 text-gray-700 p-5 rounded-xl mb-6 border border-green-100">
              <div className="flex justify-between items-center mb-1">
                <span>Durasi Sewa</span>
                <span className="font-semibold">{duration} hari</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span>Jumlah Barang</span>
                <span className="font-semibold">{quantity} unit</span>
              </div>
              <div className="border-t border-green-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-lg">Total Pembayaran</span>
                <span className="font-bold text-xl text-green-700">Rp{total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              onClick={handleBooking} 
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={duration <= 0 || bookingLoading || areVariantsIncomplete}
            >
              {bookingLoading ? 'Memproses Booking...' : 'Booking & Bayar Sekarang'}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}