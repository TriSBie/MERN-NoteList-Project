import { useEffect, useState } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./userApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"



const USER_REGEX = /^[A-z0-9]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EditUserForm = ({ user }) => {
    const navigate = useNavigate()
    const [userUpdate, {
        isError,
        isSuccess,
        isLoading,
        error
    }] = useUpdateUserMutation()


    const [userDelete, {
        isError: isDelError,
        isSuccess: isDelSuccess,
        isLoading: isDelLoading,
        error: delerror //contains data.message
    }] = useDeleteUserMutation()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false) //* check format-length of  username
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false) //* check format-length of password
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)
    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = (e) => {
        const values = Array.from(e.target.selectedOptions,
            (option) => option.value)
        setRoles(values);

    }

    const onActiveChanged = () => {
        setActive(!active)
    }

    //Handling async - await function
    const onSaveUserClicked = async () => {
        if (password) {
            await userUpdate({ id: user.id, username, password, roles, active })
        } else {
            await userUpdate({ id: user.id, username, password: user.password, roles, active })
        }
    }

    const onDeleteUserClicked = async () => {
        await userDelete({ id: user.id })
    }

    let canSave;
    //check if user filled in password - roles has must filled in
    if (password) {
        canSave = [roles.length, validPassword, validUsername].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    console.log(canSave)
    //NOTES : How to check wheter any selection are selected or not -> using Array.length

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    //get Option
    const options = Object.values(ROLES).map(role => {
        return (
            <option key={role} value={role}>{role}</option>
        )
    })
    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
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
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>

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

export default EditUserForm