'use client';
import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();
  const [form, setForm] = useState({
    customer_name: '',
    table_number: '',
    type: 'dine_in',
    voucher_code: '',
    payment_method: 'cash'
  });

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <p>Keranjang kosong, silakan pilih menu dulu.</p>
      </div>
    );
  }

  const subtotal = total();
  const tax = subtotal * 0.11;
  const service = subtotal * 0.05;
  const grandTotal = subtotal + tax + service;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/orders', {
        customer_name: form.customer_name,
        table_number: form.table_number,
        type: form.type,
        items: items.map(i => ({
          menu_id: i.menu_id,
          quantity: i.quantity,
          notes: i.notes
        })),
        voucher_code: form.voucher_code || undefined
      });
      await api.post('/payments/create', {
        order_id: data.order_id,
        method: form.payment_method
      });
      clearCart();
      toast.success('Pesanan berhasil!');
      router.push(`/tracking/${data.order_id}`);
    } catch (err) {
      toast.error('Gagal membuat pesanan, coba lagi.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Nama kamu" value={form.customer_name}
          onChange={e => setForm({...form, customer_name: e.target.value})}
          className="w-full border p-3 rounded-xl" />
        <input required placeholder="Nomor meja" value={form.table_number}
          onChange={e => setForm({...form, table_number: e.target.value})}
          className="w-full border p-3 rounded-xl" />
        <select value={form.type}
          onChange={e => setForm({...form, type: e.target.value})}
          className="w-full border p-3 rounded-xl">
          <option value="dine_in">Dine In</option>
          <option value="take_away">Take Away</option>
        </select>
        <input placeholder="Kode voucher (opsional)" value={form.voucher_code}
          onChange={e => setForm({...form, voucher_code: e.target.value})}
          className="w-full border p-3 rounded-xl" />
        <select value={form.payment_method}
          onChange={e => setForm({...form, payment_method: e.target.value})}
          className="w-full border p-3 rounded-xl">
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