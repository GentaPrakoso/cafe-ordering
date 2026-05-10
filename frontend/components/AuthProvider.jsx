'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export default function AuthProvider({ children }) {
  const fetchUser = useAuthStore(s => s.fetchUser);
  useEffect(() => {
    fetchUser();
  }, []);
  return children;
}