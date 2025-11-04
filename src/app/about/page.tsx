'use client';

import PageWrapper from '@/components/PageWrapper';
import { Rocket, Target } from 'lucide-react';

export default function AboutPage() {
  const team = [
    { name: 'I Nengah Dwi Putra Witarsana', role: 'Project Manager' },
    { name: 'M. Rizki Assamsuli', role: 'Back-End Developer' },
    { name: 'Ida Ayu Varapanna Putra', role: 'Front-End Developer' },
    { name: 'Rizky Insania Ramadhani', role: 'Marketing & Business Development' },
    { name: 'Putu Indah Puspita Dewi', role: 'Customer Relation & Content' },
  ];

  return (
  <PageWrapper>
  <div className="bg-white">
      <div className="relative bg-gray-800 text-white">
        <img
          src="https://placehold.co/1600x600/22c55e/ffffff?text=Tim+Sahabat+Mendaki"
          alt="Tim Sahabat Mendaki"
          className="w-full h-72 object-cover opacity-30"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold">Tentang Kami</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">
            Misi kami adalah membuat petualangan mendaki di Lombok lebih mudah, aman, dan berkesan untuk semua.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Selamat Datang di Sahabat Mendaki</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Sahabat Mendaki adalah platform terintegrasi yang lahir dari kecintaan kami pada alam Lombok dan keinginan untuk berbagi keindahannya dengan aman. Kami menghubungkan para pendaki, terutama pemula, dengan guide lokal profesional dan penyedia perlengkapan mendaki berkualitas.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Kami percaya bahwa setiap orang berhak menikmati keajaiban Rinjani dan puncak lainnya. Kami hadir untuk memastikan petualangan Anda didukung dengan "GEAR SIAP, GUIDE JAGO".
            </p>
          </div>
          <img
            src="https://placehold.co/600x400/a5f3fc/333333?text=Pendakian+Lombok"
            alt="Pendakian Lombok"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="text-center md:text-left">
              <Rocket className="mx-auto md:mx-0 text-green-600 mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-2">Misi Kami</h3>
              <p className="text-gray-600">
                Menyediakan platform satu pintu yang mudah, aman, dan terpercaya untuk semua kebutuhan pendakian di Lombok, sekaligus menjadi wadah bagi guide baru dan UKM penyewaan alat lokal.
              </p>
            </div>
            <div className="text-center md:text-left">
              <Target className="mx-auto md:mx-0 text-green-600 mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-2">Visi Kami</h3>
              <p className="text-gray-600">
                Menjadi portal utama dan terfavorit bagi wisatawan dan pendaki yang ingin menjelajahi keindahan alam pegunungan di Lombok.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Tim di Balik Sahabat Mendaki
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <img
                src={`https://placehold.co/200x200/e0e7ff/4338ca?text=${member.name.split(' ')[0]}`}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 shadow-md"
              />
              <h4 className="font-semibold text-lg">{member.name}</h4>
              <p className="text-green-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </PageWrapper>
  );
}