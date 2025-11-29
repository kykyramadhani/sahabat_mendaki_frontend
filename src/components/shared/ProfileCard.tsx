"use client";

import React from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Props {
  user: any;
  onEdit: () => void;
}

export default function ProfileCard({ user, onEdit }: Props) {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex items-center gap-6 max-w-3xl mx-auto">

      {/* Avatar */}
      <div className="relative w-28 h-28">
        <div className="w-full h-full rounded-full overflow-hidden shadow-inner bg-gray-50 ring-2 ring-gray-200">
          <img
            src={user?.profilePicture || "/images/placeholder.png"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-gray-900">
          {user?.fullName || "Tidak ada nama"}
        </h2>

        <p className="text-gray-600 text-sm mt-1">{user?.email}</p>

        <p className="text-xs mt-2 font-medium text-gray-500 px-2 py-1 inline-block bg-gray-100 rounded-full">
          Role: {user?.role || "user"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 items-end">
        <button
          onClick={onEdit}
          className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Edit Profil
        </button>

        <button
          onClick={() => router.push("/profile/change-password")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Ganti Password
        </button>
      </div>
    </div>
  );
}
