import React from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { Routes, Route, useMatch } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Landing from './routes/Landing'
import Movies from './routes/Movies'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ResetPassword from './routes/ResetPassword'
import MoviePage from './routes/MoviePage'
import { UserProvider } from './context/UserContext'
import Settings from './routes/Settings'
import Profile from './routes/Profile'

const App = () => {
  const match = useMatch('/movies/:id')
  const movieId = match ? match.params.id : ''

  const matchProfile = useMatch('/:username')
  const selectedUser = matchProfile ? matchProfile.params.username : ''

  return (
    <div>
      <LanguageProvider>
        <UserProvider>
          <Navbar />
          <Toaster position='top-center' reverseOrder={false} />
          <Routes>
            <Route path='/movies/:id' element={<MoviePage id={movieId} />} />
            <Route path={'/'} element={<Landing />}></Route>
            <Route path={'/movies'} element={<Movies />} />
            <Route path={'/login'} element={<Login />}></Route>
            <Route path={'/signup'} element={<Signup />}></Route>
            <Route path={'/reset_password'} element={<ResetPassword />}></Route>
            <Route path={'/settings'} element={<Settings />}></Route>
            <Route
              path={'/'}
              element={<Profile />}
            ></Route>
          </Routes>
          <Footer />
        </UserProvider>
      </LanguageProvider>
    </div>
  )
}

export default App
