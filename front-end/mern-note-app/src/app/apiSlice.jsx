import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { logOut, setCredentials } from "../features/auth/authSlice"


//customize baseQuery - setting default headers on requests
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    // indicates whether the user agent should send or recives cookies from other domain
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        console.log(token)
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})



//automatic re-authorization by extending fetchBaseQuery when encountering a 401 Unauthorized
const baseQueryWithReAuth = async (args, api, extraOptions) => {
    // console.log(args) //-- requestUrl, method, body
    // console.log(api)  //-- signal, dispatch, getState()
    // console.log(extraOptions) //-- custom Like: { shout: true }
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401 && result?.error) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        try {
            const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)
            if (refreshResult?.data) {
                // store the new token 
                api.dispatch(setCredentials({ ...refreshResult?.data }))
                // retry original query with new access token
                result = await baseQuery(args, api, extraOptions)
            } else {
                if (refreshResult?.error?.status === 403 || result?.error?.status === 401 || result?.error) {
                    refreshResult.error.data.message = "Your login has expired."
                }
                return refreshResult
            }
        } catch (err) {
            console.log(err)
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    //baseQUery response will return as data or error.
    tagTypes: ['Note', 'User'],
    endpoints: (builder) => ({
    })
})

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { setCredentials } from '../features/auth/authSlice'

// const baseQuery = fetchBaseQuery({
//     baseUrl: 'http://localhost:3500',
//     credentials: 'include',
//     prepareHeaders: (headers, { getState }) => {
//         const token = getState().auth.token

//         if (token) {
//             headers.set("authorization", `Bearer ${token}`)
//         }
//         return headers
//     }
// })

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//     // console.log(args) // request url, method, body
//     // console.log(api) // signal, dispatch, getState()
//     // console.log(extraOptions) //custom like {shout: true}

//     let result = await baseQuery(args, api, extraOptions)

//     // If you want, handle other status codes, too
//     if (result?.error?.status === 403 && result.error.status === 401) {
//         console.log('sending refresh token')

//         // send refresh token to get new access token
//         const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

//         if (refreshResult?.data) {

//             // store the new token
//             api.dispatch(setCredentials({ ...refreshResult.data }))

//             // retry original query with new access token
//             result = await baseQuery(args, api, extraOptions)
//         } else {

//             if (refreshResult?.error?.status === 403) {
//                 refreshResult.error.data.message = "Your login has expired."
//             }
//             return refreshResult
//         }
//     }

//     return result
// }

// export const apiSlice = createApi({
//     baseQuery: baseQueryWithReauth,
//     tagTypes: ['Note', 'User'],
//     endpoints: builder => ({})
// })
