import {
    createEntityAdapter,
    createSelector
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/apiSlice";


//create entity adapter include (ids: [] and entities {})
/**
 * {
 * // The unique Ids of each item, must be strings or numbers
 *  ids : []
 * // A look up table mapping entity Ids to correspoding entity objects
 *  entities: {}
 * }
 */
const userAdapter = createEntityAdapter({})

//returns a new entity state objcet like {id:[], entities : {}}
const initialState = userAdapter.getInitialState()

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //define the pre-built hooked
        getUsers: builder.query({
            query: () => '/users',
            validateStatus: (response, result) => response.status === 200 && !result.isError,
            transformResponse: responseData => { // api return an arrays
                const loadedUser = responseData.map(user => {
                    user.id = user._id
                    return user
                })
                return userAdapter.setAll(initialState, loadedUser)
            },
            providesTags: (result, error, arg) => {
                //result contains result with ids
                if (result?.ids) {
                    return [{ type: 'User', id: 'LIST' }, ...result.ids.map(id => ({
                        type: 'User', id
                    }))]
                } else return [{
                    type: 'User',
                    id: 'LIST'
                }]
            }
        }),
        addNewUser: builder.mutation({
            query: (initialData) => ({ //use as parameter
                url: '/users',
                method: 'POST',
                body: {
                    ...initialData
                }
            }),
            invalidatesTags: (result, error, arg) => [{
                type: 'User',
                id: arg.id
            }]
        }),
        updateUser: builder.mutation({
            query: (initialData) => ({
                url: '/users',
                method: 'PATCH',
                body: { ...initialData }
            }),
            transformResponse: res => {
                console.log(res)
            },
            transformErrorResponse: err => {
                console.log(err)
            },
            invalidatesTags: (result, error, arg) => [{
                type: 'User',
                id: arg.id
            }]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: 'DELETE',
                body: {
                    id
                }
            }),
            invalidatesTags: (result, error, arg) => [{
                type: 'User',
                id: arg.id
            }]
        })
    })
})

//entity adapter will contain a getSelectors() function that returns a set of selectors

export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApiSlice


// return the query result object
export const selectUsersResult = userApiSlice.endpoints.getUsers.select();

// creates memoized - function selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructing
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds

    //Pass in selector that returns the users slice of state
} = userAdapter.getSelectors(state => selectUsersData(state) ?? initialState)

/**
 * NORMALIZING STATE SHAPE
 * - nested data become more complex when trying to update a deeply nested field.
 * => recommended approach to managing relational or nested data in a Redux store
 * The basic concepts of normalizing data are:
 * + Each type of data gets its own "table" in the state.
 * + Each "data table" should store the individual items in an object, with the IDs of the items as keys and the items themselves as the values.
 * + Any references to individual items should be done by storing the item's ID.
 * + Arrays of IDs should be used to indicate ordering.
 */