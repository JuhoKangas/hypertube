import React from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Landing from './routes/Landing'
import Movies from './routes/Movies'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Home from './routes/Home'
import Footer from './components/Footer'
import ResetPassword from './routes/ResetPassword'

const App = () => {
  return (
    <div>
      <LanguageProvider>
        <Toaster position='top-center' reverseOrder={false} />
        <Routes>
          <Route path={'/'} element={<Landing />}></Route>
          <Route path={'/movies'} element={<Movies />} />
          <Route path={'/login'} element={<Login />}></Route>
          <Route path={'/signup'} element={<Signup />}></Route>
          <Route path={'/reset_password'} element={<ResetPassword />}></Route>
        </Routes>
        <Footer />
      </LanguageProvider>
    </div>
  )
}

export default App
