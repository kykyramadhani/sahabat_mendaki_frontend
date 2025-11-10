# Changelog - Sahabat Mendaki Frontend

## [1.1.2] - 2024-11-10

### 🐛 Bug Fixes

#### Booking Details Empty
- **Fixed:** Detail booking tidak menampilkan informasi item (gear/service)
- **Added:** Fetch item details secara terpisah di booking pages
- **Changed:** 3 files updated:
  - `src/app/bookings/[id]/page.tsx` - Added item details section
  - `src/app/bookings/[id]/success/page.tsx` - Added item summary
  - `src/app/bookings/[id]/failed/page.tsx` - Added item summary
- **Impact:** User sekarang bisa lihat detail lengkap item yang di-booking
- **Documentation:** Lihat `BUGFIX_BOOKING_DETAILS.md` untuk detail lengkap

#### Duration Calculation Clarification
- **Added:** Comment untuk menjelaskan kalkulasi durasi
- **Note:** Kalkulasi sudah benar (inclusive of start and end dates)
- **Example:** 11-12 Nov = 2 hari (11 dan 12)

---

## [1.1.1] - 2024-11-10

### 🐛 Bug Fixes

#### Limit Validation Error
- **Fixed:** Error "limit must not be greater than 100" saat klik detail gear/guide
- **Changed:** Ubah `limit: 1000` menjadi `limit: 100` di 3 file:
  - `src/app/gear/[id]/page.tsx`
  - `src/app/guides/[id]/page.tsx`
  - `src/app/search/page.tsx`
- **Impact:** Detail page sekarang bisa dibuka tanpa error
- **Documentation:** Lihat `BUGFIX_LIMIT.md` untuk detail lengkap

---

## [1.1.0] - 2024-11-10

### ✨ Fitur Baru

#### 1. Booking & Payment Integration
- **Halaman Detail Gear dengan Form Booking** (`/gear/[id]`)
  - Form untuk booking sewa peralatan
  - Date picker untuk pilih tanggal sewa
  - Input jumlah item
  - Textarea untuk catatan
  - Auto calculate total harga
  - Integrasi dengan backend API

- **Update Halaman Detail Guide** (`/guides/[id]`)
  - Integrasi dengan backend untuk create booking
  - Form booking dengan date picker
  - Input jumlah anggota
  - Textarea untuk catatan
  - Auto calculate total harga
  - Button "Booking & Bayar" dengan loading state

- **Halaman Daftar Booking** (`/bookings`)
  - List semua booking user
  - Status badge dengan warna berbeda
  - Click untuk lihat detail
  - Empty state dengan CTA
  - Protected route (harus login)

- **Halaman Detail Booking** (`/bookings/[id]`)
  - Detail lengkap booking
  - Informasi pembayaran
  - Link untuk lanjutkan pembayaran (jika pending)
  - Status booking dan payment
  - Button kembali ke list

- **Halaman Payment Success** (`/bookings/[id]/success`)
  - Konfirmasi pembayaran berhasil
  - Icon success (CheckCircle)
  - Detail booking
  - CTA ke daftar booking dan home

- **Halaman Payment Failed** (`/bookings/[id]/failed`)
  - Notifikasi pembayaran gagal
  - Icon failed (XCircle)
  - Detail booking
  - Opsi retry payment (jika masih pending)
  - CTA ke daftar booking dan home

#### 2. API Integration
- **New Function: `postJsonAuth()`** di `lib/api.ts`
  - POST request dengan authentication header
  - Auto include JWT token dari localStorage
  - Error handling
  - Logging untuk debugging

#### 3. Navigation Updates
- **Update Header Component**
  - Tambah menu "Booking Saya" untuk user yang login
  - Dynamic navigation based on auth state
  - Muncul di desktop dan mobile menu

### 🔧 Improvements

#### UI/UX:
- Consistent date formatting (Indonesian locale)
- Loading states untuk async operations
- Disabled states untuk invalid forms
- Error messages yang jelas
- Responsive design untuk semua halaman baru

#### Code Quality:
- TypeScript types untuk semua components
- Consistent error handling
- Console logging untuk debugging
- Clean code structure

### 📝 Documentation

- **INSTALLATION.md** - Panduan instalasi dan setup
- **BOOKING_PAYMENT_GUIDE.md** - Panduan lengkap booking & payment
- **CHANGELOG.md** - File ini

### 🔄 Integration dengan Backend

Semua fitur terintegrasi dengan backend API:
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `GET /bookings/:id` - Get booking detail
- `GET /bookings/:id/with-payment` - Get booking with payment info

### 🎯 Flow Lengkap

```
User Browse → Select Item → Fill Form → Submit Booking 
→ Backend Create Booking & Payment → Redirect to Midtrans 
→ User Pay → Midtrans Redirect → Success/Failed Page 
→ View Booking List
```

### 🐛 Bug Fixes

- Fix date picker min date (tidak bisa pilih tanggal lampau)
- Fix auth redirect untuk protected routes
- Fix price calculation untuk multiple items

### ⚠️ Breaking Changes

Tidak ada breaking changes. Semua fitur existing tetap berfungsi.

### 📦 Dependencies

Tidak ada dependency baru yang ditambahkan. Semua menggunakan package yang sudah ada:
- `react-datepicker` (sudah ada)
- `lucide-react` (sudah ada)
- `next` (sudah ada)

### 🚀 Deployment Notes

1. Set environment variable `NEXT_PUBLIC_API_BASE_URL`
2. Pastikan backend sudah deployed dan accessible
3. Update `FRONTEND_URL` di backend .env
4. Set Midtrans notification URL di dashboard

### 📋 Testing Checklist

- [x] Booking gear berhasil
- [x] Booking guide berhasil
- [x] Payment redirect ke Midtrans
- [x] Success page muncul setelah payment
- [x] Failed page muncul jika payment gagal
- [x] Booking list menampilkan semua booking
- [x] Booking detail menampilkan info lengkap
- [x] Protected routes redirect ke login
- [x] Navigation menu update sesuai auth state

### 🔜 Future Improvements

- [ ] Add booking cancellation
- [ ] Add booking completion
- [ ] Add review system after booking completed
- [ ] Add booking filters and search
- [ ] Add booking notifications
- [ ] Add booking calendar view
- [ ] Add payment history
- [ ] Add refund system

---

## [1.0.0] - 2024-11-09

### Initial Release
- Authentication (Login/Register)
- Search functionality (Gear & Guide)
- Gear listing and detail pages
- Guide listing and detail pages
- Basic UI components
- Responsive design

---

**Maintained by:** Sahabat Mendaki Team
**Last Updated:** 2024-11-10
