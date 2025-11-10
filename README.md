# Sahabat Mendaki - Frontend

Platform booking guide dan sewa peralatan mendaki di Lombok, Indonesia.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Backend API running (lihat [backend README](../sahabat_mendaki_backend/README.md))

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan API URL Anda

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
src/
├── app/                    # Next.js App Router
│   ├── bookings/          # Halaman booking & payment
│   ├── gear/              # Halaman sewa alat
│   ├── guides/            # Halaman guide service
│   ├── login/             # Authentication
│   ├── signup/
│   └── search/            # Search functionality
├── components/
│   ├── home/              # Homepage components
│   └── shared/            # Reusable components
└── lib/
    ├── api.ts             # API client
    └── auth.tsx           # Auth context
```

## ✨ Features

### Implemented
- ✅ **Authentication** - Login & Register
- ✅ **Search** - Cari gear dan guide
- ✅ **Gear Listing** - Browse peralatan mendaki
- ✅ **Guide Listing** - Browse guide profesional
- ✅ **Booking System** - Book gear & guide dengan form lengkap
- ✅ **Payment Integration** - Integrasi dengan Midtrans
- ✅ **Booking Management** - Lihat dan kelola booking
- ✅ **Payment Status** - Success & failed pages

### Coming Soon
- 🔜 Booking cancellation
- 🔜 Review system
- 🔜 Booking notifications
- 🔜 Payment history

## 🔧 Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Untuk production:
```env
NEXT_PUBLIC_API_BASE_URL=https://sahabat-mendaki-backend.vercel.app
```

## 📚 Documentation

- [Installation Guide](./INSTALLATION.md) - Setup lengkap & troubleshooting
- [Booking & Payment Guide](./BOOKING_PAYMENT_GUIDE.md) - Panduan fitur booking
- [Changelog](./CHANGELOG.md) - Riwayat perubahan

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔄 Integration dengan Backend

Frontend berkomunikasi dengan backend melalui REST API:

### Endpoints yang Digunakan:
- `POST /auth/login` - Login
- `POST /auth/register/customer` - Register
- `GET /search` - Search gear & guide
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `GET /bookings/:id/with-payment` - Get booking detail

Lihat [Backend API Documentation](../sahabat_mendaki_backend/API_DOCUMENTATION.md) untuk detail lengkap.

## 🎯 User Flow

### Booking Flow:
```
1. Browse gear/guide → 2. Select item → 3. Fill booking form
→ 4. Submit booking → 5. Redirect to Midtrans → 6. Complete payment
→ 7. Success/Failed page → 8. View booking list
```

### Authentication Flow:
```
1. Register/Login → 2. JWT token saved → 3. Auto include in API calls
→ 4. Access protected routes → 5. Logout clears token
```

## 🧪 Testing

### Manual Testing:

1. **Test Authentication:**
   - Register new user
   - Login dengan credentials
   - Check token di localStorage
   - Logout

2. **Test Search:**
   - Search gear dengan keyword
   - Search guide dengan keyword
   - Filter results

3. **Test Booking:**
   - Select gear/guide
   - Fill booking form
   - Submit dan check redirect ke Midtrans
   - Complete payment di sandbox
   - Check booking di list

### Test Credentials:
Gunakan test account dari backend atau register baru.

## 🐛 Troubleshooting

### Common Issues:

1. **PowerShell Execution Policy Error**
   - Gunakan CMD instead of PowerShell
   - Atau: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

2. **API Connection Error**
   - Pastikan backend running
   - Check `.env.local` sudah benar
   - Check CORS settings di backend

3. **Authentication Error (401)**
   - Login ulang
   - Clear localStorage
   - Check token expiry

Lihat [Installation Guide](./INSTALLATION.md) untuk troubleshooting lengkap.

## 🚀 Deployment

### Deploy to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Environment Variables di Vercel:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL

### Post-Deployment:
1. Update `FRONTEND_URL` di backend .env
2. Update Midtrans redirect URLs
3. Test payment flow di production

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React (icons)
- **Date Picker:** react-datepicker
- **API Client:** Fetch API
- **State Management:** React Context (Auth)

## 📞 Support

Untuk pertanyaan atau issue:
1. Check documentation di folder ini
2. Check backend documentation
3. Check console logs (F12)
4. Check network tab untuk API calls

## 📄 License

Private project - Sahabat Mendaki Team

---

**Built with ❤️ for Indonesian hikers**
