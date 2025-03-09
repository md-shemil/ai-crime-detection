import { create } from 'zustand';
import type { User, Camera, Alert } from '../types';

interface AppState {
  user: User | null;
  cameras: Camera[];
  alerts: Alert[];
  setUser: (user: User | null) => void;
  addAlert: (alert: Alert) => void;
  updateAlertStatus: (alertId: string, status: Alert['status']) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  cameras: [],
  alerts: [],
  setUser: (user) => set({ user }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  updateAlertStatus: (alertId, status) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, status } : alert
      ),
    })),
}));