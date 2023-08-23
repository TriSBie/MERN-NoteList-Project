import { Outlet } from "react-router-dom";
//<Outlet> should be used in parent route elements to render their child route elements.
//This allows nested UI to show up when child routes are rendered. 

import React from 'react'

const Layout = () => {
    return (
        <>
            <Outlet />
        </>
    )
}

export default Layout