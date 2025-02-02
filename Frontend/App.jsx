import  Login_page  from './Login_Page/Login_page'
import { Dash } from './Admin/Dashboard'
import {Dep} from './Admin/Departments' 
import { Routes,Route} from 'react-router'
import './App.css'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Login_page/>}/>
      <Route path='/dashboard' element={<Dash/>}/>
      <Route path='/departments' element={<Dep/>}/>
    </Routes>
    </>
  )
}

export default App
