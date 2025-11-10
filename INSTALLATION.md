# Instalasi & Setup - Sahabat Mendaki Frontend

## 📦 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Backend sudah running (lihat backend README)

## 🚀 Quick Start

### 1. Install Dependencies

Jika Anda mengalami masalah dengan PowerShell execution policy, gunakan salah satu cara berikut:

**Opsi A: Gunakan CMD (Recommended)**
```cmd
cd sahabat_mendaki_frontend
npm install
```

**Opsi B: Bypass PowerShell Policy (Temporary)**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

**Opsi C: Install via npx**
```powershell
npx npm install
```

### 2. Setup Environment Variables

Buat file `.env.local` di root folder:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Untuk production:
```env
NEXT_PUBLIC_API_BASE_URL=https://sahabat-mendaki-backend.vercel.app
```

### 3. Install Type Definitions (Optional)

Jika belum terinstall otomatis:

```cmd
npm install --save-dev @types/react-datepicker
```

### 4. Run Development Server

```cmd
npm run dev
```

Buka browser: http://localhost:3000

## 📁 Struktur Project

```
sahabat_mendaki_frontend/
├── src/
│   ├── app/
│   │   ├── bookings/          # Halaman booking
│   │   │   ├── page.tsx       # List bookings
│   │   │   └── [id]/
│   │   │       ├── page.tsx   # Detail booking
│   │   │       ├── success/   # Payment success
│   │   │       └── failed/    # Payment failed
│   │   ├── gear/
│   │   │   ├── page.tsx       # List gear
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Detail & booking gear
│   │   ├── guides/
│   │   │   ├── page.tsx       # List guides
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Detail & booking guide
│   │   ├── login/
│   │   ├── signup/
│   │   └── search/
│   ├── components/
│   │   ├── home/
│   │   └── shared/
│   │       ├── Header.tsx     # Navigation (updated)
│   │       ├── GearCard.tsx
│   │       └── GuideCard.tsx
│   └── lib/
│       ├── api.ts             # API functions (updated)
│       └── auth.tsx           # Auth context
├── .env.local                 # Environment variables
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🌐 API Configuration

Frontend berkomunikasi dengan backend melalui `NEXT_PUBLIC_API_BASE_URL`.

### Development:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Production:
- Backend: https://sahabat-mendaki-backend.vercel.app
- Frontend: https://your-frontend-url.vercel.app

## 🔐 Authentication Flow

1. User login di `/login`
2. JWT token disimpan di localStorage
3. Token otomatis ditambahkan ke header untuk API calls
4. Token valid 24 jam
5. Auto refresh jika expired

## 📝 Features Checklist

- ✅ Authentication (Login/Register)
- ✅ Search (Gear & Guide)
- ✅ Gear Listing & Detail
- ✅ Guide Listing & Detail
- ✅ **Booking Form (Gear & Guide)** ← NEW
- ✅ **Payment Integration (Midtrans)** ← NEW
- ✅ **Booking Management** ← NEW
- ✅ **Payment Success/Failed Pages** ← NEW
- ✅ **User Booking History** ← NEW

## 🐛 Common Issues

### 1. PowerShell Execution Policy Error

**Error:**
```
npm : File D:\Program\Node\npm.ps1 cannot be loaded because running scripts is disabled
```

**Solution:**
Gunakan CMD instead of PowerShell, atau:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 2. Module Not Found Error

**Error:**
```
Module not found: Can't resolve 'react-datepicker'
```

**Solution:**
```cmd
npm install react-datepicker @types/react-datepicker
```

### 3. API Connection Error

**Error:**
```
Failed to fetch: Network error
```

**Solution:**
- Pastikan backend sudah running
- Check `.env.local` sudah benar
- Check CORS settings di backend

### 4. Authentication Error (401)

**Error:**
```
401 Unauthorized
```

**Solution:**
- Login ulang
- Clear localStorage
- Check token expiry

### 5. Booking Creation Failed

**Error:**
```
Failed to create booking
```

**Solution:**
- Pastikan sudah login
- Check tanggal valid (tidak di masa lalu)
- Check backend logs untuk detail error

## 🧪 Testing

### Manual Testing:

1. **Test Authentication:**
   ```
   1. Register new user
   2. Login
   3. Check token in localStorage
   4. Logout
   ```

2. **Test Search:**
   ```
   1. Search gear
   2. Search guide
   3. Search with query
   ```

3. **Test Booking:**
   ```
   1. Select gear/guide
   2. Fill booking form
   3. Submit booking
   4. Check redirect to Midtrans
   5. Complete payment
   6. Check booking in list
   ```

### Test Accounts:

Gunakan test account dari backend atau register baru.

## 📚 Documentation

- [Booking & Payment Guide](./BOOKING_PAYMENT_GUIDE.md)
- [Backend API Documentation](../sahabat_mendaki_backend/API_DOCUMENTATION.md)
- [Payment Flow](../sahabat_mendaki_backend/PAYMENT_FLOW.md)

## 🚀 Deployment to Vercel

### 1. Install Vercel CLI (Optional)
```cmd
npm install -g vercel
```

### 2. Deploy
```cmd
vercel
```

### 3. Set Environment Variables
Di Vercel dashboard:
- Settings → Environment Variables
- Add: `NEXT_PUBLIC_API_BASE_URL`

### 4. Update Backend
Update `FRONTEND_URL` di backend .env dengan URL Vercel Anda.

## 📞 Support

Jika ada masalah:
1. Check console logs (F12)
2. Check network tab untuk API calls
3. Check backend logs
4. Lihat dokumentasi di folder backend

---

**Selamat Coding! 🎉**
