'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function AdminMenus() {
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', category_id: '', available: true });
  const [image, setImage] = useState(null);

  const fetchMenus = () => api.get('/menus').then(res => setMenus(res.data));
  useEffect(() => { fetchMenus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(k => formData.append(k, form[k]));
    if (image) formData.append('image', image);
    await api.post('/menus', formData);
    toast.success('Menu added');
    fetchMenus();
  };

  const deleteMenu = async (id) => {
    await api.delete(`/menus/${id}`);
    toast.success('Deleted');
    fetchMenus();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kelola Menu</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input placeholder="Nama" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="border p-2 rounded-xl w-full" />
        <input type="number" placeholder="Harga" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="border p-2 rounded-xl w-full" />
        <textarea placeholder="Deskripsi" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 rounded-xl w-full" />
        <input type="file" onChange={e => setImage(e.target.files[0])} className="border p-2 rounded-xl w-full" />
        <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-xl">Tambah Menu</button>
      </form>
      <div className="grid grid-cols-2 gap-4">
        {menus.map(m => (
          <div key={m.id} className="border p-4 rounded-xl flex justify-between">
            <div>
              <p className="font-bold">{m.name}</p>
              <p>Rp {m.price}</p>
            </div>
            <button onClick={() => deleteMenu(m.id)} className="text-red-500">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}