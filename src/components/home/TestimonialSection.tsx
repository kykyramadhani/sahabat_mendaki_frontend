import { Star } from 'lucide-react';

export default function TestimonialSection() {
  const testimonials = [
    {
      quote: 'Proses pemesanan mudah, sepatu gunung dalam kondisi bersih dan nyaman digunakan. Tidak ada komplain sama sekali. Sangat direkomendasikan!',
      name: 'Pelanggan Pertama',
      role: 'Penyewa Sepatu Gunung',
    },
    {
      quote: 'Guide-nya sangat jago! Sebagai pemula, saya merasa sangat aman dan banyak dibantu. Terima kasih Sahabat Mendaki, Rinjani jadi berkesan.',
      name: 'Budi Santoso',
      role: 'Pendaki Pemula',
    },
    {
      quote: 'Alatnya lengkap dan berkualitas. Tenda dan sleeping bag masih baru dan bersih. Harganya juga bersaing. Pasti sewa di sini lagi.',
      name: 'Citra Lestari',
      role: 'Turis Domestik',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Apa Kata Mereka?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.name} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"{item.quote}"</p>
              <h4 className="font-bold text-gray-800">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}