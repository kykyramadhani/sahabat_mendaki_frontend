'use client';

import { Wallet, Clock, ShoppingBag, CheckCircle } from 'lucide-react';

export default function CashflowSummary({ data }: { data: any }) {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-full">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Pendapatan Bersih</p>
          <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(data.totalRevenue)}</h3>
        </div>
      </div>

      {/* Pending Revenue */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Potensi (Pending)</p>
          <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(data.pendingRevenue)}</h3>
        </div>
      </div>

      {/* Total Transactions */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Transaksi</p>
          <h3 className="text-2xl font-bold text-gray-800">{data.totalBookings}</h3>
        </div>
      </div>

      {/* Completed Transactions */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Selesai / Sukses</p>
          <h3 className="text-2xl font-bold text-gray-800">{data.completedBookings}</h3>
        </div>
      </div>
    </div>
  );
}