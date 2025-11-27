'use client';

import { useEffect, useState } from 'react';
import WithAuth from '@/components/shared/WithAuth';
import { getJson, postJsonAuth, deleteJsonAuth, patchJsonAuth } from '@/lib/api';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
// Import komponen yang baru kita buat!
import GearForm, { GearFormData } from '@/components/features/management/GearForm';

interface Gear extends GearFormData {
  id: string;
  images: any[]; // Menyesuaikan dengan response backend yg return object {id, url}
}

export default function GearManagementPage() {
  const [gears, setGears] = useState<Gear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGear, setEditingGear] = useState<Gear | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMyGear = async () => {
    setLoading(true);
    try {
      const data = await getJson('/gear/my-gear');
      setGears(data);
    } catch (err: any) {
      console.error(err);
      setError('Gagal memuat data gear.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGear();
  }, []);

  // Handler CRUD
  const handleCreate = () => {
    setEditingGear(null);
    setIsModalOpen(true);
  };

  const handleEdit = (gear: Gear) => {
    // Mapping format images dari backend (array of objects) ke format form (array of strings)
    const mappedGear = {
        ...gear,
        images: gear.images.map((img: any) => img.url)
    };
    setEditingGear(mappedGear);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus gear ini?')) return;
    try {
      await deleteJsonAuth(`/gear/${id}`);
      fetchMyGear();
    } catch (err: any) {
      alert('Gagal menghapus gear.');
    }
  };

  // Fungsi ini akan dipanggil oleh GearForm saat disubmit
  const onFormSubmit = async (data: GearFormData) => {
    setSubmitting(true);
    try {
      if (editingGear) {
        await patchJsonAuth(`/gear/${editingGear.id}`, data);
        alert('Gear berhasil diperbarui!');
      } else {
        await postJsonAuth('/gear', data);
        alert('Gear berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchMyGear();
    } catch (err: any) {
        console.error(err);
        const errMsg = err?.data?.message 
          ? (Array.isArray(err.data.message) ? err.data.message.join(', ') : err.data.message)
          : err?.message || 'Gagal menyimpan gear.';
        alert(`Gagal: ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WithAuth allowedRoles={['GEAR_OWNER']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kelola Peralatan Saya</h1>
          <button onClick={handleCreate} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <Plus size={20} /> Tambah Gear
          </button>
        </div>

        {/* LIST GEAR (Tetap disini karena spesifik halaman ini) */}
        {loading ? <p className="text-center">Memuat...</p> : 
         error ? <p className="text-center text-red-600">{error}</p> : 
         gears.length === 0 ? (
           <div className="text-center py-12 bg-gray-50 rounded-lg">
             <p className="text-gray-500">Belum ada gear.</p>
           </div>
         ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gears.map(gear => (
              <div key={gear.id} className="bg-white border rounded-lg shadow-sm overflow-hidden group">
                <div className="relative h-48 bg-gray-100">
                  {gear.images[0] ? (
                    <img src={gear.images[0].url} alt={gear.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={48}/></div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-green-700">
                    Rp{gear.rentalPricePerDay.toLocaleString('id-ID')}/hari
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">{gear.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{gear.category} • Stok: {gear.stock}</p>
                  <div className="flex justify-end gap-2 mt-4 border-t pt-3">
                    <button onClick={() => handleEdit(gear)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(gear.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL YANG SEKARANG BERSIH DAN MEMANGGIL GEARFORM */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-2xl my-8 shadow-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
                <h2 className="text-xl font-bold">{editingGear ? 'Edit Gear' : 'Tambah Gear Baru'}</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400" /></button>
              </div>
              <div className="p-6 overflow-y-auto">
                
                {/* PANGGIL KOMPONEN GEAR FORM DISINI */}
                <GearForm 
                    initialData={editingGear} 
                    onSubmit={onFormSubmit} 
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={submitting}
                />

              </div>
            </div>
          </div>
        )}
      </div>
    </WithAuth>
  );
}