import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3500',
    }),
    //baseQUery response will return as data or error.
    reducerPath: 'noteApi',
    tagTypes: ['Note', 'User'],
    endpoints: (builder) => ({
    })
})
