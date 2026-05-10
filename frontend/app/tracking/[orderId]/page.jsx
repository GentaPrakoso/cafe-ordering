'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import socket from '@/lib/socket';
import { useParams } from 'next/navigation';

const statusSteps = ['pending_confirmation', 'processing', 'cooking', 'ready', 'completed'];

export default function TrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(res => setOrder(res.data));
    socket.connect();
    socket.emit('join-role', 'customer');
    socket.on('order-status-updated', (data) => {
      if (data.id == orderId) setOrder(prev => ({ ...prev, status: data.status }));
    });
    return () => { socket.disconnect(); };
  }, []);

  if (!order) return <p>Loading...</p>;

  const currentIdx = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-2">Status Pesanan</h1>
      <p>Order #{order.order_number}</p>
      <div className="mt-8 flex justify-between">
        {statusSteps.map((step, idx) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= currentIdx ? 'bg-amber-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
              {idx + 1}
            </div>
            <span className="text-xs mt-1 capitalize">{step.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}