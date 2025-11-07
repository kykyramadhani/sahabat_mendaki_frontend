// src/data/mock.ts

export interface Gear {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  vendor: string;
  imageUrl: string;
  variants: { name: string; options: string[] }[];
}

export interface Guide {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  bio: string;
  imageUrl: string;
  pricePerDay: number;
  variants: { name: string; options: string[] }[];
}

export const GEAR_DATA: Gear[] = [
  {
    id: 'g001',
    name: 'Tenda Dome Kapasitas 4 Orang',
    category: 'Tenda',
    pricePerDay: 50000,
    vendor: 'Rinjani Gear',
    imageUrl: 'https://placehold.co/400x300/a5f3fc/333333?text=Tenda+Dome',
    variants: [{ name: 'Kapasitas', options: ['2 Orang', '4 Orang', '6 Orang'] }],
  },
  {
    id: 'g002',
    name: 'Sepatu Gunung (Ukuran 40-44)',
    category: 'Pakaian',
    pricePerDay: 40000,
    vendor: 'Lombok Adventurer',
    imageUrl: 'https://placehold.co/400x300/a5f3fc/333333?text=Sepatu+Gunung',
    variants: [{ name: 'Size', options: ['40', '41', '42', '43', '44'] }],
  },
  {
    id: 'g003',
    name: 'Carrier/Tas Gunung 60L',
    category: 'Perlengkapan',
    pricePerDay: 45000,
    vendor: 'Rinjani Gear',
    imageUrl: 'https://placehold.co/400x300/a5f3fc/333333?text=Carrier+60L',
    variants: [],
  },
  {
    id: 'g004',
    name: 'Kompor Lapangan & Nesting',
    category: 'Alat Masak',
    pricePerDay: 25000,
    vendor: 'Lombok Adventurer',
    imageUrl: 'https://placehold.co/400x300/a5f3fc/333333?text=Kompor+Nesting',
    variants: [],
  },
  {
    id: 'g005',
    name: 'Sleeping Bag & Matras',
    category: 'Perlengkapan',
    pricePerDay: 20000,
    vendor: 'Rinjani Gear',
    imageUrl: 'https://placehold.co/400x300/a5f3fc/333333?text=Sleeping+Bag',
    variants: [],
  },
  {
    id: 'g006',
    name: 'Jaket Gunung Waterproof',
    category: 'Pakaian',
    pricePerDay: 35000,
    vendor: 'Lombok Adventurer',
    imageUrl: 'https://placehold.co/400x300/a5f3fc/333333?text=Jaket+Gunung',
    variants: [{ name: 'Ukuran', options: ['S', 'M', 'L', 'XL'] }],
  },
];

export const GUIDE_DATA: Guide[] = [
  {
    id: 'h001',
    name: 'M. Rizki Assamsuli',
    rating: 4.9,
    specialty: 'Rinjani',
    bio: 'Berpengalaman lebih dari 5 tahun memandu Rinjani. Menguasai jalur Sembalun dan Torean. Siap bantu karir guide baru!',
    imageUrl: 'https://placehold.co/400x400/e0e7ff/4338ca?text=Rizki+A.',
    pricePerDay: 150000,
    variants: [{ name: 'Layanan Tambahan', options: ['Include Makan', 'Tanpa Makan', 'Include Akomodasi'] }],
  },
  {
    id: 'h002',
    name: 'Ida Ayu Varapanna',
    rating: 4.8,
    specialty: 'Pergasingan',
    bio: 'Spesialisasi bukit Pergasingan dan area Sembalun. Ramah dan sangat sabar untuk pendaki pemula.',
    imageUrl: 'https://placehold.co/400x400/e0e7ff/4338ca?text=Ayu+V.',
    pricePerDay: 120000,
    variants: [{ name: 'Gunung', options: ['Pergasingan', 'Rinjani', 'Lainnya'] }],
  },
  {
    id: 'h003',
    name: 'Putu Indah',
    rating: 4.7,
    specialty: 'Lainnya',
    bio: 'Menyukai jalur-jalur yang jarang dilewati. Ahli dalam fotografi pendakian dan manajemen konten.',
    imageUrl: 'https://placehold.co/400x400/e0e7ff/4338ca?text=Indah+P.',
    pricePerDay: 100000,
    variants: [],
  },
  {
    id: 'h004',
    name: 'Nengah Dwi',
    rating: 5.0,
    specialty: 'Rinjani',
    bio: 'Guide senior dengan sertifikasi. Sangat fokus pada manajemen proyek pendakian dan keamanan grup besar.',
    imageUrl: 'https://placehold.co/400x400/e0e7ff/4338ca?text=Nengah+D.',
    pricePerDay: 180000,
    variants: [{ name: 'Paket', options: ['Basic', 'Premium'] }],
  },
];