import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Connexion from './pages/Connexion'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Inscription from './pages/Inscription'
import DashBoard from './pages/DashBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element ={<Connexion />}/>
        <Route path='/login' element ={<Connexion />}/>
        <Route path='/signup' element ={<Inscription/>} />
        <Route path='/dashboard' element ={<DashBoard />} />
      </Routes>
    </Router>
  )
}

export default App
