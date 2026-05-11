'use client';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(s => s.login);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Login berhasil!');
      router.push('/');
    } catch {
      toast.error('Login gagal, cek email dan password');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl" required />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-3 rounded-xl" required />
        <button type="submit" className="w-full bg-amber-600 text-white p-3 rounded-xl font-semibold">
          Masuk
        </button>
      </form>
    </div>
  );
}