import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from './component/Layout'
import Public from './component/Public'
import Login from './features/auth/Login'
import DashLayout from './component/DashLayout'
import Welcome from './features/auth/Welcome'
import UserlList from './features/users/UserlList'
import NoteList from './features/notes/NoteList'
import EditNote from './features/notes/EditNote'
import EditUser from './features/users/EditUser'
import NewNoteForm from './features/notes/NewNoteForm'
import NewUserForm from './features/users/NewUserForm'
import Prefetch from './features/auth/Prefetch'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>

          <Route index element={<Public />} />

          <Route path='login' element={<Login />}></Route>

        </Route>
        <Route element={<Prefetch />}>
          <Route path='dash' element={<DashLayout />}>

            <Route index element={<Welcome />}></Route>

            <Route path='users'>
              <Route index element={<UserlList />} />
              <Route path=':id' element={<EditUser />} />
              <Route path='new' element={<NewUserForm />} />
              <Route></Route>
            </Route>

            <Route path='notes'>
              <Route index element={<NoteList />} />
              <Route path=':id' element={<EditNote />} />
              <Route path='new' element={<NewNoteForm />} />
            </Route>
          </Route>
        </Route> {/**End Dash Route*/}
      </Routes>
    </BrowserRouter>
  )
}

export default App
/**
 * EXPLAINATIONS
 * - an index put in router means are just another child of a route. 
 * - doesn't need a path, also we want the path of parent to used
 */