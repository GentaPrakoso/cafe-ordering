'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import socket from '@/lib/socket';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ todayOrders: 0, revenue: 0, pending: 0, completed: 0 });

  useEffect(() => {
    api.get('/orders').then(res => {
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = res.data.filter(o => o.created_at.startsWith(today));
      const revenue = todayOrders.reduce((sum, o) => sum + o.grand_total, 0);
      setStats({
        todayOrders: todayOrders.length,
        revenue,
        pending: res.data.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length,
        completed: res.data.filter(o => o.status === 'completed').length
      });
    });
    socket.connect();
    socket.emit('join-role', 'admin');
    return () => { socket.disconnect(); };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Order Hari Ini" value={stats.todayOrders} />
        <StatCard title="Revenue" value={`Rp ${stats.revenue.toLocaleString()}`} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Completed" value={stats.completed} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}