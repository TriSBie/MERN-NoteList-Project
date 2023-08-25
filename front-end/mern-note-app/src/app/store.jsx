import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./apiSlice"
import { setupListeners } from "@reduxjs/toolkit/dist/query"
import authReducers from "../features/auth/authSlice"

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducers
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware)
    },
    devTools: true
})

//enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch)

export default store