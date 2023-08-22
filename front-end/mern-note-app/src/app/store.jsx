import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./apiSlice"
import { setupListeners } from "@reduxjs/toolkit/dist/query"

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware)
    },
    devTools: true
})

setupListeners(store.dispatch)

export default store