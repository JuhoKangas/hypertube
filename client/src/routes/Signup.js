import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import emailService from '../services/email'
import userService from '../services/users'

const Signup = () => {
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
  })

  const [registrationLinkSent, setRegistrationLinkSent] = useState(false)

  const validateForm = async (formData) => {
    const errors = {}

    if (!formData.firstname) {
      errors.firstname = 'Please add first name'
    } else if (formData.firstname.length > 1000) {
      errors.firstname =
        "Your first name can't realistically be over 1000 characters"
    }

    if (!formData.lastname) {
      errors.lastname = 'Please add last name'
    } else if (formData.lastname.length > 1000) {
      errors.lastname =
        "Your last name can't realistically be over 1000 characters"
    }

    if (!formData.username) {
      errors.username = 'Please add username'
    } else if (formData.username.length > 60) {
      errors.username =
        "Your username can't be over 60 characters. It's just arbitary limit that I came up with, in fact our database would handle usernames up to 1000 characters but it would probably break the styling of the page so we just gonna have it like this now."
    } else {
      const findUserByUsername = await userService.getUserByUsername(
        formData.username
      )
      if (findUserByUsername.data.user.rowCount > 0) {
        errors.username = 'Username is already taken'
      }
    }

    if (!formData.password) {
      errors.password = 'Please add password'
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)
    ) {
      errors.password =
        'Password must be at least 8 characters and contain only letters and numbers'
    }

    if (!formData.email) {
      errors.email = 'Please add your email'
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      errors.email = 'Please add proper email'
    } else {
      const userExists = await emailService.getUserByEmail(formData.email)
      if (userExists.userFound) {
        errors.email = 'Email already in use'
      }
    }

    return errors
  }

  const handleChange = (e) => {
    const value = e.target.value
    const name = e.target.name

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (formData.password !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    const errors = await validateForm(formData)

    if (errors !== {}) {
      for (const error in errors) {
        toast.error(errors[error])
        return
      }
    }

    const newUser = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      username: formData.username,
      password: formData.password,
      email: formData.email,
    }

    userService.create(newUser)

    setRegistrationLinkSent(true)
  }

  if (registrationLinkSent) {
    return (
      <div className='flex flex-col gap-5 justify-center items-center h-screen'>
        <p className='text-xl text-gray-500'>{'<img />'}</p>
        <h1 className='text-3xl text-white'>The link has been sent</h1>
        <p className='text-l text-gray-500'>
          Please follow the instructions on the email to finish setting up your
          profile
        </p>
      </div>
    )
  }

  return (
    <div className='md:h-screen h-full flex flex-col bg-hyper-black'>
      <div>
        <h1 className='text-center font-montserrat font-bold leading-tight text-white text-4xl mt-20 mb-10'>
          Create an account
        </h1>
      </div>
      <div className='flex justify-center'>
        <form
          onSubmit={handleRegister}
          className=' bg-hyper-black shadow-sm rounded px-10 pt-10 pb-8'
        >
          <div className='mb-4'>
            <div className='mb-4'>
              <label
                className='font-montserrat font-medium mb-2 text-white'
                htmlFor='username'
              >
                Username
              </label>
              <input
                type='text'
                id='username'
                name='username'
                placeholder='e.g. Joel'
                className='p-2 mt-1 mb-10 font-montserrat w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                className='font-montserrat font-medium mb-2 text-white'
                htmlFor='email'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                placeholder='e.g pedro.pascal@hotttdaddy.com'
                className='p-2 mt-1 mb-10 font-montserrat w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                className=' font-montserrat font-medium mb-2 text-white'
                htmlFor='password'
              >
                Password
              </label>
              <input
                type='password'
                name='password'
                placeholder='******************'
                className='p-2 mt-1 mb-10 font-montserrat w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className='mb-4'>
              <label
                className=' font-montserrat font-medium mb-2 text-white'
                htmlFor='password'
              >
                Repeat Password
              </label>
              <input
                type='password'
                id='password-check'
                name='password-check'
                placeholder='******************'
                className='p-2 mt-1 mb-10 font-montserrat w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className='mb-4'>
              <label
                className=' font-montserrat font-medium mb-2 text-white'
                htmlFor='firstName'
              >
                First Name
              </label>
              <input
                type='text'
                id='first-name'
                name='firstName'
                placeholder='e.g Pedro'
                className='p-2 mt-1 mb-10 font-montserrat w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>

            <div className='mb-4'>
              <label
                className=' font-montserrat font-medium mb-2 text-white'
                htmlFor='lastName'
              >
                Last Name
              </label>
              <input
                type='text'
                id='last-name'
                name='lastName'
                placeholder='e.g. Pascal'
                className='p-2 mt-1 mb-10 font-montserrat w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <input
              className='text-white bg-dark-red py-3 px-5 mt-5 mb-10 rounded focus:outline-none focus:shadow-outline font-montserrat font-semibold text-2xl cursor-pointer'
              type='submit'
              value='Register'
            />
          </div>
          <hr />
        </form>
      </div>
      <div className='flex items-center justify-center mb-5'>
        <Link
          className='text-white inline-block align-baseline font-bold text-sm text-chitty-chitty hover:text-light-red font-montserrat'
          to='/login'
        >
          Already have an account? Log in!
        </Link>
      </div>
    </div>
  )
}

export default Signup
