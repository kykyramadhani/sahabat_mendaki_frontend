"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";

interface Props {
  initialData: any;
  onCancel: () => void;
  onSave: (data: {
    fullName: string;
    email: string;
    profilePicture?: string;
  }) => Promise<void>;
  isSaving?: boolean;
}

export default function EditProfileForm({
  initialData,
  onCancel,
  onSave,
  isSaving,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setFullName(initialData?.fullName || "");
    setEmail(initialData?.email || "");
    setAvatarUrl(initialData?.profilePicture || "");
  }, [initialData]);

  const validateEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || fullName.trim().length < 2)
      return setError("Nama lengkap minimal 2 karakter.");

    if (!validateEmail(email))
      return setError("Format email tidak valid.");

    await onSave({
      fullName: fullName.trim(),
      email: email.trim(),
      profilePicture: avatarUrl,
    });

    setSuccess("Profil berhasil diperbarui.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white border border-gray-200 rounded-2xl p-8 shadow-lg 
        space-y-6 max-w-xl mx-auto
        animate-[slideInLeft_.45s_ease-out]
      "
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Edit Profil</h2>
        <p className="text-sm text-gray-500">
          Perbarui informasi akun Anda dengan aman.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="text-sm p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24">
          <img
            src={avatarUrl || "/images/placeholder.png"}
            className="w-full h-full rounded-full object-cover shadow"
          />

          <label
            className="
              absolute inset-0 bg-black/40 opacity-0 hover:opacity-100
              transition flex items-center justify-center rounded-full cursor-pointer
            "
          >
            <Camera className="text-white" size={22} />
            <input type="file" className="hidden" />
          </label>
        </div>

        <p className="text-xs text-gray-500">Klik foto untuk mengganti avatar</p>
      </div>

      {/* Nama Lengkap */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lengkap
        </label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Masukkan nama lengkap"
          className="
            w-full border rounded-lg p-3 text-gray-800 placeholder-gray-400
            focus:ring-2 focus:ring-green-400 focus:border-green-600 outline-none
            transition
          "
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan email"
          className="
            w-full border rounded-lg p-3 text-gray-800 placeholder-gray-400
            focus:ring-2 focus:ring-green-400 focus:border-green-600 outline-none
            transition
          "
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="
            px-4 py-2 border rounded-lg bg-gray-100 text-gray-700
            hover:bg-gray-200 transition active:scale-[0.97]
          "
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isSaving || uploading}
          className="
            px-6 py-2 bg-green-600 text-white rounded-lg shadow 
            hover:bg-green-700 transition active:scale-[0.97]
          "
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
