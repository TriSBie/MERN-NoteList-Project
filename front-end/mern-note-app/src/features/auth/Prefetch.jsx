import store from '../../app/store';
import { noteApiSlice } from '../notes/noteApiSlice';
import { userApiSlice } from '../users/userApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => { //manual subscription instead expiredTime
    useEffect(() => {
        //set-up code runs when your component is added to the page (mounts)
        console.log('subscribing')
        //then your set-up code runs with new props and state
        store.dispatch(noteApiSlice.util.prefetch('getNotes', 'notesList', { force: true }))
        store.dispatch(userApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))

        // //after every re-render of your component =>
        // return () => {
        //     //clean code runs with old odd and state
        //     console.log('unsubscribing')
        //     notes.unsubscribe()
        //     users.unsubscribe()
        // }
    }, [])
    return <Outlet />
}
export default Prefetch