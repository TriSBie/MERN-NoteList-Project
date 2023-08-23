import { useSelector } from 'react-redux'
import NewNoteForm from './NewNoteForm'
import { selectAllUsers } from '../users/userApiSlice'
const NewNote = () => {
    //get all users
    const users = useSelector(selectAllUsers)//return an array - check an array is empty or not
    console.log({ users })
    if (!users.length) {
        return <p>Not Available User</p>
    }

    const content = <NewNoteForm users={users} />

    return content
}
export default NewNote