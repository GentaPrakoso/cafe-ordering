'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import socket from '@/lib/socket';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data));
    socket.connect();
    socket.emit('join-role', 'admin');
    socket.on('new-order', (order) => setOrders(prev => [order, ...prev]));
    return () => { socket.disconnect(); };
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manajemen Pesanan</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex justify-between">
            <div>
              <p className="font-bold">{order.order_number} - {order.customer_name}</p>
              <p className="text-sm capitalize">Status: {order.status.replace('_', ' ')}</p>
            </div>
            <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="border p-2 rounded-xl">
              <option value="pending_confirmation">Pending Confirmation</option>
              <option value="processing">Processing</option>
              <option value="cooking">Cooking</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}