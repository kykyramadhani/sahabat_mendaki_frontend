# Panduan Booking & Payment - Frontend

## 📋 Fitur yang Ditambahkan

### 1. Halaman Detail Gear dengan Booking
**Path:** `/gear/[id]`
- Form booking untuk sewa peralatan
- Pilih tanggal mulai dan selesai
- Pilih jumlah item
- Tambah catatan (opsional)
- Kalkulasi otomatis total harga
- Integrasi dengan backend untuk create booking

### 2. Halaman Detail Guide dengan Booking (Updated)
**Path:** `/guides/[id]`
- Form booking untuk guide service
- Pilih tanggal mulai dan selesai
- Pilih jumlah anggota
- Tambah catatan (opsional)
- Kalkulasi otomatis total harga
- Integrasi dengan backend untuk create booking

### 3. Halaman Daftar Booking
**Path:** `/bookings`
- Menampilkan semua booking user yang login
- Status badge (Pending, Confirmed, Cancelled, Completed)
- Filter dan sorting
- Click untuk lihat detail

### 4. Halaman Detail Booking
**Path:** `/bookings/[id]`
- Detail lengkap booking
- Informasi pembayaran
- Link untuk lanjutkan pembayaran (jika pending)
- Status booking dan payment

### 5. Halaman Success Payment
**Path:** `/bookings/[id]/success`
- Konfirmasi pembayaran berhasil
- Detail booking
- Link ke daftar booking

### 6. Halaman Failed Payment
**Path:** `/bookings/[id]/failed`
- Notifikasi pembayaran gagal
- Detail booking
- Opsi untuk retry payment
- Link ke daftar booking

### 7. Update Header Navigation
- Tambah menu "Booking Saya" untuk user yang login
- Muncul di desktop dan mobile menu

## 🔄 Flow Booking & Payment

### Flow Lengkap:
```
1. User browse gear/guide
   ↓
2. User klik detail item
   ↓
3. User isi form booking (tanggal, jumlah, catatan)
   ↓
4. User klik "Booking & Bayar"
   ↓
5. Frontend kirim request ke backend POST /bookings
   ↓
6. Backend create booking & payment, return payment URL
   ↓
7. Frontend redirect ke Midtrans payment page
   ↓
8. User bayar di Midtrans
   ↓
9. Midtrans redirect ke:
   - Success: /bookings/[id]/success
   - Failed: /bookings/[id]/failed
   ↓
10. User bisa lihat semua booking di /bookings
```

## 🛠️ Teknologi yang Digunakan

### Dependencies:
- `react-datepicker` - Date picker component
- `lucide-react` - Icons
- `next/navigation` - Routing

### API Integration:
- `getJson()` - GET requests dengan auth
- `postJsonAuth()` - POST requests dengan auth header
- Auto token management dari localStorage

## 📝 Struktur Data Booking

### Request ke Backend:
```typescript
{
  itemType: 'service' | 'gear',
  itemId: string,
  startDate: string (ISO),
  endDate: string (ISO),
  quantity: number,
  numberOfPeople?: number, // untuk service
  notes?: string
}
```

### Response dari Backend:
```typescript
{
  booking: {
    id: string,
    userId: string,
    itemType: string,
    itemId: string,
    startDate: string,
    endDate: string,
    quantity: number,
    totalAmount: number,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
    notes?: string,
    createdAt: string
  },
  payment: {
    id: string,
    amount: number,
    status: 'PENDING' | 'SETTLED' | 'EXPIRED' | 'FAILED' | 'DENIED',
    paymentUrl: string,
    token: string,
    expiresAt: string
  }
}
```

## 🎨 UI Components

### Status Badge
Menampilkan status dengan warna berbeda:
- **PENDING** - Yellow (Menunggu Pembayaran)
- **CONFIRMED** - Green (Terkonfirmasi)
- **CANCELLED** - Red (Dibatalkan)
- **COMPLETED** - Blue (Selesai)
- **SETTLED** - Green (Lunas)
- **EXPIRED** - Gray (Kadaluarsa)
- **FAILED** - Red (Gagal)
- **DENIED** - Red (Ditolak)

### Date Picker
- Min date: hari ini (tidak bisa pilih tanggal lampau)
- End date min: start date
- Format: dd MMMM yyyy (Indonesia)

### Price Display
- Format: Rp123.456 (Indonesian locale)
- Auto calculate: price × duration × quantity

## 🔐 Authentication

### Protected Routes:
- `/bookings` - Harus login
- `/bookings/[id]` - Harus login
- Booking action - Harus login

### Auto Redirect:
- Jika belum login, redirect ke `/login`
- Setelah login, bisa langsung booking

## 🧪 Testing

### Manual Testing Flow:

1. **Test Booking Gear:**
   ```
   1. Buka http://localhost:3000/gear
   2. Klik salah satu gear
   3. Pilih tanggal dan jumlah
   4. Klik "Booking & Bayar"
   5. Login jika belum
   6. Akan redirect ke Midtrans
   ```

2. **Test Booking Guide:**
   ```
   1. Buka http://localhost:3000/guides
   2. Klik salah satu guide
   3. Pilih tanggal dan jumlah anggota
   4. Klik "Booking & Bayar"
   5. Login jika belum
   6. Akan redirect ke Midtrans
   ```

3. **Test Payment:**
   ```
   1. Di Midtrans sandbox, gunakan test card:
      - Card: 4811 1111 1111 1114
      - Exp: 01/25
      - CVV: 123
   2. Complete payment
   3. Akan redirect ke success page
   ```

4. **Test Booking List:**
   ```
   1. Login
   2. Buka http://localhost:3000/bookings
   3. Lihat semua booking
   4. Klik untuk detail
   ```

## 🐛 Troubleshooting

### Booking tidak muncul di list
- Pastikan sudah login dengan user yang sama
- Refresh halaman
- Check console untuk error

### Payment URL tidak muncul
- Check backend logs
- Pastikan Midtrans credentials sudah benar
- Check response dari backend

### Redirect tidak bekerja
- Pastikan FRONTEND_URL di backend sudah benar
- Check Midtrans dashboard settings
- Pastikan notification URL sudah diset

### Status tidak update setelah payment
- Check backend logs untuk notification
- Pastikan Midtrans notification URL sudah diset
- Bisa gunakan simulate endpoint untuk testing

## 📚 Environment Variables

### Frontend (.env.local):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
# atau
NEXT_PUBLIC_API_BASE_URL=https://sahabat-mendaki-backend.vercel.app
```

### Backend (.env):
```env
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
FRONTEND_URL=http://localhost:3000
BACKEND_URL=https://sahabat-mendaki-backend.vercel.app
NODE_ENV=development
```

## 🚀 Deployment

### Vercel Deployment:
1. Set environment variables di Vercel dashboard
2. Deploy frontend
3. Update FRONTEND_URL di backend
4. Update Midtrans notification URL

### Testing Production:
1. Gunakan production Midtrans credentials
2. Test dengan real payment methods
3. Monitor logs untuk errors

## 📞 Support

Untuk pertanyaan atau issue:
1. Check console logs (browser & backend)
2. Check network tab untuk API calls
3. Check backend documentation: `PAYMENT_FLOW.md`
4. Check Midtrans dashboard untuk transaction logs

---

**Happy Booking! 🏔️**
