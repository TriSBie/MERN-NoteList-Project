import React, { useEffect } from "react"
import { useAddNewUserMutation } from "./userApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"


const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/


const NewUserForm = () => {
    const navigate = useNavigate()
    // unlike the query - mutation give add new function corresponsding with mutation purpose
    const [addNewUser, {
        isError,
        isSuccess,
        isLoading,
        error
    }] = useAddNewUserMutation()


    const [username, setUsername] = React.useState('')
    const [validUsername, setValidUserName] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [validPassword, setValidPassword] = React.useState(false)
    const [roles, setRoles] = React.useState(["Employee"])


    //Check username and password
    useEffect(() => {
        setValidUserName(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    //auto clear all state when successfull 
    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            // setValidPassword(false)
            // setValidUserName(false)
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const onRolesChanged = (e) => {
        const roles = Array.from(e.target.selectedOptions,
            (option) => option.value)
        setRoles(roles)
    }

    //Array.from() static method creates a new, shallow-copied Array instance from iterable or array-like object
    const canSave = [username, password, roles].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        //since it send to server - prevent send to the server
        e.preventDefault();
        if (canSave) {
            await addNewUser({ username, password, roles })
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option key={role} value={role}>{role}</option>
        )
    })
    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span>
                </label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
                </label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
            </form>
        </>
    )
    return (
        content
    )
}

export default NewUserForm