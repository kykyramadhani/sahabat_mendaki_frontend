'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, X, Upload, Save, Loader2 } from 'lucide-react';
import ImageCropper from '@/components/shared/ImageCropper'; // Import Cropper

// --- Tipe Data ---
export interface ServiceVariant {
  name: string;
  options: string[];
}

export interface ServiceFormData {
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  variants: ServiceVariant[];
  images: string[];
}

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

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // 1. Pilih File
  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
      });
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  // 2. Handle Crop & Upload
  const handleCropComplete = async (croppedFile: File) => {
    setImageSrc(null);
    setUploadingImage(true);

    try {
      const fileName = `services/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

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

  // --- Variants Logic ---
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
      alert('Tunggu upload selesai.');
      return;
    }
    const finalData = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxGroupSize: Number(formData.maxGroupSize)
    };
    onSubmit(finalData);
  };

  return (
    <>
      {/* Modal Cropper */}
      {imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          aspectRatio={4 / 3} // Landscape untuk Paket Wisata
          onCancel={() => setImageSrc(null)}
          onCropComplete={handleCropComplete}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
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

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Harga Paket (Total)</label>
            <input 
              type="number" required min="0" 
              className="w-full border rounded p-2" 
              value={formData.price} 
              onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
            />
            <p className="text-xs text-gray-500 mt-1">*Harga per grup/paket</p>
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

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium mb-2">Foto Dokumentasi (Wajib Crop 4:3)</label>
          <div className="grid grid-cols-4 gap-4">
            {formData.images.map((url, idx) => (
              <div key={idx} className="relative aspect-[4/3] border rounded-lg overflow-hidden bg-gray-100 shadow-sm group">
                <img src={url} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow hover:bg-red-50 opacity-0 group-hover:opacity-100 transition">
                    <X size={14} />
                </button>
              </div>
            ))}
            
            <label className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer aspect-[4/3] transition ${uploadingImage ? 'bg-gray-50 border-gray-300' : 'hover:bg-gray-50 border-gray-300 hover:border-green-500'}`}>
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

        {/* Variants */}
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
                    <label className="text-xs text-gray-500 block mb-1">Nama (ex: Jalur)</label>
                    <input type="text" className="w-full border rounded p-1.5 text-sm" value={variant.name} onChange={e => updateVariantName(idx, e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Opsi (Pisahkan dengan koma)</label>
                    <input type="text" placeholder="Sembalun, Senaru" className="w-full border rounded p-1.5 text-sm" value={variant.options.join(', ')} onChange={e => updateVariantOptions(idx, e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Batal</button>
          <button type="submit" disabled={isLoading || uploadingImage} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm">
              {isLoading ? <><Loader2 size={18} className="animate-spin"/> Menyimpan...</> : 'Simpan Paket'}
          </button>
        </div>
      </form>
    </>
  );
}