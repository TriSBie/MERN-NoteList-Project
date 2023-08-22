import React from 'react'
import { useParams } from 'react-router-dom'
import { selectUserById, useUpdateUserMutation } from './userApiSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import EditUserForm from './EditUserForm'

//path :id -> navigate to EditUser
const EditUser = () => {
    //catch the id params 
    const { id } = useParams();

    const user = useSelector(state => selectUserById(state, id))

    const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>
    return (
        content
    )
}

export default EditUser