"use client";

import { useState, useEffect } from "react";
import { Camera, Loader2, User as UserIcon } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Pastikan import ini ada

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

  useEffect(() => {
    setFullName(initialData?.fullName || "");
    setEmail(initialData?.email || "");
    setAvatarUrl(initialData?.profilePicture || "");
  }, [initialData]);

  // --- LOGIKA UPLOAD GAMBAR ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    setError("");
    
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Gunakan folder 'avatars' agar rapi
      const fileName = `avatars/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // 1. Upload ke Supabase
      const { error: uploadError } = await supabase.storage
        .from('images-sahabat-mendaki') // Pastikan nama bucket sesuai di Supabase Anda
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Ambil Public URL
      const { data } = supabase.storage
        .from('images-sahabat-mendaki')
        .getPublicUrl(fileName);

      // 3. Set State agar preview muncul
      setAvatarUrl(data.publicUrl);
      
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError("Gagal mengupload gambar: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const validateEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || fullName.trim().length < 2)
      return setError("Nama lengkap minimal 2 karakter.");

    if (!validateEmail(email))
      return setError("Format email tidak valid.");

    await onSave({
      fullName: fullName.trim(),
      email: email.trim(),
      profilePicture: avatarUrl, // URL dari supabase dikirim ke sini
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg space-y-6 max-w-xl mx-auto animate-[fadeIn_0.3s_ease-out]"
    >
      <div className="mb-4 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-800">Edit Profil</h2>
        <p className="text-sm text-gray-500">
          Perbarui foto dan informasi akun Anda.
        </p>
      </div>

      {error && (
        <div className="text-sm p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Avatar Upload Section */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative w-32 h-32 group">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 aspect-square">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <UserIcon size={64} />
              </div>
            )}
          </div>

          {/* Overlay Button */}
          <label
            className={`
              absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center 
              cursor-pointer transition-opacity duration-200
              ${uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
            `}
          >
            {uploading ? (
              <Loader2 className="text-white animate-spin" size={32} />
            ) : (
              <>
                <Camera className="text-white mb-1" size={24} />
                <span className="text-white text-xs font-medium">Ubah Foto</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
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
            className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving || uploading}
          className="px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isSaving || uploading}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400 font-medium transition flex items-center gap-2"
        >
          {isSaving && <Loader2 size={18} className="animate-spin" />}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}