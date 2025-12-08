'use client';

import { Mail, Phone, Instagram } from 'lucide-react'; // Hapus 'Mountain'
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  const handleNav = (path: string) => {
    router.push(path);
  };

  return (
    <footer className="bg-gray-800 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Deskripsi */}
          <div>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleNav('/'); }}
              className="flex items-center gap-3 mb-4 group"
            >
              {/* LOGO BARU DISINI */}
              <img 
                src="https://mcylrlbnywxrtclvusfx.supabase.co/storage/v1/object/public/images-sahabat-mendaki/ChatGPT%20Image%20Sep%202,%202025,%2005_39_13%20PM.png" 
                alt="Sahabat Mendaki"
                className="w-10 h-10 object-cover rounded-full border-2 border-green-500/50 group-hover:border-green-500 transition-colors"
              />
              
              <span className="text-2xl font-bold text-white">
                Sahabat<span className="text-green-500">Mendaki</span>
              </span>
            </a>
            <p className="text-sm text-gray-400 italic">
              “GEAR SIAP, GUIDE JAGO”
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              Platform penyewaan jasa guide dan alat mendaki terpercaya di Lombok.
            </p>
          </div>

          {/* Link Cepat */}
          <div>
            <h5 className="font-bold text-white mb-4">Link Cepat</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNav('/gear')} className="hover:text-green-400 transition-colors">
                  Sewa Alat
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/guides')} className="hover:text-green-400 transition-colors">
                  Cari Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/about')} className="hover:text-green-400 transition-colors">
                  Tentang Kami
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/#how-it-works')} className="hover:text-green-400 transition-colors">
                  Cara Kerja
                </button>
              </li>
            </ul>
          </div>

          {/* Kemitraan */}
          <div>
            <h5 className="font-bold text-white mb-4">Kemitraan</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400">Gabung jadi Guide</a></li>
              <li><a href="#" className="hover:text-green-400">Daftarkan Toko Alat</a></li>
              <li><a href="#" className="hover:text-green-400">Karir</a></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h5 className="font-bold text-white mb-4">Hubungi Kami</h5>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <Mail size={18} className="text-green-500" />
                <span>kontak@sahabatmedaki.id</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <Phone size={18} className="text-green-500" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <Instagram size={18} className="text-green-500" />
                <span>@sahabat_mendaki</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Sahabat Mendaki. Dibuat dengan cinta di Lombok.</p>
        </div>
      </div>
    </footer>
  );
}