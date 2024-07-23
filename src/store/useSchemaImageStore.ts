import { ImageSchemaState } from '@/types/image';
import { create } from 'zustand';

export const useSchemaImageStore = create<ImageSchemaState>((set) => ({
  list: [],
  updateList: (list: string[]) => set({ list }),
  insertImage: (image: string) => set((state) => ({ list: [image, ...state.list] })),
  deleteImage: (imageIndex: number) => set((state) => ({ list: state.list.filter((_, i) => i !== imageIndex) })),
}));