import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { selectNoteById, useGetNotesQuery } from './noteApiSlice';
import { selectAllUsers, useGetUsersQuery } from '../users/userApiSlice';
import EditNoteForm from './EditNoteForm';
import useAuth from '../hooks/useAuth';

const EditNote = () => {
    const { id } = useParams();

    const { username, isAdmin, isManager } = useAuth();

    const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids?.map(id => data?.entities[id])
        }),
    })

    console.log({ note }, { users })
    const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>
    return (
        content
    )
}

export default EditNote