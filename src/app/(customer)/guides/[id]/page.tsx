'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/shared/PageWrapper';
import DatePicker from 'react-datepicker';
import { getJson, postJsonAuth } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import 'react-datepicker/dist/react-datepicker.css';
import { Image as ImageIcon } from 'lucide-react';

export default function GuideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [guide, setGuide] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // State Varian & Form
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>[]>([]);
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

  useEffect(() => {
    if (!hasVariants || !guide) return;

    const defaultVariantState = guide.variants.reduce((acc: any, variant: any) => {
      acc[variant.name] = ''; 
      return acc;
    }, {} as Record<string, string>);

    setSelectedVariants(current => {
      const newArray = [...current.slice(0, numberOfPeople)];
      while (newArray.length < numberOfPeople) {
        newArray.push({ ...defaultVariantState }); 
      }
      return newArray;
    });
  }, [numberOfPeople, hasVariants, guide?.variants]);

  const handleVariantChange = (itemIndex: number, variantName: string, value: string) => {
    setSelectedVariants(current => {
      const newVariants = [...current];
      newVariants[itemIndex] = { ...newVariants[itemIndex] }; 
      newVariants[itemIndex][variantName] = value;
      return newVariants;
    });
  };

  // --- LOGIKA PERHITUNGAN TANGGAL ---
  const servicePrice = Number(guide?.price) || 0;
  const serviceDuration = Math.max(1, Number(guide?.duration) || 1); 
  const maxGroupSize = Number(guide?.maxGroupSize) || 1;

  // Hitung Tanggal Selesai Otomatis
  const calculatedEndDate = startDate
    ? new Date(startDate.getTime() + (serviceDuration - 1) * 24 * 60 * 60 * 1000)
    : null;

  const total = servicePrice; 

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
        endDate: calculatedEndDate ? calculatedEndDate.toISOString() : startDate.toISOString(),
        quantity: 1, 
        numberOfPeople: numberOfPeople, 
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
  if (!guide) return <PageWrapper><p className="text-center text-gray-500">Paket guide tidak ditemukan.</p></PageWrapper>;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 bg-white">
        <h1 className="text-gray-700 text-3xl md:text-4xl font-bold text-center mb-8">Detail Booking: {guide.title}</h1>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          
          {/* --- IMAGE SECTION (FIXED) --- */}
          <div>
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-gray-100 border border-gray-200">
              {guide.images?.[0]?.url ? (
                <img 
                  src={guide.images[0].url} 
                  alt={guide.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon size={64} />
                </div>
              )}
            </div>
          </div>
          {/* ----------------------------- */}

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-gray-600 mb-2">Rating: {(guide.rating ?? 0).toFixed(1)} ⭐</p>
              <p className="text-gray-600 mb-2">Lokasi: {guide.location}</p>
              <p className="text-gray-600 mb-4 whitespace-pre-line">{guide.description}</p>
              
              <p className="text-green-600 font-bold text-2xl mb-6">
                Rp{servicePrice.toLocaleString('id-ID')} / paket
              </p>
              <p className="text-gray-600 mb-2 -mt-4">
                Durasi paket: <strong>{serviceDuration} Hari</strong>
              </p>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Jumlah Anggota: (Maks: {maxGroupSize} orang)
                </label>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleQuantityChange(numberOfPeople - 1)} className="bg-green-100 hover:bg-green-200 px-4 py-2 rounded text-green-700 transition" disabled={numberOfPeople <= 1}>−</button>
                  <span className="text-xl text-gray-700 font-medium w-8 text-center">{numberOfPeople}</span>
                  <button onClick={() => handleQuantityChange(numberOfPeople + 1)} className="bg-green-100 hover:bg-green-200 px-4 py-2 rounded text-green-700 transition" disabled={numberOfPeople >= maxGroupSize}>+</button>
                </div>
              </div>

              {/* Varian Section */}
              {hasVariants && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Detail Pilihan Anggota:</label>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {Array.from({ length: numberOfPeople }).map((_, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <span className="font-semibold text-gray-700 text-sm mb-2 block">Anggota {index + 1}:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {guide.variants.map((variant: any) => (
                            <div key={variant.name}>
                                <label className="block text-xs text-gray-500 mb-1">{variant.name}</label>
                                <select
                                value={selectedVariants[index]?.[variant.name] || ''}
                                onChange={(e) => handleVariantChange(index, variant.name, e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                required
                                >
                                <option value="">Pilih...</option>
                                {variant.options.map((opt: string) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                                </select>
                            </div>
                            ))}
                        </div>
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Picker Section */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Pilih Tanggal Mulai Booking:</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full">
                    <DatePicker 
                        selected={startDate} 
                        onChange={setStartDate} 
                        selectsStart 
                        startDate={startDate} 
                        endDate={calculatedEndDate || undefined}
                        minDate={new Date()}
                        placeholderText="Pilih Tanggal" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  {/* End Date Picker Read-Only */}
                  <div className="w-full">
                    <input 
                        type="text"
                        value={calculatedEndDate ? calculatedEndDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        placeholder="Selesai (Otomatis)"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">*Tanggal selesai dihitung otomatis berdasarkan durasi paket.</p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Catatan (Opsional):</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk guide..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-green-50 text-gray-700 p-5 rounded-xl mb-6 border border-green-100">
              <div className="flex justify-between items-center mb-1">
                <span>Durasi</span>
                <span className="font-semibold">{serviceDuration} hari</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span>Jumlah Anggota</span>
                <span className="font-semibold">{numberOfPeople} orang</span>
              </div>
              <div className="border-t border-green-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl text-green-700">Rp{total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout} 
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={!startDate || bookingLoading || areVariantsIncomplete}
            >
              {bookingLoading ? 'Memproses Booking...' : 'Booking & Bayar Sekarang'}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}