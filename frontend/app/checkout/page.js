'use client';
import { useState } from 'react';
import { useCartStore, useCustomerStore } from '@/lib/store';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { name, tableNumber } = useCustomerStore();
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  if (items.length === 0) {
    return <div className="p-4 text-center">Keranjang kosong</div>;
  }

  const subtotal = total();
  const tax = subtotal * 0.11;
  const service = subtotal * 0.05;
  const grandTotal = subtotal + tax + service;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        customer_name: name,
        table_number: tableNumber,
        type: 'dine_in',
        items: items.map(i => ({
          menu_id: i.menu_id,
          quantity: i.quantity,
          notes: i.notes
        })),
        voucher_code: voucherCode || undefined
      };
      const { data } = await api.post('/orders', orderData);
      // Create payment (cash / gateway)
      await api.post('/payments/create', {
        order_id: data.order_id,
        method: paymentMethod
      });
      clearCart();
      toast.success('Pesanan berhasil!');
      router.push(`/tracking/${data.order_id}`);
    } catch (err) {
      toast.error('Gagal membuat pesanan');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Checkout</h1>
      <p className="text-sm text-gray-500 mb-4">
        {name} - Meja {tableNumber}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Kode voucher (opsional)"
          value={voucherCode}
          onChange={e => setVoucherCode(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />
        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          className="w-full border p-3 rounded-xl"
        >
          <option value="cash">Tunai</option>
          <option value="qris">QRIS</option>
          <option value="transfer">Transfer</option>
          <option value="ewallet">E-Wallet</option>
        </select>

        <div className="border-t pt-4">
          <p>Subtotal: Rp {subtotal.toLocaleString()}</p>
          <p>Tax (11%): Rp {tax.toLocaleString()}</p>
          <p>Service (5%): Rp {service.toLocaleString()}</p>
          <p className="font-bold text-xl">Total: Rp {grandTotal.toLocaleString()}</p>
        </div>
        <button type="submit" className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold">
          Buat Pesanan
        </button>
      </form>
    </div>
  );
}