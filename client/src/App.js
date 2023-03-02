import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './routes/Landing'
import Movies from './routes/Movies'
import Login from './routes/Login'
import Signup from './routes/Signup'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path={'/'} element={<Landing />}></Route>
          <Route path={'/movies'} element={<Movies />} />
          <Route path={'/login'} element={<Login />}></Route>
          <Route path={'/signup'} element={<Signup />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
