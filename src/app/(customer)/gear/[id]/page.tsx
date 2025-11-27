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

  // --- STATE UNTUK VARIAN ---
  // Array of Records, misal: [{ "Panjang": "110cm" }, { "Panjang": "120cm" }]
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>[]>([]);
  // -------------------------

  const [quantity, setQuantity] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Coba ambil langsung dari endpoint /gear/:id
        const g = await getJson(`/gear/${id}`);
        setGear(g);
      } catch (e) {
        // Fallback ke search (jika endpoint /gear/:id belum ada)
        try {
          const res = await getJson('/search', { type: 'gear', limit: 100 });
          const found = (res?.data || []).find((x: any) => x.id === id);
          if (found) setGear(found);
          else setError('Peralatan tidak ditemukan.');
        } catch (err: any) {
          console.error('Failed to load gear', err);
          setError(err?.data?.message || err?.message || 'Gagal memuat data.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // --- LOGIKA VARIAN ---
  const hasVariants = gear?.variants && gear.variants.length > 0;

  // Efek untuk menyesuaikan array selectedVariants saat quantity berubah
  useEffect(() => {
    if (!hasVariants) return;

    // Buat objek default untuk satu item
    const defaultVariantState = gear.variants.reduce((acc: any, variant: any) => {
      acc[variant.name] = ''; // Default kosong (belum dipilih)
      return acc;
    }, {} as Record<string, string>);

    // Sesuaikan array state dengan quantity baru
    setSelectedVariants(current => {
      const newArray = [...current.slice(0, quantity)];
      while (newArray.length < quantity) {
        newArray.push({ ...defaultVariantState }); // Tambahkan item baru
      }
      return newArray;
    });
  }, [quantity, hasVariants, gear?.variants]);

  // Handler untuk mengubah pilihan varian
  const handleVariantChange = (itemIndex: number, variantName: string, value: string) => {
    setSelectedVariants(current => {
      const newVariants = [...current]; // Salin array luar
      newVariants[itemIndex] = { ...newVariants[itemIndex] }; // Salin objek dalam
      newVariants[itemIndex][variantName] = value;
      return newVariants;
    });
  };
  // -----------------------

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  // Hitung durasi (inklusif, misal: 1 Nov - 2 Nov = 2 hari)
  const duration = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1
    : 0;
  const pricePerDay = gear?.rentalPricePerDay || gear?.rentalPrice || 0;
  const total = pricePerDay * duration * quantity;

  // Validasi Varian
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
    if (duration <= 0) {
      alert('Durasi booking tidak valid');
      return;
    }
    // Validasi varian sebelum kirim
    if (areVariantsIncomplete) {
      alert('Harap pilih semua opsi varian untuk setiap item.');
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
        // Kirim detail varian yang dipilih
        bookingDetails: {
          selectedVariants: selectedVariants
        }
      };

      console.log('Creating booking:', bookingData);
      const bookingResponse = await postJsonAuth('/bookings', bookingData);
      console.log('Booking response:', bookingResponse);

      // Buat payment
      const paymentResponse = await postJsonAuth('/payments', {
        bookingId: bookingResponse.id,
        amount: bookingResponse.totalAmount,
        successRedirectUrl: `${window.location.origin}/payment/success`,
        failureRedirectUrl: `${window.location.origin}/payment/failed`,
      });
      
      // Arahkan ke Midtrans
      if (paymentResponse.paymentDetails && paymentResponse.paymentDetails.redirect_url) {
        window.location.href = paymentResponse.paymentDetails.redirect_url;
      } else {
        throw new Error('Gagal mendapatkan URL pembayaran.');
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

              {/* --- BLOK VARIAN BARU --- */}
              {hasVariants && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Pilih Varian:</label>
                  {/* Render dropdown untuk setiap item dalam quantity */}
                  {Array.from({ length: quantity }).map((_, index) => (
                    <div key={index} className="mb-4 p-3 border rounded-lg bg-gray-50">
                      <span className="font-semibold text-gray-600">Item {index + 1}:</span>
                      {/* Render setiap tipe varian (misal: "Panjang", "Warna") */}
                      {gear.variants.map((variant: any) => (
                        <div key={variant.name} className="mt-2">
                          <label className="block text-sm text-gray-500 mb-1">{variant.name}</label>
                          <select
                            value={selectedVariants[index]?.[variant.name] || ''}
                            onChange={(e) => handleVariantChange(index, variant.name, e.target.value)}
                            className="text-gray-600 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Pilih {variant.name}...</option>
                            {variant.options.map((opt: string) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {/* ----------------------- */}

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