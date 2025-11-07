import { PackageCheck, ShieldHalf, Users2 } from 'lucide-react';

const features = [
  {
    icon: PackageCheck,
    title: "Platform Terintegrasi",
    description: "Sewa guide dan perlengkapan mendaki berkualitas dalam satu platform. Mudah, cepat, dan praktis.",
  },
  {
    icon: ShieldHalf,
    title: "Aman & Nyaman untuk Pemula",
    description: "Kami bantu siapkan semua kebutuhan Anda. Guide kami dilatih untuk memprioritaskan keamanan pendaki pemula.",
  },
  {
    icon: Users2,
    title: "Berdaya Lokal",
    description: "Menjadi wadah karir bagi guide baru dan alat promosi untuk usaha penyewaan lokal di Lombok.",
  },
];

export default function ValuePropsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Kenapa Memilih Sahabat Mendaki?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami bukan sekadar penyedia jasa, kami adalah partner petualangan Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-8 rounded-xl shadow-lg bg-gray-50 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-emerald-100 rounded-full">
                  <feature.icon size={40} className="text-emerald-600" />
                </div>
              </div>
              <h3 className="text-2xl text-gray-800 font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}