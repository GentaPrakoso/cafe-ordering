'use client';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store';

export default function FloatingCart() {
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  if (items.length === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-40 bg-amber-600 text-white rounded-full p-4 shadow-2xl hover:bg-amber-700 transition flex items-center gap-2"
    >
      <ShoppingCart className="h-6 w-6" />
      <span className="font-bold text-sm bg-white text-amber-600 px-2 py-0.5 rounded-full">
        {items.length}
      </span>
    </button>
  );
}