import React from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Landing from './routes/Landing'
import Movies from './routes/Movies'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Footer from './components/Footer'
import ResetPassword from './routes/ResetPassword'
import { UserProvider } from './context/UserContext'

const App = () => {
  return (
    <div>
      <LanguageProvider>
        <UserProvider>
          <Toaster position='top-center' reverseOrder={false} />
          <Routes>
            <Route path={'/'} element={<Landing />}></Route>
            <Route path={'/movies'} element={<Movies />} />
            <Route path={'/login'} element={<Login />}></Route>
            <Route path={'/signup'} element={<Signup />}></Route>
            <Route path={'/reset_password'} element={<ResetPassword />}></Route>
          </Routes>
          <Footer />
        </UserProvider>
      </LanguageProvider>
    </div>
  )
}

export default App
