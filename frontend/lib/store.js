import { create } from 'zustand';
import api from './axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ token: data.token, user: data.user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
  fetchUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data });
    } catch {
      set({ user: null });
    }
  }
}));

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (item) => {
    const items = get().items;
    const existing = items.find(i => i.menu_id === item.menu_id && i.notes === item.notes);
    if (existing) {
      set({
        items: items.map(i => i.menu_id === item.menu_id && i.notes === item.notes
          ? { ...i, quantity: i.quantity + item.quantity }
          : i)
      });
    } else {
      set({ items: [...items, item] });
    }
  },
  removeItem: (menu_id, notes) => {
    set({ items: get().items.filter(i => !(i.menu_id === menu_id && i.notes === notes)) });
  },
  updateQuantity: (menu_id, notes, quantity) => {
    if (quantity < 1) return;
    set({
      items: get().items.map(i => i.menu_id === menu_id && i.notes === notes ? { ...i, quantity } : i)
    });
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
}));