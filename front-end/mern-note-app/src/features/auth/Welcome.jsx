import React from 'react'
import { Link } from 'react-router-dom'
const Welcome = () => {
    const date = new Date()

    //INTERNATIONAL FORMAT
    const today = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full', timeStyle: 'long'
    }).format(date)

    const content = (
        <section className='welcome'>

            <p>{today}</p>

            <h1>Welcome !</h1>

            <Link to="/dash/notes">View NoteList</Link>
            <Link to="/dash/notes/new">Add New techNote</Link>
            <Link to="/dash/users">View UserList</Link>
            <Link to="/dash/users/new">Add New User</Link>
        </section>
    )
    return (
        content
    )
}

export default Welcome