import {createSlice} from "@reduxjs/toolkit";

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
            }
        }
    }
)

export const { setCurrentUser, logoutUser} =userSlice.actions
export default userSlice.reducer
