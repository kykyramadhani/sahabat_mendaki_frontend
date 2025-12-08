'use client';

import WithAuth from '@/components/shared/WithAuth';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import ProfileCard from '@/components/shared/ProfileCard';
import EditProfileForm from '@/components/shared/EditProfileForm';
import { patchJsonAuth } from '@/lib/api';

export default function ProfilePage() {
  const { user: contextUser, loading, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (loading) return null;

  if (!contextUser) return null;

  const handleSave = async (data: { fullName: string; email: string; profilePicture?: string }) => {
    setSaving(true);
    setMessage(null);
    try {
      // Update user on backend
      const res = await patchJsonAuth(`/users/${contextUser.id}`, data);

      // If backend returns updated user object, use it. Otherwise merge
      const updatedUser = res?.user || res || { ...contextUser, ...data };

      // Update localStorage and Auth context
      const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') || '' : '';
      if (token) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        login(token, updatedUser);
      } else {
        // fallback: just update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setMessage('Profil berhasil diperbarui');
      setEditing(false);
    } catch (err: unknown) {
      console.error('Update profile failed', err);
      const e = err as { message?: string; data?: { message?: string } };
      setMessage(e?.data?.message || e?.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <WithAuth>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {message && <div className="mb-4 text-sm text-green-600">{message}</div>}

        {!editing && (
          <ProfileCard user={contextUser} onEdit={() => setEditing(true)} />
        )}

        {editing && (
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