'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, X, Upload, Save } from 'lucide-react';

// Tipe data (bisa dipindah ke types/index.ts nanti)
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
  initialData?: GearFormData | null; // Jika null = mode create, jika ada = mode edit
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

  const [uploadingImage, setUploadingImage] = useState(false);

  // Isi form jika ada initialData (Mode Edit)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // --- IMAGE UPLOAD ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImage(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `gear/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images-sahabat-mendaki')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images-sahabat-mendaki')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, data.publicUrl]
      }));
    } catch (err: any) {
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

  // --- VARIANTS ---
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

  // --- SUBMIT ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) {
      alert('Tunggu proses upload selesai.');
      return;
    }
    // Pastikan angka
    const finalData = {
        ...formData,
        rentalPricePerDay: Number(formData.rentalPricePerDay),
        stock: Number(formData.stock)
    };
    onSubmit(finalData);
  };

  return (
    <form id="gearForm" onSubmit={handleSubmit} className="space-y-6">
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
          <label className="block text-sm font-medium mb-1">Harga/Hari</label>
          <input type="number" required min="0" className="w-full border rounded p-2" value={formData.rentalPricePerDay} onChange={e => setFormData({...formData, rentalPricePerDay: Number(e.target.value)})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stok</label>
          <input type="number" required min="1" className="w-full border rounded p-2" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-2">Foto Gear</label>
        <div className="grid grid-cols-4 gap-4">
          {formData.images.map((url, idx) => (
            <div key={idx} className="relative aspect-square border rounded overflow-hidden">
              <img src={url} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12} /></button>
            </div>
          ))}
          <label className="border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 aspect-square">
            {uploadingImage ? <span className="text-xs">...</span> : <><Upload size={20}/><span className="text-xs">Upload</span></>}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
          </label>
        </div>
      </div>

      {/* Variants */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold">Varian (Opsional)</label>
          <button type="button" onClick={addVariant} className="text-xs text-green-600 flex items-center gap-1"><Plus size={14}/> Tambah</button>
        </div>
        {formData.variants.map((variant, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded mb-2 relative">
            <button type="button" onClick={() => removeVariant(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={14}/></button>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Nama (mis. Ukuran)" className="border rounded p-1 text-sm" value={variant.name} onChange={e => updateVariantName(idx, e.target.value)} />
              <input type="text" placeholder="Opsi (S, M, L)" className="border rounded p-1 text-sm" value={variant.options.join(', ')} onChange={e => updateVariantOptions(idx, e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
        <button type="submit" disabled={isLoading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400">
            {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}