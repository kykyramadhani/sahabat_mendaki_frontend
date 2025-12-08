'use client';

import WithAuth from '@/components/shared/WithAuth';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
// Sesuaikan path import ini dengan struktur folder Anda
import ProfileCard from '@/components/shared/ProfileCard'; 
import EditProfileForm from '@/components/shared/EditProfileForm';
import { patchJsonAuth } from '@/lib/api';

export default function ProfilePage() {
  const { user: contextUser, loading, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (loading) return <div className="p-8 text-center">Memuat profil...</div>;

  if (!contextUser) return null;

  const handleSave = async (data: { fullName: string; email: string; profilePicture?: string }) => {
    setSaving(true);
    setMessage(null);
    try {
      // 1. Update ke Backend
      const res = await patchJsonAuth(`/users/${contextUser.id}`, data);

      // 2. Dapatkan data user terbaru
      // Backend biasanya return { user: ... } atau langsung object usernya
      const updatedUser = res?.user || res || { ...contextUser, ...data };

      // 3. Update Local Storage & Context (PENTING AGAR UI BERUBAH)
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') || '' : '';
      if (token) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        login(token, updatedUser); // Trigger update state global
      }

      setMessage('Profil berhasil diperbarui!');
      setEditing(false);
    } catch (err: any) {
      console.error('Update profile failed', err);
      const errMsg = err?.data?.message || err?.message || 'Gagal memperbarui profil';
      setMessage(Array.isArray(errMsg) ? errMsg.join(', ') : errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <WithAuth>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Profil Saya</h1>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl animate-bounce-short">
            ✅ {message}
          </div>
        )}

        {!editing ? (
          <div className="animate-fade-in">
            <ProfileCard user={contextUser} onEdit={() => setEditing(true)} />
          </div>
        ) : (
          <div className="mt-6">
            <EditProfileForm
              initialData={contextUser}
              onCancel={() => setEditing(false)}
              onSave={handleSave}
              isSaving={saving}
            />
          </div>
        )}
      </div>
    </WithAuth>
  );
}