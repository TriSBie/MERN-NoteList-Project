import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null }, //expected receiving token from the response
    reducers: {
        setCredentials: (state, action) => {
            //get accessToken from payload data
            const { accessToken } = action.payload //destructuring
            state.token = accessToken;
        },
        logOut: (state, action) => {
            state.token = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state) => state.auth.token;