'use client';
import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

export default function MenuItemModal({ menu, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addons, setAddons] = useState([]);

  const availableAddons = [
    'Extra Shot',
    'Whipped Cream',
    'Caramel Drizzle',
    'Ice Cream',
    'Less Sugar',
    'No Ice'
  ];

  const handleAddToCart = () => {
    const combinedNotes = [
      notes,
      ...addons.map((a) => `+${a}`),
    ]
      .filter(Boolean)
      .join(', ');

    onAddToCart({
      menu_id: menu.id,
      name: menu.name,
      price: Number(menu.price) || 0,
      image: menu.image,
      notes: combinedNotes,
      quantity,
    });
    onClose();
  };

  const price = Number(menu.price) || 0;
  const itemTotal = price * quantity;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl z-[100]">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold">{menu.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{menu.description}</p>
        <p className="text-amber-600 font-bold mt-2 text-lg">
          Rp {price.toLocaleString()}
        </p>

        {/* Quantity */}
        <div className="flex items-center gap-3 mt-4">
          <span className="font-medium">Jumlah:</span>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-1 rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-bold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-1 rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Add-ons */}
        <div className="mt-4">
          <p className="font-semibold mb-2">Tambah Add-on / Kustomisasi</p>
          <div className="grid grid-cols-2 gap-2">
            {availableAddons.map((addon) => (
              <label key={addon} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={addons.includes(addon)}
                  onChange={(e) => {
                    if (e.target.checked) setAddons([...addons, addon]);
                    else setAddons(addons.filter((a) => a !== addon));
                  }}
                  className="accent-amber-600"
                />
                {addon}
              </label>
            ))}
          </div>
        </div>

        {/* Catatan khusus */}
        <div className="mt-4">
          <p className="font-semibold mb-1">Catatan Khusus</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: less sugar, no ice, extra hot"
            className="w-full border rounded-xl p-2 text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            rows={2}
          />
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-6 bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition"
        >
          Tambah ke Keranjang - Rp {itemTotal.toLocaleString()}
        </button>
      </div>
    </div>
  );
}