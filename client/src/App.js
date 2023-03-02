import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './routes/Landing'
import Login from './routes/Login'
import Signup from './routes/Signup'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path={'/'} element={<Landing />}></Route>
          <Route path={'/login'} element={<Login />}></Route>
          <Route path={'/signup'} element={<Signup />}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
