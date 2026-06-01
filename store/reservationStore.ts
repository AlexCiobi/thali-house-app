import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Reservation {
  bookingRef: string;
  date: string;
  time: string;
  guestCount: number;
  occasion: 'none' | 'birthday' | 'anniversary' | 'business' | 'other';
  preferredTable: number | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface ReservationState {
  reservations: Reservation[];
  addReservation: (r: Reservation) => void;
  cancelReservation: (ref: string) => void;
}

export const useReservationStore = create<ReservationState>()(
  persist(
    (set) => ({
      reservations: [],
      addReservation: (r) => set((s) => ({ reservations: [r, ...s.reservations] })),
      cancelReservation: (ref) =>
        set((s) => ({
          reservations: s.reservations.map((r) =>
            r.bookingRef === ref ? { ...r, status: 'cancelled' } : r
          ),
        })),
    }),
    { name: 'reservation-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);
