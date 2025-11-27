// src/app/layout.tsx
import './globals.css';
import Header from '@/components/layout/Header'; // Sesuaikan path jika Header dipindah
import Footer from '@/components/layout/Footer'; // Sesuaikan path jika Footer dipindah
import { AuthProvider } from '@/lib/auth'; // <--- WAJIB IMPORT INI

export const metadata = {
  title: 'Sahabat Mendaki',
  description: 'Sewa Guide & Alat Mendaki di Lombok',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-100 text-gray-900 font-sans" suppressHydrationWarning>
        {/* AuthProvider HARUS membungkus semua children */}
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}