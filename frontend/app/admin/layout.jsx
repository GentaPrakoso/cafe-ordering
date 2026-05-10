'use client';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (!token || (user && !['admin','kasir','kitchen'].includes(user.role))) {
      router.push('/login');
    }
  }, [user, token]);

  if (!user) return null;
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}