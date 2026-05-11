'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useParams } from 'next/navigation';

export default function TrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/public/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(() => setOrder(null));
  }, [orderId]);

  if (!order) return <div className="p-4">Memuat pesanan...</div>;

  const statusStep = ['pending_confirmation', 'processing', 'cooking', 'ready', 'completed'];
  const currentIdx = statusStep.indexOf(order.status);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Status Pesanan</h1>
      <p>Order #{order.order_number}</p>
      <div className="mt-6 flex justify-between">
        {statusStep.map((step, idx) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= currentIdx ? 'bg-amber-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
              {idx + 1}
            </div>
            <span className="text-xs mt-1 capitalize">{step.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
      {order.payment_method === 'cash' && order.payment_status === 'pending' && (
        <p className="mt-4 text-yellow-600">Menunggu konfirmasi pembayaran kasir</p>
      )}
      {order.payment_status === 'paid' && (
        <p className="mt-4 text-green-600">Pembayaran berhasil</p>
      )}
    </div>
  );
}