import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Kita tidak bisa cek isi token di middleware client-side dengan mudah tanpa library jose
  // Tapi kita bisa cek keberadaan cookie/token minimal
  // Catatan: localStorage tidak bisa diakses di middleware (server-side)
  // Solusi terbaik: Simpan token di Cookie saat login, bukan cuma localStorage.
  
  // Untuk saat ini, karena Anda pakai localStorage, proteksi HOC (WithAuth) di komponen
  // sudah cukup. Middleware ini hanya placeholder jika Anda nanti pindah ke Cookies.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/bookings/:path*'],
};