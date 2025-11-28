'use client';

import { useEffect, useState } from 'react';
import { getJson } from '@/lib/api';
import WithAuth from '@/components/shared/WithAuth';
import CashflowSummary from '@/components/features/cashflow/CashflowSummary';
import CashflowTable from '@/components/features/cashflow/CashflowTable';

export default function CashflowPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint ini pintar: otomatis mendeteksi role user (Guide/Gear Owner)
      // dan mengembalikan data yang sesuai.
      const res = await getJson('/bookings/cashflow');
      setData(res);
    } catch (err: any) {
      console.error('Failed to load cashflow:', err);
      setError('Gagal memuat data keuangan. Pastikan Anda terhubung ke internet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <WithAuth allowedRoles={['GUIDE', 'GEAR_OWNER']}>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
            <p className="text-gray-500 text-sm mt-1">Pantau pendapatan dan transaksi masuk Anda.</p>
          </div>
          <button 
            onClick={loadData}
            className="text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            🔄 Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Memuat data keuangan...</div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-xl">{error}</div>
        ) : data ? (
          <>
            <CashflowSummary data={data} />
            
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Transaksi Terbaru</h2>
              <CashflowTable transactions={data.recentTransactions} />
            </div>
          </>
        ) : null}
      </div>
    </WithAuth>
  );
}