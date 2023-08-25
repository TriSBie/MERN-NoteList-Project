import Note from "./Note";
import { useGetNotesQuery } from "./noteApiSlice"
import useAuth from "../hooks/useAuth";

const NoteList = () => {
    const {
        data: notes,
        isLoading,
        isError,
        isSuccess,
        error
    } = useGetNotesQuery('noteList', {
        pollingInterval: 15000, //requering after 15 seconds
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const { username, isAdmin, isManager } = useAuth()

    let content;
    if (isLoading) {
        content = <p>Loading....</p>
    }
    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }
    if (isSuccess) {
        const { ids, entities } = notes;
        //ids return unique array id
        //entities : return object with ids key and value 
        //spread all available ids with role ADMIN or Manager
        let filteredID;
        if (isManager || isAdmin) {
            filteredID = [...ids]; //spread it to an array
        } else {
            filteredID = ids.filter(id => entities[id].username === username);
        }
        const tableContent = ids?.length && filteredID.map(noteId =>
            <Note key={filteredID} noteId={filteredID} />)
        content = (
            <table className="table table--notes">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th note__status">Username</th>
                        <th scope="col" className="table__th note__created">Created</th>
                        <th scope="col" className="table__th note__updated">Updated</th>
                        <th scope="col" className="table__th note__title">Title</th>
                        <th scope="col" className="table__th note__username">Owner</th>
                        <th scope="col" className="table__th note__edit">Edit</th>
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

export default NoteList