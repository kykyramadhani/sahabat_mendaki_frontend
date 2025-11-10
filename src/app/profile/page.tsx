'use client';

import WithAuth from '@/components/shared/WithAuth';

export default function ProfilePage() {
  return (
    <WithAuth>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        {/* Profile content akan ditampilkan hanya jika user sudah login */}
        {/* Kita akan menambahkan form edit profil dsb di sini */}
      </div>
    </WithAuth>
  );
}