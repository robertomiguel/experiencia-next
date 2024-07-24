import { SettingsState } from '@/types/settings';
import { create } from 'zustand';

export const useSettingsStore = create<SettingsState>((set) => ({
  openSidesheet: false,
  chatList: [],
  chatHistory: [],
  chatRole: '',
  toogleSidesheet: (open: boolean) => set({ openSidesheet: open }),
  setChatList: (chatList: any[]) => set({ chatList }),
  setChatRole: (chatRole: string) => set({ chatRole }),
  setChatHistory: (chatHistory: any[]) => set({ chatHistory })
}));