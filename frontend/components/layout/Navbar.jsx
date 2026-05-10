'use client';
import Link from 'next/link';
import { useAuthStore, useCartStore } from '@/lib/store';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import CartDrawer from '@/components/customer/CartDrawer';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const items = useCartStore(s => s.items);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold tracking-tight">☕ CafeOrder</Link>
        <div className="flex gap-4 items-center">
          <Link href="/menu" className="hidden sm:block hover:text-amber-600">Menu</Link>
          {user ? (
            <>
              {user.role === 'customer' && (
                <button onClick={() => setCartOpen(true)} className="relative">
                  <ShoppingCart />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </button>
              )}
              <Link href={user.role === 'admin' || user.role === 'kasir' ? '/admin/dashboard' : user.role === 'kitchen' ? '/kitchen' : '/dashboard'}>
                <User />
              </Link>
              <button onClick={logout}><LogOut size={20} /></button>
            </>
          ) : (
            <Link href="/login" className="bg-amber-600 text-white px-4 py-2 rounded-xl">Login</Link>
          )}
        </div>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}