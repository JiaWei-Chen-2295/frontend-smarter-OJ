import {configureStore} from "@reduxjs/toolkit";
import {userSlice} from "../features/userSlice.ts";

export const store = configureStore({
    reducer: {
        User: userSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
