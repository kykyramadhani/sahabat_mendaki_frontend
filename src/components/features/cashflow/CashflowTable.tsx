'use client';

export default function CashflowTable({ transactions }: { transactions: any[] }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 bg-white border border-gray-200 rounded-xl text-center">
        <p className="text-gray-500">Belum ada transaksi yang masuk.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      SETTLED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      FAILED: 'bg-red-100 text-red-800',
    };
    const className = styles[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Item / Paket</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-gray-50 transition">
                <td className="p-4 text-sm text-gray-600">
                  {new Date(trx.date).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">{trx.customerName}</td>
                <td className="p-4 text-sm text-gray-600">{trx.itemName}</td>
                <td className="p-4 text-sm font-bold text-green-600">
                  Rp {trx.amount?.toLocaleString('id-ID')}
                </td>
                <td className="p-4">
                  {getStatusBadge(trx.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}