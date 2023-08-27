import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'
import jwtDecode from 'jwt-decode';

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let isManager = false;
    let isAdmin = false;
    let status = "Employee" //default roles

    if (token) {
        const decoded = jwtDecode(token);
        //decode from token and return an object contains data
        const { username, roles } = decoded.UserInfo; //get from the accessToken decoded

        isManager = roles?.includes('Manager');
        isAdmin = roles?.includes('Admin')

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"
        return { username, roles, status, isAdmin, isManager }
    }

    return {
        username: '', roles: [], status, isAdmin, isManager
    }

}

export default useAuth