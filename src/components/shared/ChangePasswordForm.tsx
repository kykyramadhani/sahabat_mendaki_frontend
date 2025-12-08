"use client";

import { useState } from "react";
import { patchJsonAuth } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
    Lock,
    KeyRound,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
} from "lucide-react";

export default function ChangePasswordForm() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    // show/hide toggles
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword.length < 6)
            return setError("Password baru minimal 6 karakter.");

        if (newPassword !== confirm)
            return setError("Konfirmasi password tidak cocok.");

        try {
            await patchJsonAuth("/profile/password", {
                currentPassword,
                newPassword,
            });

            setSuccess("Password berhasil diperbarui!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirm("");

            setTimeout(() => router.back(), 1200);
        } catch (err: any) {
            setError(err?.data?.message || "Gagal mengubah password");
        }
    };

    const InputWrapper = ({
        label,
        value,
        setValue,
        placeholder,
        Icon,
        show,
        setShow,
    }: any) => (
        <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {label}
            </label>

            <div
                className="
                    flex items-center border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition relative
                    focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-300
                "
            >
                <Icon size={18} className="text-gray-500 mr-3" />

                <input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="
                        w-full bg-transparent outline-none text-gray-700
                    "
                />

                {/* Toggle eye button */}
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 text-gray-500 hover:text-gray-700 transition"
                >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="
                w-full bg-white border border-gray-200 rounded-2xl 
                p-8 shadow-lg max-w-xl mx-auto 
                animate-[slideInLeft_.45s_ease-out]
            "
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                    <Lock size={26} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Ganti Password
                    </h2>
                    <p className="text-sm text-gray-500">
                        Gunakan password yang kuat dan aman.
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2 p-3 mb-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <XCircle size={20} className="mt-[2px]" />
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="flex items-start gap-2 p-3 mb-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    <CheckCircle2 size={20} className="mt-[2px]" />
                    {success}
                </div>
            )}

            {/* Inputs with green focus */}
            <InputWrapper
                label="Password Saat Ini"
                value={currentPassword}
                setValue={setCurrentPassword}
                placeholder="••••••••"
                Icon={KeyRound}
                show={showCurrent}
                setShow={setShowCurrent}
            />

            <InputWrapper
                label="Password Baru"
                value={newPassword}
                setValue={setNewPassword}
                placeholder="••••••••"
                Icon={Lock}
                show={showNew}
                setShow={setShowNew}
            />

            <InputWrapper
                label="Konfirmasi Password Baru"
                value={confirm}
                setValue={setConfirm}
                placeholder="••••••••"
                Icon={KeyRound}
                show={showConfirm}
                setShow={setShowConfirm}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                >
                    Batal
                </button>

                <button
                    type="submit"
                    className="
                        px-5 py-2 bg-blue-600 text-white rounded-lg shadow 
                        hover:bg-blue-700 transition active:scale-[0.98]
                    "
                >
                    Simpan
                </button>
            </div>
        </form>
    );
}
