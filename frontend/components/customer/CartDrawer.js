'use client';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, cartOpen, closeCart, clearCart } = useCartStore();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop desktop */}
      <div className="hidden md:block absolute inset-0 bg-black/50" onClick={closeCart} />

      {/* Drawer */}
      <div className="relative w-full md:max-w-lg bg-white dark:bg-gray-900 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-600" />
            Keranjang Belanja
          </h2>
          <button
            onClick={closeCart}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Isi */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 px-6">
            <ShoppingBag className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Keranjang kosong</p>
            <p className="text-sm mt-1">Yuk, tambahkan menu favoritmu!</p>
            <button
              onClick={closeCart}
              className="mt-4 text-amber-600 font-semibold text-sm"
            >
              ← Kembali ke Menu
            </button>
          </div>
        ) : (
          <>
            {/* Daftar item */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl relative group"
                >
                  {/* Gambar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover rounded" />
                    ) : (
                      <span className="text-2xl">☕</span>
                    )}
                  </div>

                  {/* Detail */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold truncate">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.menu_id, item.notes)}
                        className="text-red-500 hover:text-red-700 p-1 -mr-1 flex-shrink-0"
                        title="Hapus item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.notes}</p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.menu_id, item.notes, item.quantity - 1)}
                          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menu_id, item.notes, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600">
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">
                            Rp {item.price.toLocaleString()} / item
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-white dark:bg-gray-900 sticky bottom-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-xl font-bold text-amber-600">
                  Rp {total().toLocaleString()}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-amber-600 text-white py-3 rounded-xl text-center font-semibold text-lg hover:bg-amber-700 transition active:scale-[0.98]"
              >
                Lanjut Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}