import React from 'react'
import { Link } from 'react-router-dom'

const DashHeader = () => {
    const content = <header className='dash-header'>
        <div className='dash-header__container'>
            <Link to={'/dash/notes'}>
                <h1 className='dash-header__title'>techNotes</h1>
                <nav className='dash-header__nav'></nav>
            </Link>

        </div>
    </header>
    return (
        content
    )
}

export default DashHeader