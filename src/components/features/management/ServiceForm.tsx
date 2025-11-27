'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, X, Upload, Save } from 'lucide-react';

// Tipe Data Service
export interface ServiceVariant {
  name: string;
  options: string[];
}

export interface ServiceFormData {
  title: string;
  description: string;
  location: string;
  price: number;        // Harga Paket Total
  duration: number;     // Durasi (hari)
  maxGroupSize: number; // Maksimal orang
  variants: ServiceVariant[];
  images: string[];
}

// Opsi Lokasi (Bisa ditambah)
const LOCATIONS = [
  'Gunung Rinjani',
  'Bukit Pergasingan',
  'Sembalun',
  'Senaru',
  'Air Terjun Tiu Kelep',
  'Lainnya'
];

interface ServiceFormProps {
  initialData?: ServiceFormData | null;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ServiceForm({ initialData, onSubmit, onCancel, isLoading }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    location: 'Gunung Rinjani',
    price: 0,
    duration: 1,
    maxGroupSize: 1,
    variants: [],
    images: [],
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // --- IMAGE UPLOAD (Sama seperti Gear) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadingImage(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `services/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

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
    // Pastikan tipe data angka
    const finalData = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxGroupSize: Number(formData.maxGroupSize)
    };
    onSubmit(finalData);
  };

  return (
    <form id="serviceForm" onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. Info Dasar */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul Paket</label>
          <input 
            type="text" required 
            placeholder="Contoh: Paket Rinjani 3D2N"
            className="w-full border rounded p-2" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lokasi</label>
          <input 
            type="text" list="location-list" required
            className="w-full border rounded p-2"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
          <datalist id="location-list">
            {LOCATIONS.map(loc => <option key={loc} value={loc} />)}
          </datalist>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi Paket</label>
        <textarea 
          required rows={4} 
          className="w-full border rounded p-2" 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
        />
      </div>

      {/* 2. Harga & Detail Teknis */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Harga Paket (Total)</label>
          <input 
            type="number" required min="0" 
            className="w-full border rounded p-2" 
            value={formData.price} 
            onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
          />
          <p className="text-xs text-gray-500 mt-1">*Harga untuk 1 grup/paket</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Durasi (Hari)</label>
          <input 
            type="number" required min="1" 
            className="w-full border rounded p-2" 
            value={formData.duration} 
            onChange={e => setFormData({...formData, duration: Number(e.target.value)})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Maks. Anggota</label>
          <input 
            type="number" required min="1" 
            className="w-full border rounded p-2" 
            value={formData.maxGroupSize} 
            onChange={e => setFormData({...formData, maxGroupSize: Number(e.target.value)})} 
          />
        </div>
      </div>

      {/* 3. Foto */}
      <div>
        <label className="block text-sm font-medium mb-2">Foto Dokumentasi</label>
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

      {/* 4. Varian */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold">Varian / Opsi Tambahan</label>
          <button type="button" onClick={addVariant} className="text-xs text-green-600 flex items-center gap-1"><Plus size={14}/> Tambah</button>
        </div>
        {formData.variants.map((variant, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded mb-2 relative">
            <button type="button" onClick={() => removeVariant(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={14}/></button>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Nama (mis. Jalur, Include Makan)" className="border rounded p-1 text-sm" value={variant.name} onChange={e => updateVariantName(idx, e.target.value)} />
              <input type="text" placeholder="Opsi (Sembalun, Ya, Tidak)" className="border rounded p-1 text-sm" value={variant.options.join(', ')} onChange={e => updateVariantOptions(idx, e.target.value)} />
            </div>
          </div>
        ))}
        {formData.variants.length === 0 && (
            <p className="text-xs text-gray-400 italic">Tambahkan varian jika ada pilihan (misal: Jalur Lewat Mana? atau Include Porter?)</p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
        <button type="submit" disabled={isLoading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2">
            {isLoading ? 'Menyimpan...' : <><Save size={18} /> Simpan Paket</>}
        </button>
      </div>
    </form>
  );
}