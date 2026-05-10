# Cafe Ordering System

Aplikasi pemesanan cafe modern dengan fitur realtime order, manajemen dapur, dan payment gateway.

## Teknologi
- Frontend: Next.js 14, Tailwind, Shadcn UI
- Backend: Node.js, Express, MySQL, Socket.IO
- Payment: Midtrans Sandbox

## Instalasi & Menjalankan

1. Clone repo dan masuk ke folder.
2. Setup database:
   - Buat database MySQL.
   - Jalankan `database/schema.sql`, lalu `database/seed.sql`.
3. Backend:
   - `cd backend`
   - Salin `.env.example` ke `.env`, isi konfigurasi.
   - `npm install && npm run dev`
4. Frontend:
   - `cd frontend`
   - Salin `.env.example` ke `.env`.
   - `npm install && npm run dev`
5. Buka `http://localhost:3000`.

## Akun Demo
- Admin: admin@cafe.com / admin123
- Kasir: kasir@cafe.com / admin123
- Kitchen: kitchen@cafe.com / admin123
- Customer: customer@cafe.com / admin123

## Catatan
- Midtrans harus diisi Server Key & Client Key dari akun sandbox.
- Upload folder `public/uploads` harus ada di backend.