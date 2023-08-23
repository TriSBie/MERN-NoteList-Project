import { apiSlice } from "../../app/apiSlice";
import { logOut } from "./authSlice";


//injectedEnpoint from apiSlice
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth',
                method: 'POST',
                body: {
                    ...credentials
                }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            // onQueryStarted is useful for optimistic updates
            // The 2nd parameter is the destructured `MutationLifecycleApi`
            async onQueryStarted(arg, {
                dispatch, queryFulfilled
            }) {
                try {
                    await queryFulfilled //return a data => destructing to get more infomation
                    dispatch(logOut()) //call action to reducers - payload will be null
                    dispatch(apiSlice.util.resetApiState())
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            })
        })
    })
})

export const {
    useLoginMutation,
    useRefreshMutation,
    useSendLogoutMutation
} = authApiSlice
//mutation return a tuple. First item in the tuple is the "trigger", second element contains an object (status, error, data)
