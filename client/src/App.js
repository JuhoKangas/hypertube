import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Landing from './routes/Landing'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path={'/'} element={<Landing />}></Route>
        </Routes>
      </Router>
      <h1 className='text-xl'>Let's fucking go</h1>
    </div>
  )
}

export default App
