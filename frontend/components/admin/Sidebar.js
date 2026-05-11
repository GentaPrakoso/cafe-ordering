'use client';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function Sidebar() {
  const { user } = useAuthStore();
  const links = user?.role === 'kitchen' ? [] : [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Pesanan' },
    { href: '/admin/menus', label: 'Menu' },
    { href: '/admin/promos', label: 'Promo' },
  ];
  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 min-h-screen p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      {links.map(l => (
        <Link key={l.href} href={l.href} className="block p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-gray-700">{l.label}</Link>
      ))}
    </aside>
  );
}