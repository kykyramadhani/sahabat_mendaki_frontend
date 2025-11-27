import { Search, Calendar, CreditCard, Mountain } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Search size={32} />,
      title: '1. Cari Kebutuhan',
      description: 'Jelajahi katalog guide dan peralatan mendaki kami.',
    },
    {
      icon: <Calendar size={32} />,
      title: '2. Booking Jadwal',
      description: 'Pilih tanggal pendakian dan lakukan pemesanan.',
    },
    {
      icon: <CreditCard size={32} />,
      title: '3. Bayar Aman',
      description: 'Lakukan pembayaran otomatis via payment gateway terpercaya.',
    },
    {
      icon: <Mountain size={32} />,
      title: '4. Siap Mendaki!',
      description: 'Ambil alat dan temui guide. Selamat menikmati petualangan!',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Cara Kerja Sahabat Mendaki
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col items-center text-center p-4">
              <div className="bg-green-500 p-4 rounded-full mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}