'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AdminPromos() {
  const [vouchers, setVouchers] = useState([]);
  const [form, setForm] = useState({ code: '', discount_percent: '', discount_nominal: '', valid_from: '', valid_until: '', max_usage: '' });

  const fetchVouchers = () => api.get('/vouchers').then(res => setVouchers(res.data));
  useEffect(() => { fetchVouchers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/vouchers', form);
    toast.success('Voucher created');
    fetchVouchers();
  };

  const deleteVoucher = async (id) => {
    await api.delete(`/vouchers/${id}`);
    toast.success('Deleted');
    fetchVouchers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Promo / Voucher</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input placeholder="Kode" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required className="border p-2 rounded-xl w-full" />
        <div className="flex gap-2">
          <input placeholder="Diskon %" type="number" value={form.discount_percent} onChange={e => setForm({...form, discount_percent: e.target.value})} className="border p-2 rounded-xl w-1/2" />
          <input placeholder="Diskon Nominal" type="number" value={form.discount_nominal} onChange={e => setForm({...form, discount_nominal: e.target.value})} className="border p-2 rounded-xl w-1/2" />
        </div>
        <div className="flex gap-2">
          <input type="datetime-local" value={form.valid_from} onChange={e => setForm({...form, valid_from: e.target.value})} className="border p-2 rounded-xl w-1/2" />
          <input type="datetime-local" value={form.valid_until} onChange={e => setForm({...form, valid_until: e.target.value})} className="border p-2 rounded-xl w-1/2" />
        </div>
        <input type="number" placeholder="Maks Penggunaan" value={form.max_usage} onChange={e => setForm({...form, max_usage: e.target.value})} className="border p-2 rounded-xl w-full" />
        <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-xl">Buat Voucher</button>
      </form>
      <div className="space-y-2">
        {vouchers.map(v => (
          <div key={v.id} className="border p-4 rounded-xl flex justify-between">
            <div>
              <p className="font-bold">{v.code}</p>
              <p className="text-sm">{v.discount_percent}% / Rp {v.discount_nominal}</p>
            </div>
            <button onClick={() => deleteVoucher(v.id)} className="text-red-500">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}