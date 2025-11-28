"use client";

export default function CashflowTable({ transactions }: { transactions: any[] }) {
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-4 bg-white shadow rounded-lg text-center text-gray-500">
        Tidak ada transaksi terbaru.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-auto">
      <table className="w-full border-collapse">
        
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left text-gray-600">Tanggal</th>
            <th className="p-3 text-left text-gray-600">Nama Customer</th>
            <th className="p-3 text-left text-gray-600">Item</th>
            <th className="p-3 text-left text-gray-600">Jumlah</th>
            <th className="p-3 text-left text-gray-600">Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((trx) => (
            <tr key={trx.id} className="border-t">
              
              <td className="p-3">
                {new Date(trx.date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              <td className="p-3">{trx.customerName}</td>

              <td className="p-3">{trx.itemName}</td>

              <td className="p-3 font-semibold">
                Rp {trx.amount?.toLocaleString()}
              </td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      trx.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  {trx.status}
                </span>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
