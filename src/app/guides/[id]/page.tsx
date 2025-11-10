'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import DatePicker from 'react-datepicker';
import { getJson, postJsonAuth } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import 'react-datepicker/dist/react-datepicker.css';

export default function GuideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [guide, setGuide] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // --- STATE UNTUK VARIAN ---
  // Array of Records, misal: [{ "Layanan": "Makan" }, { "Layanan": "Tidak Makan" }]
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>[]>([]);
  // -------------------------

  // State untuk form
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const serviceData = await getJson(`/services/${id}`);
        setGuide(serviceData);
      } catch (err: any) {
        console.error('Failed to load guide/service', err);
        setError(err?.data?.message || err?.message || 'Gagal memuat data paket.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // --- LOGIKA VARIAN ---
  const hasVariants = guide?.variants && guide.variants.length > 0;

  // Efek untuk menyesuaikan array selectedVariants saat numberOfPeople berubah
  useEffect(() => {
    if (!hasVariants) return;

    // Buat objek default untuk satu orang
    const defaultVariantState = guide.variants.reduce((acc: any, variant: any) => {
      acc[variant.name] = ''; // Default kosong (belum dipilih)
      return acc;
    }, {} as Record<string, string>);

    // Sesuaikan array state dengan quantity baru
    setSelectedVariants(current => {
      const newArray = [...current.slice(0, numberOfPeople)];
      while (newArray.length < numberOfPeople) {
        newArray.push({ ...defaultVariantState }); // Tambahkan orang baru
      }
      return newArray;
    });
  }, [numberOfPeople, hasVariants, guide?.variants]);

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

  if (loading) return <PageWrapper><p className="text-center p-8">Memuat...</p></PageWrapper>;
  if (error) return <PageWrapper><p className="text-center p-8 text-red-600">{error}</p></PageWrapper>;
  if (!guide) return <PageWrapper><p className="text-center text-gray-500">Paket guide tidak ditemukan.</p></PageWrapper>;

  // --- Logika Baru Sesuai Data Backend ---
  const servicePrice = guide.price || 0;
  const serviceDuration = guide.duration || 1;
  const maxGroupSize = guide.maxGroupSize || 1;

  const calculatedEndDate = startDate
    ? new Date(startDate.getTime() + (serviceDuration - 1) * 24 * 60 * 60 * 1000)
    : null;

  const total = servicePrice; // Harga paket tetap
  // ---------------------------------------

  // Validasi Varian
  const areVariantsIncomplete = hasVariants && selectedVariants.some(variantSet => 
    Object.values(variantSet).some(option => option === '')
  );

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    if (newQty > maxGroupSize) {
      alert(`Maksimal ${maxGroupSize} orang untuk paket ini.`);
      return;
    }
    setNumberOfPeople(newQty);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }
    if (!startDate) {
      alert('Pilih tanggal booking terlebih dahulu');
      return;
    }
    if (numberOfPeople > maxGroupSize) {
       alert(`Maksimal ${maxGroupSize} orang untuk paket ini.`);
       return;
    }
    // Validasi varian sebelum kirim
    if (areVariantsIncomplete) {
      alert('Harap pilih semua opsi varian untuk setiap anggota.');
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        itemType: 'service',
        itemId: guide.id,
        startDate: startDate.toISOString(),
        endDate: calculatedEndDate?.toISOString(),
        quantity: 1, // Kuantitas paket adalah 1
        numberOfPeople: numberOfPeople, // Jumlah orang
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

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 bg-white">
        <h1 className="text-gray-700 text-4xl font-bold text-center mb-8">Detail Booking: {guide.title}</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img src={guide.images?.[0]?.url || '/images/placeholder.png'} alt={guide.title} className="w-full h-80 object-cover rounded-lg shadow-md" />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-gray-600 mb-2">Rating: {(guide.rating ?? 0).toFixed(1)} stars</p>
              <p className="text-gray-600 mb-2">Lokasi: {guide.location}</p>
              <p className="text-gray-600 mb-4">{guide.description}</p>
              
              <p className="text-green-600 font-bold text-2xl mb-6">
                Rp{servicePrice.toLocaleString('id-ID')} / paket
              </p>
              <p className="text-gray-600 mb-2 -mt-4">
                Durasi paket: <strong>{serviceDuration} hari</strong>
              </p>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Jumlah Anggota: (Maks: {maxGroupSize} orang)
                </label>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleQuantityChange(numberOfPeople - 1)} className="bg-green-200 px-4 py-2 rounded hover:bg-green-300 text-gray-600" disabled={numberOfPeople <= 1}>−</button>
                  <span className="text-xl text-gray-600">{numberOfPeople}</span>
                  <button onClick={() => handleQuantityChange(numberOfPeople + 1)} className="bg-green-200 px-4 py-2 rounded hover:bg-green-300 text-gray-600" disabled={numberOfPeople >= maxGroupSize}>+</button>
                </div>
              </div>

              {/* --- BLOK VARIAN BARU --- */}
              {hasVariants && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Detail Pilihan Anggota:</label>
                  {/* Render dropdown untuk setiap orang */}
                  {Array.from({ length: numberOfPeople }).map((_, index) => (
                    <div key={index} className="mb-4 p-3 border rounded-lg bg-gray-50">
                      <span className="font-semibold text-gray-600">Anggota {index + 1}:</span>
                      {/* Render setiap tipe varian (misal: "Waktu Mulai", "Layanan") */}
                      {guide.variants.map((variant: any) => (
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
                <label className="block text-gray-700 font-semibold mb-2">Pilih Tanggal Mulai Booking:</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <DatePicker 
                    selected={startDate} 
                    onChange={setStartDate} 
                    selectsStart 
                    startDate={startDate} 
                    endDate={calculatedEndDate}
                    minDate={new Date()}
                    placeholderText="Tanggal Mulai" 
                    className="text-gray-600 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <DatePicker 
                    selected={calculatedEndDate} 
                    onChange={() => {}} // Not changeable
                    selectsEnd 
                    startDate={startDate} 
                    endDate={calculatedEndDate} 
                    minDate={startDate ?? new Date()}
                    placeholderText="Tanggal Selesai (Otomatis)" 
                    className="text-gray-600 w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Catatan (Opsional):</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk guide..."
                  className="text-gray-600 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-green-50 text-gray-600 p-4 rounded-lg mb-6">
              <p>Durasi: {serviceDuration} hari</p>
              <p>Jumlah Anggota: {numberOfPeople}</p>
              <p className="text-green-600 font-bold text-xl mt-2">Total: Rp{total.toLocaleString('id-ID')}</p>
            </div>

            <button 
              onClick={handleCheckout} 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!startDate || bookingLoading || areVariantsIncomplete}
            >
              {bookingLoading ? 'Memproses...' : 'Booking & Bayar'}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}