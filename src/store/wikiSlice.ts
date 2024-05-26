import { WikiDataList, WikiState } from "@/types/wikipedia";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const wikiSlice = createSlice({
    name: "wiki",
    initialState: <WikiState>{
        itemsSelected: {},
    },
    reducers: {
        addWikiItem(state, action: PayloadAction<WikiDataList>) {
            state.itemsSelected[action.payload.id] = action.payload;
        },
        deleteWikiItem(state, action: PayloadAction<string>) {
            delete state.itemsSelected[action.payload];
        },
        loadWikiInitialState(state, action: PayloadAction<WikiState>) {
            state.itemsSelected = action.payload.itemsSelected;
        },
    },
});

export const { addWikiItem, deleteWikiItem, loadWikiInitialState } = wikiSlice.actions;

export default wikiSlice.reducer;