import React from 'react'
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useAuth from '../features/hooks/useAuth'
const DashFooter = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation();
    console.log(pathname) //return a pathname URL

    const { username, status } = useAuth();
    const onGoHome = () => {
        navigate('/dash') //navigate to Dash Home Page
    }

    let goHomeButton = null //global scope
    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className='dash-footer__button'
                title='Go Home'
                onClick={onGoHome}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button >
        )
    }
    const content = (<footer className='dash-footer'>
        {goHomeButton}
        <p>Current User: {username} </p>
        <p>Status: {status}</p>
    </footer>)
    return content
}

export default DashFooter