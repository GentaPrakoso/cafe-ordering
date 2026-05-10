'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import MenuCard from '@/components/customer/MenuCard';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { addItem } = useCartStore();

  useEffect(() => {
    api.get('/menus').then(res => setMenus(res.data));
    // Dummy categories
    setCategories(['Coffee', 'Non-Coffee', 'Food', 'Snack']);
  }, []);

  const addToCart = (menu) => {
    addItem({
      menu_id: menu.id,
      name: menu.name,
      price: menu.price,
      image: menu.image,
      notes: '',
      quantity: 1
    });
    toast.success(`${menu.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Menu Kami</h1>
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 flex-1 min-w-[200px] dark:bg-gray-800"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-xl px-4 py-2 dark:bg-gray-800"
        >
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {menus.filter(m => 
          (!categoryFilter || m.category_name === categoryFilter) &&
          m.name.toLowerCase().includes(search.toLowerCase())
        ).map(menu => (
          <MenuCard key={menu.id} menu={menu} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}