import { ImageSchema, ImageSchemaState } from '@/types/iaDraw';
import { create } from 'zustand';

const initialState: ImageSchema = {
    dancerStyles: [],
    backgrounds: [],
    hairColors: [],
    hairStyles: [],
    hairLengths: [],
    eyeColors: [],
    genderList: [],
    ethnicGroups: [],
    modelList: [],
}

export const useSchemaImageStore = create<ImageSchemaState>((set) => ({
  list: initialState,
  setSchemaImage: (schemaImage: ImageSchema) => set({ list: schemaImage }),
}));