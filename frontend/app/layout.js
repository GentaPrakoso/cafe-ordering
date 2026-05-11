import './globals.css';
import { Toaster } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/customer/CartDrawer'; // import
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'Modern Cafe',
  description: 'Pesan kopi favoritmu',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" />
          <CartDrawer /> {/* Selalu ada di semua halaman */}
        </AuthProvider>
      </body>
    </html>
  );
}