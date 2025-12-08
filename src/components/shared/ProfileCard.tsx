"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon } from "lucide-react";

interface Props {
  user: any;
  onEdit: () => void;
}

export default function ProfileCard({ user, onEdit }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-3xl mx-auto">

      {/* Avatar Wrapper */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <div className="w-full h-full aspect-square rounded-full overflow-hidden shadow-sm bg-gray-100 ring-4 ring-gray-50">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <UserIcon size={48} />
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900">
          {user?.fullName || "Pengguna Baru"}
        </h2>

        <p className="text-gray-500 text-sm mt-1">{user?.email}</p>

        <div className="mt-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
            {user?.role?.replace('_', ' ') || "User"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full sm:w-auto">
        <button
          onClick={onEdit}
          className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition active:scale-95"
        >
          Edit Profil
        </button>

        <button
          onClick={() => router.push("/profile/change-password")}
          className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition active:scale-95"
        >
          Ganti Password
        </button>
      </div>
    </div>
  );
}