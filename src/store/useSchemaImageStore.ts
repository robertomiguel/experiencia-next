import { ImageSchemaState } from '@/types/image';
import { create } from 'zustand';

export const useImageStore = create<ImageSchemaState>((set) => ({
  list: [],
  prompt: '',
  isLoading: false,
  refImage: '',
  deleteImage: (imageIndex: number) => set((state) => ({ list: state.list.filter((_, i) => i !== imageIndex) })),
  clearList: () => set({ list: [] }),
  setPrompt: (prompt: string) => set({ prompt }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setRefImage: (refImage: string) => set({ refImage }),
  setList: (list: string[]) => set({ list }),
  insertImage: (image: string) => set((state) => ({ list: [image, ...state.list] })),
}));