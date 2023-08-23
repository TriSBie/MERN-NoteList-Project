import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const DASH_REGX = /^\/dash(\/)?$/
const NOTES_REGX = /^\/dash\/notes(\/)?$/
const USERS_REGX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
    const navigate = useNavigate();
    const { pathName } = useLocation();

    const [sendLogout, {
        isError,
        isSuccess,
        isLoading,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) {
            navigate("/"); //return back to homePage
        }
    }, [isSuccess, navigate]);


    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error: {error?.data?.message}</p>

    let dashClass = null

    if (!DASH_REGX.test(pathName) && !NOTES_REGX.test(pathName) && !USERS_REGX.test(pathName)) {
        dashClass = "dash-header__container--small"
    };

    const logoutButton = (
        <button
            className='icon-button'
            title='logout'
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const content = (
        <header className="dash-header">
            <div className={`dash-header__container ${dashClass}`}>
                <Link to="/dash">
                    <h1 className="dash-header__title">techNotes</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/* add more buttons later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )

    return content
}

export default DashHeader