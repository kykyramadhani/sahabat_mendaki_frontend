'use client';

import WithAuth from '@/components/shared/WithAuth';

export default function GuideManagementPage() {
  return (
    <WithAuth allowedRoles={['GUIDE']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Kelola Jadwal Guide</h1>

        {/* Content only shown to GUIDE role */}
        {/* Akan kita tambahkan fitur manajemen jadwal guide di sini */}
      </div>
    </WithAuth>
  );
}