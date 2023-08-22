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


//A function that generates a set of prebuilt reducers and selectors for performing CRUD operations - is a Plan Object
//create entity adapter include selectId and sortComparer 
//also contain a getSelectors() function that returns a set of selectors
const noteAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : (a.completed) ? 1 : -1
})

const initialState = noteAdapter.getInitialState() //return entity state object like {ids :[], entities : []}

export const noteApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //define the pre-built hooked
        getNotes: builder.query({
            query: () => '/notes',
            validateStatus: (response, result) => response.status === 200 && !result.isError,
            // keepUnusedDataFor: 5,  - not recommneded ( since it doesn't have any subcription)
            transformResponse: responseData => { // api return an arrays
                const loaddedNote = responseData.map(note => {
                    note.id = note._id
                    return note
                })
                //CRUD Functions - same as setMany, but its override.
                return noteAdapter.setAll(initialState, loaddedNote)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    //spread syntax allows an iterable, such as an array or string
                    return [{ type: 'Note', id: 'LIST' }, ...result.ids.map(id => ({
                        type: 'Note', id
                    }))]
                } else return [{
                    type: 'Note',
                    id: 'LIST'
                }]
            }
        }),
        addNewNote: builder.mutation({
            query: initialNote => ({
                url: '/notes',
                method: 'POST',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: [
                { type: 'Note', id: "LIST" }
            ]
        }),
        updateNote: builder.mutation({
            query: initialNote => ({
                url: '/notes',
                method: 'PATCH',
                body: {
                    ...initialNote,
                }
            }),

            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id }
            ]
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: `/notes`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id }
            ]
        }),
    }),
})


//get Hook function
export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useDeleteNoteMutation,
    useUpdateNoteMutation
} = noteApiSlice


// return the query result object
export const selectNotesResult = noteApiSlice.endpoints.getNotes.select();


// creates memoized selector
const selectNotesData = createSelector(
    selectNotesResult,
    notesReducer => notesReducer.data // normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases using destructing
export const {
    selectAll: selectAllNotes,
    selectIds: selectNoteById,
    selectById: selectNoteIds

    //Pass in selector that returns the notes slice of state
} = noteAdapter.getSelectors(state => selectNotesData(state) ?? initialState)


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