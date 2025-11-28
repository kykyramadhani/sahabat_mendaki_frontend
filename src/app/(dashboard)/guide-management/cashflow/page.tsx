"use client";

import { useEffect, useState } from "react";
import { getJson } from "@/lib/api";
import CashflowSummary from "./components/cashflowSummary";
import CashflowTable from "./components/cashflowTable";

export default function CashflowPage() {
  const [data, setData] = useState<any>(null);

  const loadData = async () => {
    try {
      const res = await getJson("/bookings/cashflow");
      setData(res);
    } catch (err) {
      console.error("Failed to load cashflow:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Cashflow</h1>

      {data && <CashflowSummary data={data} />}

      {data && <CashflowTable transactions={data.recentTransactions} />}
    </div>
  );
}
