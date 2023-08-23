import React, { useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { useLoginMutation } from "./authApiSlice"
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
const Login = () => {
    const userRef = React.useRef(null);
    //useRef return a ref object - lets you reference a value that's not needed for rendering
    //return an object with single property - (current)
    const errRef = React.useRef(null);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');

    const [login, {
        isLoading
    }] = useLoginMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const errClass = errMsg ? "errmsg" : "offscreen";

    useEffect(() => {
        //focus on username field when initial rendering occurs.
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('') //clear out error when process username, password input
    }, [username, password])

    const handlePwdInput = (e) => setPassword(e.target.value);
    const handleUserInput = (e) => setUsername(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ username, password }).unwrap() //return a promise with an unwrap property. Must provide the raw response, error
            //unwrap will resolve the value of the fulfilled action, or throw on a rejected action
            console.log(accessToken)
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate("/dash") //show welcome
            //since using fetchBaseQuery with unWrap() -> return fulfilled or rejected action - using error Handling
        } catch (err) {
            //error causes when backend-side process with unexpected results (Wrong path, not authorized, missing params);
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password - Bad Request !')
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err?.data?.message);
            }
            errRef.current.focus();
        }
    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    const content = (
        <section className="public">
            <header>
                <h1>Employee Login</h1>
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <form className="form" onSubmit={handleSubmit} style={{
                    margin: "0 auto"
                }}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePwdInput}
                        value={password}
                        required
                    />
                    <button className="form__submit-button">Sign In</button>
                </form>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )
    return (
        content
    )
}

export default Login