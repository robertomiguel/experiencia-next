import { SettingsState } from '@/types/settings';
import { create } from 'zustand';

export const useSettingsStore = create<SettingsState>((set) => ({
  openSidesheet: false,
  toogleSidesheet: (open: boolean) => set({ openSidesheet: open }),
}));