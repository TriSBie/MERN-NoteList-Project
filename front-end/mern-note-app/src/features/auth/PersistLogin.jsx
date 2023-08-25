import React, { useEffect, useRef, useState } from 'react'
import usePersist from '../hooks/usePersist';
import { Link, Outlet } from 'react-router-dom';
import { useRefreshMutation } from './authApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './authSlice';

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effecRan = useRef(false); //use to prevent change state after rendering

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isSuccess,
        isLoading,
        isError,
        isUninitialized, // indicates the refresh trigger function has not been called yet
        error
    }] = useRefreshMutation()
    useEffect(() => {
        if (effecRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                try {
                    console.log("Verifying refresh token")
                    const response = await refresh().unwrap(); //return data\
                    setTrueSuccess(true) //isSuccess - or setTrueSuccess
                } catch (err) {
                    console.log({ ...err })
                }
            }

            //If user re-signin into web browser with trust option -> without sending jwt to cookies
            // look up the 'persist' key and refresh page

            if (!token && persist) {
                verifyRefreshToken()
            }
            //active new jwt token and can being logged in
        }
        return () => {
            effecRan.current = true;
        }
    }, [])
    let content;
    if (!persist) {
        console.log('no persist');
        content = <Outlet />
    } else if (isLoading) {
        content = <p>Loading...</p>
    } else if (isError) { //persist : yes, token : no
        content = (
            <p className='errmsg'>
                {`${error?.data?.message} - `}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) {//isSuccess may litle bit late
        console.log('success')
        content = <Outlet />
    } else if (persist && isUninitialized) { //success but it haven't handled yet
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }
    return content
}
export default PersistLogin