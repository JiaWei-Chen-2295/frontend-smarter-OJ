import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {UserControllerService} from "../../generated";

export const getCurrentUser = createAsyncThunk('/user/get/login', async () => {
    const resp = await UserControllerService.getLoginUserUsingGet()
    const currentUser: OJModel.User = {
        ...resp.data,
    }
    return currentUser
})

export const userSlice = createSlice(
    {
        name: 'currentUser',
        initialState: {
            currentUser: null
        },
        reducers: {
            setCurrentUser: (state, action) => {
                state.currentUser = action.payload
            },
            logoutUser: (state) => {
                state.currentUser = null
            },

        },
        extraReducers: (builder) => {
            builder.addCase(getCurrentUser.fulfilled, (state, action) => {
                state.currentUser = action.payload
            })
        }
    }
)

export const { setCurrentUser, logoutUser} = userSlice.actions
export default userSlice.reducer
