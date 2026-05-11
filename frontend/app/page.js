'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import MenuCard from '@/components/customer/MenuCard';
import MenuItemModal from '@/components/customer/MenuItemModal';
import FloatingCart from '@/components/customer/FloatingCart';
import { useCartStore, useCustomerStore } from '@/lib/store';
import { toast } from 'sonner';
import { Coffee, Search, SlidersHorizontal, User, Hash } from 'lucide-react';

export default function HomePage() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { addItem } = useCartStore();
  const { name, tableNumber, isReady, setName, setTableNumber, setReady } = useCustomerStore();

  // Ambil parameter URL untuk prefill nomor meja
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('meja') || params.get('table');
    if (tableParam && !tableNumber) {
      setTableNumber(tableParam);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    api.get('/menus')
      .then((res) => {
        setMenus(res.data);
        const cats = [...new Set(res.data.map((m) => m.category_name).filter(Boolean))];
        setCategories(cats.length ? cats : ['Coffee', 'Non-Coffee', 'Food', 'Snack']);
      })
      .catch(() => {
        setCategories(['Coffee', 'Non-Coffee', 'Food', 'Snack']);
      });
  }, [isReady]);

  const handleAddToCart = (item) => {
    addItem(item);
    toast.success(`${item.name} ditambahkan ke keranjang`);
  };

  const handleStart = () => {
    if (!name.trim() || !tableNumber.trim()) {
      toast.error('Mohon isi nama dan nomor meja');
      return;
    }
    setReady(true);
  };

  // Jika belum siap, tampilkan form input
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Coffee className="h-6 w-6 text-amber-600" /> Selamat Datang
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Silakan isi data untuk mulai memesan
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1 block">Nama Kamu</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Nomor Meja</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nomor meja"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleStart}
              className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition"
            >
              Mulai Pesan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan menu (setelah ready)
  const filteredMenus = menus.filter((m) => {
    const matchCategory = activeCategory ? m.category_name === activeCategory : true;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-950 dark:to-gray-900">
      <section className="pt-6 pb-2 px-4 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-amber-800 dark:text-amber-400 flex items-center justify-center gap-2">
          <Coffee className="h-8 w-8" /> Kopi Kita
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Pesan kopi favoritmu, {name} (Meja {tableNumber})
        </p>
      </section>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 mt-4 sticky top-14 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3 rounded-xl shadow-sm">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-sm"
            >
              <option value="">Semua</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Coffee className="mx-auto h-16 w-16 mb-4 opacity-50" />
            <p>Tidak ada menu ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onDetail={setSelectedMenu}
              />
            ))}
          </div>
        )}
      </div>

      <FloatingCart />

      {selectedMenu && (
        <MenuItemModal
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <footer className="text-center py-6 text-gray-400 text-xs border-t border-gray-100 dark:border-gray-800 mt-10">
        © 2024 Kopi Kita • Jl. Kopi Nikmat No. 123
      </footer>
    </div>
  );
}