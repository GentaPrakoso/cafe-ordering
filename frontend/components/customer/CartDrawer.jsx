'use client';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="bg-black/50 w-full" onClick={onClose} />
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Keranjang</h2>
          <button onClick={onClose}><X /></button>
        </div>
        {items.length === 0 ? (
          <p className="text-gray-500">Keranjang kosong</p>
        ) : (
          <>
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between py-3 border-b">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  {item.notes && <p className="text-xs text-gray-500">{item.notes}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQuantity(item.menu_id, item.notes, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.menu_id, item.notes, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p>Rp {(item.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => removeItem(item.menu_id, item.notes)} className="text-red-500 text-xs">Hapus</button>
                </div>
              </div>
            ))}
            <div className="mt-4 text-right font-bold text-lg">Total: Rp {total().toLocaleString()}</div>
            <Link href="/checkout" className="block w-full mt-4 bg-amber-600 text-white py-3 rounded-xl text-center font-semibold">
              Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}