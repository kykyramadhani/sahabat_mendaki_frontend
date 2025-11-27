'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postJson } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // 1. Register
      if (role === 'CUSTOMER') {
        await postJson('/auth/register/customer', { fullName, email, password });
      } else {
        await postJson('/auth/register/provider', { fullName, email, password, role });
      }
      
      // 2. Login otomatis
      const loginData = await postJson('/auth/login', { email, password });
      
      if (loginData && loginData.access_token) {
        // Decode token untuk verifikasi role (optional, tapi good practice)
        const tokenPayload = JSON.parse(atob(loginData.access_token.split('.')[1]));
        const userRole = tokenPayload.role || role; // Gunakan dari token atau state local

        login(loginData.access_token, {
            id: tokenPayload.sub,
            email: email,
            fullName: fullName,
            role: userRole
        });

        // 3. REDIRECT BERDASARKAN ROLE
        if (userRole === 'GEAR_OWNER') {
          router.push('/gear-management');
        } else if (userRole === 'GUIDE') {
          router.push('/guide-management');
        } else {
          router.push('/');
        }
      } else {
        throw new Error('Login failed after registration');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.data?.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">Buat Akun Baru</h1>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="GUIDE">Guide</option>
            <option value="GEAR_OWNER">Penyedia Gear</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Sudah punya akun?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-green-600 hover:underline font-semibold"
          >
            Login di sini
          </button>
        </p>
      </div>
    </div>
  );
}