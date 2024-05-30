import { SettingsState } from "@/types/settings";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
    name: "user",
    initialState: <SettingsState>{
        openSidesheet: false
    },
    reducers: {
        toogleSidesheet(state, action: PayloadAction<boolean>) {
            state.openSidesheet = action.payload;
        },
    },
});

export const { toogleSidesheet } = settingsSlice.actions;

export default settingsSlice.reducer;