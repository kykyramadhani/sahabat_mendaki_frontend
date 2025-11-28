"use client";

export default function CashflowSummary({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-gray-600">Total Revenue</h3>
        <p className="text-2xl font-bold text-green-600">
          Rp {data.totalRevenue?.toLocaleString()}
        </p>
      </div>

      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-gray-600">Pending Revenue</h3>
        <p className="text-2xl font-bold text-yellow-600">
          Rp {data.pendingRevenue?.toLocaleString()}
        </p>
      </div>

      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-gray-600">Total Booking</h3>
        <p className="text-2xl font-bold text-blue-600">
          {data.totalBookings}
        </p>
      </div>

      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-gray-600">Selesai</h3>
        <p className="text-2xl font-bold text-purple-600">
          {data.completedBookings}
        </p>
      </div>

    </div>
  );
}
