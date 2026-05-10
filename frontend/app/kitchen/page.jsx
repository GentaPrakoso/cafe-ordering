'use client';
import { useEffect, useState } from 'react';
import socket from '@/lib/socket';
import api from '@/lib/axios';

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then(res => {
      setOrders(res.data.filter(o => o.status !== 'completed' && o.status !== 'cancelled'));
    });
    socket.connect();
    socket.emit('join-role', 'kitchen');
    socket.on('new-order', (order) => setOrders(prev => [order, ...prev]));
    socket.on('order-status-updated', (updated) => {
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    });
    // Sound notification
    const audio = new Audio('/notification.mp3');
    socket.on('new-order', () => audio.play());
    return () => { socket.disconnect(); };
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Kitchen Display</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['pending_confirmation', 'processing', 'cooking'].map(status => (
          <div key={status} className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 min-h-[300px]">
            <h2 className="text-xl font-semibold capitalize mb-3">{status.replace('_', ' ')}</h2>
            {orders.filter(o => o.status === status).map(order => (
              <div key={order.id} className="bg-white dark:bg-gray-700 p-3 rounded-xl mb-2 shadow">
                <p className="font-bold">{order.order_number}</p>
                <p>Meja {order.table_number} | {order.customer_name}</p>
                <div className="mt-2 flex gap-2">
                  {status === 'pending_confirmation' && (
                    <button onClick={() => updateStatus(order.id, 'processing')} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Proses</button>
                  )}
                  {status === 'processing' && (
                    <button onClick={() => updateStatus(order.id, 'cooking')} className="bg-orange-500 text-white px-2 py-1 rounded text-xs">Masak</button>
                  )}
                  {status === 'cooking' && (
                    <button onClick={() => updateStatus(order.id, 'ready')} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Siap</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}