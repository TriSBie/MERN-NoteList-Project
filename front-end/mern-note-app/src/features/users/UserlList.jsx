import User from './User';
import { useGetUsersQuery } from './userApiSlice'
// get Hook from apiSlice getting data, isFetching, isSuccess,...

import React from 'react'

const UserlList = () => {
    const {
        data: users, //return {ids with entities}
        isSuccess,
        isLoading,
        isError,
        error
    } = useGetUsersQuery('userList', {
        pollingInterval: 60000, //60 sseconds
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    let content;

    if (isLoading) {
        content = <p>Loading...</p>
    }

    if (isError) {
        content =
            <p className="errmsg">
                {error?.data?.message}
            </p>
    }

    if (isSuccess) {
        const { ids } = users;
        const tableContent = ids?.length
            ? ids.map(userId => <User key={userId} userId={userId} />
            ) : null
        content = (
            <table className="table table--users">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th user__username">Username</th>
                        <th scope="col" className="table__th user__roles">Roles</th>
                        <th scope="col" className="table__th user__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }
    return (
        content
    )
}

export default UserlList