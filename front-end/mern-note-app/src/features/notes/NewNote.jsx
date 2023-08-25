import { useSelector } from 'react-redux'
import NewNoteForm from './NewNoteForm'
import { selectAllUsers } from '../users/userApiSlice'
import { selectAllNotes } from './noteApiSlice'
import { useGetUsersQuery } from '../users/userApiSlice'
const NewNote = () => {
    //get all users
    const users = useSelector(selectAllUsers)//return an array - check an array is empty or not
    const { data, isError, isLoading, isSuccess } = useGetUsersQuery()
    if (isError) {
        return <p>Not Available User</p>
    }
    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    }
    if (isSuccess) {
        content = <NewNoteForm users={users} />
    }
    return content
}
export default NewNote