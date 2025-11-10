// src/app/layout.tsx
import './globals.css';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { AuthProvider } from '@/lib/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-100 text-gray-900 font-sans" suppressHydrationWarning>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}