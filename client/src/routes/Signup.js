import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import LanguageOptions from '../components/LanguageOptions'
import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'
import emailService from '../services/email'
import userService from '../services/users'

const Signup = () => {
  const { language } = useMyLanguage()
  const dictionary = translate(language)

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
      errors.firstname = dictionary.e_firstname_add
    } else if (formData.firstname.length > 1000) {
      errors.firstname = dictionary.e_firstname_length
    }

    if (!formData.lastname) {
      errors.lastname = dictionary.e_lastname_add
    } else if (formData.lastname.length > 1000) {
      errors.lastname = dictionary.e_lastname_length
    }

    if (!formData.username) {
      errors.username = dictionary.e_lastname_add
    } else if (formData.username.length > 60) {
      errors.username = dictionary.e_username_length
    } else {
      const findUserByUsername = await userService.getUserByUsername(
        formData.username
      )
      if (findUserByUsername.data.user.rowCount > 0) {
        errors.username = dictionary.e_username_taken
      }
    }

    if (!formData.password) {
      errors.password = dictionary.e_password_add
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)
    ) {
      errors.password = dictionary.e_password_requirements
    }

    if (!formData.email) {
      errors.email = dictionary.e_email_add
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      errors.email = dictionary.e_email_proper
    } else {
      const userExists = await emailService.getUserByEmail(formData.email)
      if (userExists.userFound) {
        errors.email = dictionary.e_email_taken
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
      toast.error(dictionary.e_password_match)
      return
    }

    const errors = await validateForm(formData)
    console.log(errors)

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

    await userService.create(newUser)

    setRegistrationLinkSent(true)
  }

  if (registrationLinkSent) {
    return (
      <div className='flex flex-col gap-5 justify-center items-center h-screen bg-hyper-black'>
        <p className='text-xl text-gray-500'>{'<img />'}</p>
        <h1 className='text-3xl text-white'>{dictionary.m_link_sent}</h1>
        <p className='text-l text-gray-500'>{dictionary.m_signup_email}</p>
      </div>
    )
  }

  return (
    <div className='md:h-screen h-full flex flex-col bg-hyper-black'>
      <LanguageOptions></LanguageOptions>
      <div>
        <h1 className='text-center font-montserrat font-bold leading-tight text-white text-4xl mt-20 mb-10'>
          {dictionary.m_create_account}
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
                {dictionary.username}
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
                {dictionary.email}
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
                {dictionary.password}
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
                {dictionary.password_repeat}
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
                htmlFor='firstname'
              >
                {dictionary.firstname}
              </label>
              <input
                type='text'
                id='first-name'
                name='firstname'
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
                htmlFor='lastname'
              >
                {dictionary.lastname}
              </label>
              <input
                type='text'
                id='last-name'
                name='lastname'
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
              value={dictionary.signUp}
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
          {dictionary.m_already_account}
        </Link>
      </div>
    </div>
  )
}

export default Signup
