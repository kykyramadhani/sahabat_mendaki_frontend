'use client';

import { useEffect, useState } from 'react';
import WithAuth from '@/components/shared/WithAuth';
import { getJson, postJsonAuth, deleteJsonAuth, patchJsonAuth } from '@/lib/api';
import { Plus, Edit, Trash2, X, Image as ImageIcon, MapPin, Clock, Users } from 'lucide-react';
// Import komponen Form yang sudah dipisah
import ServiceForm, { ServiceFormData } from '@/components/features/management/ServiceForm';

interface Service extends ServiceFormData {
  id: string;
  images: any[]; // Backend return object {id, url}
}

export default function GuideManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Data
  const fetchMyServices = async () => {
    setLoading(true);
    try {
      const data = await getJson('/services/my-services');
      setServices(data);
    } catch (err: any) {
      console.error(err);
      setError('Gagal memuat data layanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  // 2. Handlers CRUD
  const handleCreate = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    // Flatten images array of objects -> array of strings (untuk form)
    const mappedService = {
        ...service,
        images: service.images.map((img: any) => img.url)
    };
    setEditingService(mappedService);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus paket layanan ini?')) return;
    try {
      await deleteJsonAuth(`/services/${id}`);
      fetchMyServices();
    } catch (err: any) {
      alert('Gagal menghapus layanan.');
    }
  };

  const onFormSubmit = async (data: ServiceFormData) => {
    setSubmitting(true);
    try {
      if (editingService) {
        await patchJsonAuth(`/services/${editingService.id}`, data);
        alert('Layanan berhasil diperbarui!');
      } else {
        await postJsonAuth('/services', data);
        alert('Layanan berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      fetchMyServices();
    } catch (err: any) {
        console.error(err);
        const errMsg = err?.data?.message 
          ? (Array.isArray(err.data.message) ? err.data.message.join(', ') : err.data.message)
          : err?.message || 'Gagal menyimpan layanan.';
        alert(`Gagal: ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WithAuth allowedRoles={['GUIDE']}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kelola Paket Layanan Guide</h1>
          <button onClick={handleCreate} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <Plus size={20} /> Tambah Paket
          </button>
        </div>

        {/* LIST SERVICES */}
        {loading ? <p className="text-center">Memuat...</p> : 
         error ? <p className="text-center text-red-600">{error}</p> : 
         services.length === 0 ? (
           <div className="text-center py-12 bg-gray-50 rounded-lg">
             <p className="text-gray-500 mb-4">Anda belum membuat paket layanan.</p>
             <button onClick={handleCreate} className="text-green-600 hover:underline">Buat Paket Pertama</button>
           </div>
         ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
  
  {/* PERBAIKAN: 
      1. Hapus 'h-48'
      2. Tambahkan 'aspect-[4/3]' agar rasio 4:3 terjaga 
      3. Pada mobile (w-full), dia akan jadi kotak 4:3 besar.
      4. Pada desktop (md:w-64), lebarnya tetap, tingginya menyesuaikan rasio.
  */}
  <div className="relative w-full md:w-64 aspect-[4/3] bg-gray-100 flex-shrink-0">
    {service.images[0] ? (
      <img 
        src={service.images[0].url} 
        alt={service.title} 
        className="w-full h-full object-cover" 
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-300">
        <ImageIcon size={32}/>
      </div>
    )}
  </div>
  
  {/* Content */}
  <div className="p-4 flex-grow flex flex-col justify-between">
     {/* ... isi konten sama ... */}
  </div>
</div>
            ))}
          </div>
        )}

        {/* MODAL: Panggil ServiceForm di sini */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-2xl my-8 shadow-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
                <h2 className="text-xl font-bold">{editingService ? 'Edit Paket Layanan' : 'Tambah Paket Baru'}</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400" /></button>
              </div>
              <div className="p-6 overflow-y-auto">
                
                {/* --- INI PENGGANTI KODE PANJANG YANG LAMA --- */}
                <ServiceForm 
                    initialData={editingService} 
                    onSubmit={onFormSubmit} 
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={submitting}
                />
                {/* ------------------------------------------- */}

              </div>
            </div>
          </div>
        )}
      </div>
    </WithAuth>
  );
}