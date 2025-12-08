'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, X, Upload, Save, Loader2 } from 'lucide-react';
import ImageCropper from '@/components/shared/ImageCropper'; // Import Cropper

// --- Tipe Data ---
export interface Variant {
  name: string;
  options: string[];
}

export interface GearFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  rentalPricePerDay: number;
  stock: number;
  variants: Variant[];
  images: string[];
}

const CATEGORIES = [
  { value: 'tent', label: 'Tenda' },
  { value: 'backpack', label: 'Tas/Carrier' },
  { value: 'sleeping_bag', label: 'Sleeping Bag' },
  { value: 'footwear', label: 'Sepatu' },
  { value: 'clothing', label: 'Pakaian' },
  { value: 'cooking', label: 'Alat Masak' },
  { value: 'pole', label: 'Trekking Pole' },
  { value: 'other', label: 'Lainnya' },
];

interface GearFormProps {
  initialData?: GearFormData | null;
  onSubmit: (data: GearFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function GearForm({ initialData, onSubmit, onCancel, isLoading }: GearFormProps) {
  const [formData, setFormData] = useState<GearFormData>({
    name: '',
    description: '',
    category: 'other',
    brand: '',
    rentalPricePerDay: 0,
    stock: 1,
    variants: [],
    images: [],
  });

  // State untuk Cropper
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // 1. Pilih File dari Komputer
  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null); // Buka Modal Cropper
      });
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset input
    }
  };

  // 2. Proses Setelah Crop Selesai -> Upload ke Supabase
  const handleCropComplete = async (croppedFile: File) => {
    setImageSrc(null); // Tutup Modal
    setUploadingImage(true);

    try {
      const fileName = `gear/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('images-sahabat-mendaki')
        .upload(fileName, croppedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images-sahabat-mendaki')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, data.publicUrl]
      }));
    } catch (err: any) {
      console.error(err);
      alert('Gagal upload gambar: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // --- Logic Varian ---
  const addVariant = () => {
    setFormData(prev => ({ ...prev, variants: [...prev.variants, { name: '', options: [] }] }));
  };

  const updateVariantName = (index: number, name: string) => {
    const newVariants = [...formData.variants];
    newVariants[index].name = name;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const updateVariantOptions = (index: number, optionsString: string) => {
    const newVariants = [...formData.variants];
    newVariants[index].options = optionsString.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      alert('Mohon tunggu, gambar sedang diupload...');
      return;
    }
    const finalData = {
        ...formData,
        rentalPricePerDay: Number(formData.rentalPricePerDay),
        stock: Number(formData.stock)
    };
    onSubmit(finalData);
  };

  return (
    <>
      {/* Modal Cropper */}
      {imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          aspectRatio={1} // Kotak (Square) untuk Produk
          onCancel={() => setImageSrc(null)}
          onCropComplete={handleCropComplete}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Gear</label>
            <input type="text" required className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select className="w-full border rounded p-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea required rows={3} className="w-full border rounded p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input type="text" className="w-full border rounded p-2" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Harga/Hari (Rp)</label>
            <input type="number" required min="0" className="w-full border rounded p-2" value={formData.rentalPricePerDay} onChange={e => setFormData({...formData, rentalPricePerDay: Number(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stok</label>
            <input type="number" required min="1" className="w-full border rounded p-2" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium mb-2">Foto Gear (Wajib Crop 1:1)</label>
          <div className="grid grid-cols-4 gap-4">
            {formData.images.map((url, idx) => (
              <div key={idx} className="relative aspect-square border rounded-lg overflow-hidden bg-gray-50 shadow-sm group">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow hover:bg-red-50 opacity-0 group-hover:opacity-100 transition">
                    <X size={14} />
                </button>
              </div>
            ))}
            
            <label className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer aspect-square transition ${uploadingImage ? 'bg-gray-50 border-gray-300' : 'hover:bg-gray-50 border-gray-300 hover:border-green-500'}`}>
              {uploadingImage ? (
                <div className="flex flex-col items-center text-green-600">
                    <Loader2 size={24} className="animate-spin mb-1"/>
                    <span className="text-xs">Uploading...</span>
                </div>
              ) : (
                <>
                    <Upload size={24} className="text-gray-400 mb-1"/>
                    <span className="text-xs text-gray-500">Tambah Foto</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} disabled={uploadingImage} />
            </label>
          </div>
        </div>

        {/* Variants Section */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold">Varian (Opsional)</label>
            <button type="button" onClick={addVariant} className="text-xs text-green-600 flex items-center gap-1 hover:underline"><Plus size={14}/> Tambah Varian</button>
          </div>
          {formData.variants.map((variant, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg mb-2 relative border border-gray-100">
              <button type="button" onClick={() => removeVariant(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={14}/></button>
              <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Nama (ex: Ukuran)</label>
                    <input type="text" className="w-full border rounded p-1.5 text-sm" value={variant.name} onChange={e => updateVariantName(idx, e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Opsi (Pisahkan dengan koma)</label>
                    <input type="text" placeholder="S, M, L, XL" className="w-full border rounded p-1.5 text-sm" value={variant.options.join(', ')} onChange={e => updateVariantOptions(idx, e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Batal</button>
          <button type="submit" disabled={isLoading || uploadingImage} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm">
              {isLoading ? <><Loader2 size={18} className="animate-spin"/> Menyimpan...</> : 'Simpan Gear'}
          </button>
        </div>
      </form>
    </>
  );
}