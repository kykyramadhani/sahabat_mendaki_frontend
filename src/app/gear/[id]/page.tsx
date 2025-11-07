'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { GEAR_DATA, Gear } from '@/data/mock';
import PageWrapper from '@/components/PageWrapper';
import DatePicker from 'react-datepicker';

export default function GearDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const gear: Gear | undefined = GEAR_DATA.find(g => g.id === id);
  if (!gear) return <p className="text-center text-gray-500">Gear tidak ditemukan.</p>;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariants, setSelectedVariants] = useState<string[]>(Array(quantity).fill(''));
  const [startDate, setStartDate] = useState<Date | null>(null); // FIXED: null
  const [endDate, setEndDate] = useState<Date | null>(null);     // FIXED: null

  const hasVariants = gear.variants.length > 0;
  const variantName = hasVariants ? gear.variants[0].name : '';
  const variantOptions = hasVariants ? gear.variants[0].options : [];

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    setSelectedVariants(prev => {
      const newVars = [...prev.slice(0, newQty)];
      while (newVars.length < newQty) newVars.push('');
      return newVars;
    });
  };

  const handleVariantChange = (index: number, value: string) => {
    const newVars = [...selectedVariants];
    newVars[index] = value;
    setSelectedVariants(newVars);
  };

  // Konversi null → undefined saat hitung durasi
  const duration = startDate && endDate 
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1 
    : 0;
  const subtotal = gear.pricePerDay * duration * quantity;
  const total = subtotal;

  const handleCheckout = () => {
    console.log('Checkout:', { gear, quantity, selectedVariants, startDate, endDate, total });
    alert('Checkout berhasil! (Simulasi)');
  };

  return (
    <PageWrapper>
      <div className="px-4 py-12 bg-white">
        <h1 className="text-4xl font-bold text-gray-700 text-center mb-8">Detail Sewa {gear.name}</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img src={gear.imageUrl} alt={gear.name} className="w-full h-80 object-cover rounded-lg shadow-md" />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-gray-600 mb-2">Kategori: {gear.category}</p>
              <p className="text-gray-600 mb-2">Vendor: {gear.vendor}</p>
              <p className="text-green-600 font-bold text-2xl mb-6">
                Rp{gear.pricePerDay.toLocaleString('id-ID')} / hari
              </p>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Jumlah Item:</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleQuantityChange(quantity - 1)} className="bg-green-200 px-4 py-2 rounded hover:bg-green-300 text-gray-600" disabled={quantity <= 1}>−</button>
                  <span className="text-xl text-gray-600">{quantity}</span>
                  <button onClick={() => handleQuantityChange(quantity + 1)} className="bg-green-200 px-4 py-2 rounded hover:bg-green-300 text-gray-600">+</button>
                </div>
              </div>

              {hasVariants && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Pilih {variantName}:</label>
                  {Array.from({ length: quantity }).map((_, index) => (
                    <div key={index} className="mb-3">
                      <span className="text-sm text-gray-600">Item {index + 1}:</span>
                      <select
                        value={selectedVariants[index] || ''}
                        onChange={(e) => handleVariantChange(index, e.target.value)}
                        className="ml-2 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Pilih {variantName}</option>
                        {variantOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
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
                    placeholderText="Tanggal Mulai" 
                    className="text-gray-600 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <DatePicker 
                    selected={endDate} 
                    onChange={setEndDate} 
                    selectsEnd 
                    startDate={startDate} 
                    endDate={endDate} 
                    minDate={startDate ?? undefined} 
                    placeholderText="Tanggal Selesai" 
                    className="text-gray-600 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 text-gray-600 p-4 rounded-lg mb-6">
              <p>Durasi: {duration} hari</p>
              <p>Subtotal: Rp{subtotal.toLocaleString('id-ID')}</p>
              <p className="text-green-600 font-bold text-xl mt-2">Total: Rp{total.toLocaleString('id-ID')}</p>
            </div>

            <button 
              onClick={handleCheckout} 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
              disabled={duration <= 0 || (hasVariants && selectedVariants.some(v => v === ''))}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}