import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './routes/Landing'
import Movies from './routes/Movies'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path={'/'} element={<Landing />}></Route>
          <Route path={'/movies'} element={<Movies />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
