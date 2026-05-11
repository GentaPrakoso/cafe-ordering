'use client';
import Link from 'next/link';
import { ShoppingCart, Coffee, User, LogOut } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Coffee className="h-6 w-6 text-amber-600" />
          <span>KopiKita</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Keranjang */}
          <button onClick={openCart} className="relative p-2">
            <ShoppingCart className="h-6 w-6" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                {items.length}
              </span>
            )}
          </button>

          {/* Jika sudah login, tampilkan ikon user dan tombol logout */}
          {token ? (
            <div className="flex items-center gap-2">
              <Link href={user?.role === 'admin' || user?.role === 'kasir' ? '/admin/dashboard' : user?.role === 'kitchen' ? '/kitchen' : '/dashboard'}>
                <User className="h-6 w-6" />
              </Link>
              <button onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            /* Jika belum login, tampilkan tombol Login */
            <Link href="/login" className="text-sm bg-amber-600 text-white px-4 py-2 rounded-full font-medium">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}