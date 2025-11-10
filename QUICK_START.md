# Quick Start Guide - Sahabat Mendaki Frontend

## 🚀 Setup dalam 3 Langkah

### 1. Install Dependencies
```bash
cd sahabat_mendaki_frontend
npm install
```

### 2. Setup Environment
Buat file `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm run dev
```

Buka: http://localhost:3000

## ✅ Test Booking Flow

### Step 1: Login/Register
1. Buka http://localhost:3000/login
2. Login atau register akun baru

### Step 2: Browse & Select
**Untuk Gear:**
1. Buka http://localhost:3000/gear
2. Klik salah satu gear
3. Atau langsung: http://localhost:3000/gear/[id]

**Untuk Guide:**
1. Buka http://localhost:3000/guides
2. Klik salah satu guide
3. Atau langsung: http://localhost:3000/guides/[id]

### Step 3: Booking
1. Pilih tanggal mulai dan selesai
2. Pilih jumlah (item untuk gear, anggota untuk guide)
3. Tambah catatan (opsional)
4. Klik "Booking & Bayar"

### Step 4: Payment
1. Akan redirect ke Midtrans sandbox
2. Gunakan test card:
   - Card Number: `4811 1111 1111 1114`
   - Exp Date: `01/25`
   - CVV: `123`
3. Complete payment

### Step 5: Confirmation
1. Akan redirect ke success page
2. Klik "Lihat Semua Booking"
3. Atau buka: http://localhost:3000/bookings

## 📱 Halaman Utama

| URL | Deskripsi |
|-----|-----------|
| `/` | Homepage |
| `/gear` | List peralatan |
| `/gear/[id]` | Detail & booking gear |
| `/guides` | List guide |
| `/guides/[id]` | Detail & booking guide |
| `/bookings` | Daftar booking saya |
| `/bookings/[id]` | Detail booking |
| `/bookings/[id]/success` | Payment success |
| `/bookings/[id]/failed` | Payment failed |
| `/login` | Login |
| `/signup` | Register |
| `/search` | Search |

## 🔑 Protected Routes

Harus login untuk akses:
- `/bookings` - Daftar booking
- `/bookings/[id]` - Detail booking
- Booking action (submit form)

## 🎯 Fitur Utama

### ✅ Authentication
- Login dengan email & password
- Register customer/provider
- JWT token auto-saved
- Auto logout jika token expired

### ✅ Search
- Search gear by name/category
- Search guide by name/location
- Mixed search (gear + guide)

### ✅ Booking
- Form booking lengkap
- Date picker (tidak bisa pilih tanggal lampau)
- Auto calculate total harga
- Catatan opsional

### ✅ Payment
- Integrasi Midtrans
- Auto redirect ke payment page
- Success/failed handling
- Payment status tracking

### ✅ Booking Management
- List semua booking
- Status badge (Pending, Confirmed, etc)
- Detail booking dengan payment info
- Retry payment untuk pending booking

## 🐛 Troubleshooting

### Backend tidak running
**Error:** `Failed to fetch`
**Solution:** 
```bash
cd ../sahabat_mendaki_backend
npm run start:dev
```

### Token expired
**Error:** `401 Unauthorized`
**Solution:** Login ulang

### Date picker tidak muncul
**Error:** `Module not found: react-datepicker`
**Solution:**
```bash
npm install react-datepicker @types/react-datepicker
```

### PowerShell error
**Error:** `running scripts is disabled`
**Solution:** Gunakan CMD instead of PowerShell

## 📚 Dokumentasi Lengkap

- [Installation Guide](./INSTALLATION.md) - Setup detail & troubleshooting
- [Booking & Payment Guide](./BOOKING_PAYMENT_GUIDE.md) - Panduan lengkap booking
- [Changelog](./CHANGELOG.md) - Riwayat perubahan
- [README](./README.md) - Overview project

## 🎉 Selesai!

Sekarang Anda bisa:
- ✅ Browse gear dan guide
- ✅ Booking dengan form lengkap
- ✅ Bayar melalui Midtrans
- ✅ Lihat daftar booking
- ✅ Track payment status

**Happy Hiking! 🏔️**
