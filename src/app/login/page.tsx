'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postJson } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      console.log('[Login] submitting', { email, password });
      console.log('[Login] Making request to backend...');
      
      // Make the request
      const data = await postJson('/auth/login', { email, password });
      console.log('[Login] Response received:', data);
      
      // Jika berhasil, response akan punya access_token
      if (data && data.access_token) {
        // Parse token untuk dapatkan info user
        const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
        console.log('[Login] Token payload:', tokenPayload);
        
        // Simpan token dan user info
        login(data.access_token, {
          id: tokenPayload.sub || 'unknown',
          email: tokenPayload.email || email,
          fullName: email.split('@')[0], // temporary, akan diupdate setelah get user profile
          role: tokenPayload.role || 'CUSTOMER'
        });
        router.push('/');
      } else {
        setError('Login gagal: respons tidak valid dari server');
      }
    } catch (err: any) {
      console.error('[Login] error', err);
      const message = err?.data?.message || err?.message || JSON.stringify(err);
      setError(message || 'Login gagal. Periksa kredensial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">Login Akun</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
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
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Belum punya akun?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-green-600 hover:underline font-semibold"
          >
            Sign Up di sini
          </button>
        </p>
      </div>
    </div>
  );
}
