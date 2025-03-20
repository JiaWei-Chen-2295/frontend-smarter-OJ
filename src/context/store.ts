import {configureStore} from "@reduxjs/toolkit";
import {userSlice} from "../features/userSlice.ts";

export const store = configureStore({
    reducer: {
        currentUser: userSlice.reducer
    }
})
