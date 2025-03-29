import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {UserControllerService} from "../../generated";

interface UserState {
    currentUser: UserState | null;
    status: UserStateStatus;
}

// 通过请求获得当前用户登录态
export const getCurrentUser = createAsyncThunk('/user/get/login', async () => {
    const resp = await UserControllerService.getLoginUserUsingGet()
    const currentUser: OJModel.User = {
        ...resp.data,
    }

    if (resp.data === null) {
        return null
    }

    return currentUser
})

export const userSlice = createSlice(
    {
        name: 'currentUser',
        initialState: {
            currentUser: null,
            status: 'loading'
        } as UserState,
        reducers: {
            setCurrentUser: (state, action) => {
                state.currentUser = action.payload
            },
            logoutUser: (state) => {
                state.currentUser = null
            },

        },
        extraReducers: (builder) => {
            builder.addCase(getCurrentUser.pending, (state) => {
                state.status = 'loading'
            })
                .addCase(getCurrentUser.fulfilled, (state, action) => {
                    state.status = 'ok'
                    state.currentUser = action.payload
            })
                .addCase(getCurrentUser.rejected, (state) => {
                    state.status = 'ok'
                })

        }
    }
)

export const { setCurrentUser, logoutUser} = userSlice.actions
export default userSlice.reducer
export type UserStateStatus = 'loading' | 'ok';
