import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import emailService from '../services/email'
import { toast } from 'react-hot-toast'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const resetToken = searchParams.get('token')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [validToken, setValidToken] = useState(false)
  const [userId, setUserId] = useState(0)
  const [newPasswordAgain, setNewPasswordAgain] = useState('')

  useEffect(() => {
    const validateToken = async () => {
      if (resetToken) {
        const user = await emailService.checkToken(resetToken)
        if (user.error) {
          toast.error(user.error)
        } else {
          setValidToken(true)
          setUserId(user.tokenFound.rows[0].id)
        }
      }
    }
    validateToken()
  }, [resetToken])

  const validatePassword = (password) => {
    if (!password) {
      return 'Please enter a password'
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return 'Password has to be at least 8 characters and contain letters and numbers'
    } else if (password !== newPasswordAgain) {
      return "Passwords don't match"
    } else {
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const user = await emailService.checkEmail(email)
    if (user.error) {
      toast.error(user.error)
    } else {
      toast.success(
        `Hello ${user.userFound.rows[0].username}! Please check your email`
      )
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    const errors = validatePassword(newPassword)

    if (!errors) {
      const response = await emailService.resetPassword(
        newPassword,
        userId,
        resetToken
      )
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.success(`Congrats! ${response.msg}`)
      }
    } else {
      toast.error(errors)
    }
  }

  if (validToken) {
    return (
      <div className='bg-hyper-black flex flex-col gap-5 justify-center items-center h-screen'>
        <p className='text-xl text-gray-500'>{'<Succezione! />'}</p>
        <h1 className='text-3xl text-white'>Time to change the password!</h1>
        <p className='text-l text-gray-500'>Type in your new password!</p>
        <form onSubmit={handlePasswordSubmit} className='flex flex-col'>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type='password'
            placeholder='New Password'
            className='p-2 mt-1 font-montserrat w-full h-10 rounded-md shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
            required
          />
          <input
            value={newPasswordAgain}
            onChange={(e) => setNewPasswordAgain(e.target.value)}
            type='password'
            placeholder='New Password again'
            className='p-2 mt-1 font-montserrat w-full h-10 rounded-md shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
            required
          />
          <input
            className='text-white bg-dark-red py-3 px-5 mt-10 mb-5 rounded focus:outline-none focus:shadow-outline font-montserrat font-semibold text-2xl cursor-pointer'
            type='submit'
            value='Reset Password'
          />
        </form>
        <Link
          to='/login'
          className='text-white inline-block align-baseline font-bold text-sm text-chitty-chitty hover:text-light-red font-montserrat'
        >
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className='bg-hyper-black flex flex-col gap-5 justify-center items-center h-screen'>
      <p className='text-xl text-gray-500'>{'<Attenzione />'}</p>
      <h1 className='text-3xl text-white'>So you forgot your password?</h1>
      <p className='text-l text-gray-500'>
        Please give us your email and we'll get it sorted out
      </p>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type='email'
          placeholder='Email'
          className='p-2 mt-1 font-montserrat w-full h-10 rounded-md shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
          required
        />
        <input
          className='text-white bg-dark-red py-3 px-5 mt-10 mb-5 rounded focus:outline-none focus:shadow-outline font-montserrat font-semibold text-2xl cursor-pointer'
          type='submit'
          value='Reset Password'
        />
      </form>
      <hr />
      <Link
        to='/login'
        className='text-white inline-block align-baseline font-bold text-sm text-chitty-chitty hover:text-light-red font-montserrat'
      >
        Back to login
      </Link>
    </div>
  )
}

export default ResetPassword
