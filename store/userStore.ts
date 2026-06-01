import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '../lib/menuData';

interface OrderHistoryItem {
  orderNumber: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  date: string;
  type: 'dine-in' | 'takeaway' | 'preorder';
}

interface UserState {
  name: string;
  phone: string;
  language: Language;
  hasOnboarded: boolean;
  orderHistory: OrderHistoryItem[];
  darkMode: boolean;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setLanguage: (lang: Language) => void;
  setHasOnboarded: (v: boolean) => void;
  addOrderToHistory: (order: OrderHistoryItem) => void;
  toggleDarkMode: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      phone: '',
      language: 'en',
      hasOnboarded: false,
      orderHistory: [],
      darkMode: false,
      setName: (name) => set({ name }),
      setPhone: (phone) => set({ phone }),
      setLanguage: (language) => set({ language }),
      setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
      addOrderToHistory: (order) =>
        set((s) => ({ orderHistory: [order, ...s.orderHistory].slice(0, 20) })),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: 'user-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);
