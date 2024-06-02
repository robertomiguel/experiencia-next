import { ImageSchema } from "@/types/iaDraw";
import { createSlice } from "@reduxjs/toolkit";

type ImageSchemaKey = keyof ImageSchema

const schemaImageSlice = createSlice({
    name: "schemaImage",
    initialState: <ImageSchema>{
        dancerStyles: [],
        backgrounds: [],
        hairColors: [],
        hairStyles: [],
        hairLengths: [],
        eyeColors: [],
        genderList: [],
        ethnicGroups: [],
        modelList: [],
    },
    reducers: {
        loadList(state, action: any) {
            const list = action.payload;
            Object.assign(state, list as ImageSchema)
        },
        clearList(state, action ) {
            state[action.payload as ImageSchemaKey ] = [];
        },
    },
});

export const { loadList, clearList } = schemaImageSlice.actions;

export default schemaImageSlice.reducer;