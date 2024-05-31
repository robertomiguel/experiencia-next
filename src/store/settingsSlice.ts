import { ImageSettings, SettingsState } from "@/types/settings";
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
        setImageSettings(state, action: PayloadAction<Partial<ImageSettings>>) {
            state.image = { ...state.image, ...action.payload };
        }
    },
});

export const { toogleSidesheet, setImageSettings } = settingsSlice.actions;

export default settingsSlice.reducer;