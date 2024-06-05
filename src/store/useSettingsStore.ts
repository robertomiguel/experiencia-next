import { ImageSettings, SettingsState } from '@/types/settings';
import { create } from 'zustand';

const defaultSettings: ImageSettings = {
    prompt: "",
    model: 3,
    hairColor: 'Brown',
    gender: 'female',
    age: 20,
    eyeColor: 'Brown',
    ethnicGroup: 'Caucasian',
    dancer: 'Ballet dancer',
    background: 'Stage',
    hairStyle: 'Straight',
    hairLength: 'Medium',
}

export const useSettingsStore = create<SettingsState>((set) => ({
  openSidesheet: false,
  image: defaultSettings,
  updateSettings: (newSettings: ImageSettings) => set({ image: newSettings }),
  toogleSidesheet: (open: boolean) => set({ openSidesheet: open }),
}));