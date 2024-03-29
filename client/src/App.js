import React from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { Routes, Route, useMatch, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Landing from './routes/Landing'
import Movies from './routes/Movies'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ResetPassword from './routes/ResetPassword'
import MoviePage from './routes/MoviePage'
import { useLoggedUser, UserProvider } from './context/UserContext'
import Settings from './routes/Settings'
import Profile from './routes/Profile'

const App = () => {
  const match = useMatch('/movies/:id')
  const movieId = match ? match.params.id : ''

  const matchProfile = useMatch('/:id')
  const selectedUser = matchProfile ? matchProfile.params.id : ''

	const {loggedUser} = useLoggedUser()

  return (
    <div className='min-h-screen flex flex-col bg-hyper-black font-montserrat'>
      <LanguageProvider>
        <UserProvider>
          <Navbar />
          <Toaster position='top-center' reverseOrder={false} />
          <Routes>
            <Route path='/movies/:id' element={<MoviePage id={movieId} />} />
            <Route path={'/movies'} element={<Movies />} />
            <Route path={'/settings'} element={<Settings />}></Route>
            <Route
              path={'/:id'}
              element={<Profile selectedUser={selectedUser} />}
            ></Route>
            <Route path={'/'} element={loggedUser.token ? <Navigate to='/movies' /> : <Landing />}></Route>
            <Route path={'/login'} element={loggedUser.token ? <Navigate to='/movies' /> : <Login />}></Route>
            <Route path={'/signup'} element={loggedUser.token ? <Navigate to='/movies' />  : <Signup />}></Route>
            <Route path={'/reset_password'} element={loggedUser.token ? <Navigate to='/movies' /> : <ResetPassword />}></Route>
            <Route path='*' element={<Navigate replace to='/' />} />
          </Routes>
          <Footer />
        </UserProvider>
      </LanguageProvider>
    </div>
  )
}

export default App
