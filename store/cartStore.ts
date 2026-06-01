import { create } from 'zustand';
import type { MenuItem } from '../lib/menuData';

export type OrderType = 'dine-in' | 'takeaway' | 'preorder';

interface CartItem { item: MenuItem; quantity: number; }

interface CartState {
  items: CartItem[];
  orderType: OrderType;
  selectedTable: number | null;
  specialInstructions: string;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  setOrderType: (t: OrderType) => void;
  setTable: (n: number | null) => void;
  setInstructions: (s: string) => void;
  subtotal: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  orderType: 'dine-in',
  selectedTable: null,
  specialInstructions: '',
  addItem: (item) =>
    set((s) => {
      const idx = s.items.findIndex((ci) => ci.item.id === item.id);
      if (idx >= 0) {
        const next = [...s.items];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return { items: next };
      }
      return { items: [...s.items, { item, quantity: 1 }] };
    }),
  removeItem: (id) => set((s) => ({ items: s.items.filter((ci) => ci.item.id !== id) })),
  updateQty: (id, delta) =>
    set((s) => {
      const next = s.items
        .map((ci) => ci.item.id === id ? { ...ci, quantity: ci.quantity + delta } : ci)
        .filter((ci) => ci.quantity > 0);
      return { items: next };
    }),
  clearCart: () => set({ items: [], selectedTable: null, specialInstructions: '' }),
  setOrderType: (orderType) => set({ orderType }),
  setTable: (selectedTable) => set({ selectedTable }),
  setInstructions: (specialInstructions) => set({ specialInstructions }),
  subtotal: () => get().items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0),
  totalItems: () => get().items.reduce((sum, ci) => sum + ci.quantity, 0),
}));
