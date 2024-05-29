import { UserLogin } from "@/types/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: <UserLogin | {}>{},
    reducers: {
        login(state, action: PayloadAction<UserLogin>) {
            state = action.payload;
        },
        logout(state) {
            state = {};
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;