import React from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useMyLanguage } from '../context/LanguageContext'
import { useLoggedUser } from '../context/UserContext'
import userService from '../services/users'
import { checkUser } from '../utils/checkUser'
import { translate } from '../dictionaries/translate'
import LanguageOptions from '../components/LanguageOptions'

const Login = () => {
  const navigate = useNavigate()
  const { changeLoggedUser } = useLoggedUser()
  const { language, changeLanguage } = useMyLanguage()
  const dictionary = translate(language)

  const login = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    if (await checkUser(username, password)) {
      const res = await userService.loginUser(username, password)
      const user = res.data
      changeLoggedUser(user)
      //check login worked?
      changeLanguage(user.language)
      navigate('/movies')
    } else {
      toast.error('Username or password was incorrect')
    }
  }
  return (
    <div className='md:h-screen h-full flex flex-col bg-hyper-black'>
      <LanguageOptions></LanguageOptions>
      <div>
        <h1 className='text-center font-montserrat font-bold leading-tight text-white text-4xl mt-20 mb-20'>
          {dictionary.m_login_account}
        </h1>
      </div>

      <div className='flex justify-center'>
        <form
          onSubmit={login}
          className='bg-hyper-black shadow-sm rounded-md px-10 pt-10 mb-4'
        >
          <div className='mb-4'>
            <label
              className='text-white font-montserrat font-medium mb-2'
              htmlFor='username'
            >
              {dictionary.username}
            </label>
            <input
              type='text'
              name='username'
              id='username'
              placeholder='Username'
              className='p-2 mt-1 mb-10 font-montserrat w-full h-10 rounded-md shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
              required
            />
          </div>

          <div className='mb-6'>
            <label
              className='text-white font-montserrat font-medium mb-2'
              htmlFor='password'
            >
              {dictionary.password}
            </label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='******************'
              className='p-2 mt-1 font-montserrat w-full h-10 rounded-md shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
              required
            />
          </div>

          <div className='flex items-center justify-center mb-5'>
            <input
              className='text-white bg-dark-red py-3 px-5 mt-10 mb-5 rounded focus:outline-none focus:shadow-outline font-montserrat font-semibold text-2xl cursor-pointer'
              type='submit'
              value='Login'
            />
          </div>
          <hr />
          <div className='flex items-center justify-center mt-5 mb-5'>
            {/* TODO: Create a path for forgot password */}
            <Link
              className='text-white inline-block align-baseline font-bold text-sm text-chitty-chitty hover:text-light-red font-montserrat'
              to='/reset_password'
            >
              {dictionary.m_password_forgot}
            </Link>
          </div>
          <hr />
          <div className='flex items-center justify-center mt-5'>
            <a
              className='text-white inline-block align-baseline font-bold text-sm text-chitty-chitty hover:text-light-red font-montserrat'
              href='/signup'
            >
              {dictionary.m_create_account_join}
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
