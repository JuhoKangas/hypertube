import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import userService from '../services/users'
import { isImage } from '../utils/checkFile'
import { useLoggedUser } from '../context/UserContext'
import LanguageOptions from '../components/LanguageOptions'
import { translate } from '../dictionaries/translate'
import { useMyLanguage } from '../context/LanguageContext'

const Settings = () => {
  const { loggedUser, changeLoggedUser } = useLoggedUser()
  const { language, changeLanguage } = useMyLanguage()
  const dictionary = translate(language)
  const navigate = useNavigate()
  const initialFirstname = useField('text', loggedUser.firstname)
  const initialLastname = useField('text', loggedUser.lastname)
  const initialUsername = useField('text', loggedUser.username)
  const initialEmail = useField('email', loggedUser.email)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [file, setFile] = useState('')
  const [dbPhotoFile, setDbPhotoFile] = useState(loggedUser.profilePicture)
  const [formImage, setFormImage] = useState('')
  const [pictureChanged, setPictureChanged] = useState(false)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
  })

	useEffect(() => {
		if (!loggedUser.token) {
			navigate('/')
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

  const handlePhotoChange = async (e) => {
    if (await isImage(e.target.files[0])) {
      setFile(URL.createObjectURL(e.target.files[0]))
      setDbPhotoFile(e.target.files[0].name)
      setFormImage(e.target.files[0])
      setPictureChanged(true)
    } else {
      setFile(loggedUser.profilePicture)
      setFormImage(loggedUser.profilePicture)
      setDbPhotoFile(loggedUser.profilePicture)
      toast.error(dictionary.e_photo_format)
    }
  }

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
      errors.username = dictionary.e_username_add
    } else if (formData.username.length > 60) {
      errors.username = dictionary.e_username_length
    } else {
      const findUserByUsername = await userService.getUserByUsername(
        formData.username
      )
      if (
        findUserByUsername.data.user.rowCount > 0 &&
        loggedUser.username !== formData.username
      ) {
        errors.username = dictionary.e_username_taken
      }
    }

    if (formData.password) {
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
        errors.password = dictionary.e_password_requirements
      }
    }

    if (!formData.email) {
      errors.email = dictionary.e_email_add
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      errors.email = dictionary.e_email_proper
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

  const handleUpdate = async (e) => {
    e.preventDefault()

    const updatedUserInfo = {
      id: loggedUser.user_id,
      firstname: initialFirstname.value,
      lastname: initialLastname.value,
      username: initialUsername.value,
      email: initialEmail.value,
      password: formData.password,
      language: language,
      profilePicture: dbPhotoFile,
    }

    if (updatedUserInfo.password !== confirmPassword) {
      toast.error(dictionary.e_password_match)
      return
    }

    const errors = await validateForm(updatedUserInfo)

    if (errors !== {}) {
      for (const error in errors) {
        toast.error(errors[error])
        return
      }
    }

    if (pictureChanged) {
      const uploadPhotoData = new FormData()
      uploadPhotoData.append('profile', formImage)

      const res = await userService.uploadPhoto(uploadPhotoData)

      if (res.data.error) {
        toast.error(res.data.error)
        return
      }
      const response = await userService.update({
        ...updatedUserInfo,
        profilePicture: res.data.filename,
      })
      const updatedUser = response.data.data.user
      localStorage.setItem('loggedUser', JSON.stringify(updatedUser))
      changeLoggedUser(updatedUser)
      changeLanguage(updatedUser.language)
      toast.success(dictionary.update_success)
    } else {
      const response = await userService.update(updatedUserInfo)
      const updatedUser = response.data.data.user
      localStorage.setItem('loggedUser', JSON.stringify(updatedUser))
      changeLoggedUser(updatedUser)
      changeLanguage(updatedUser.language)
      toast.success(dictionary.update_success)
    }
    navigate('/movies')
  }

  return (
    <div className='md:h-full flex flex-col bg-hyper-black'>
      <div>
        <h1 className='text-center  font-bold leading-tight text-white text-4xl mt-20 mb-10'>
          {dictionary.update_h} {/* add to dictionary */}
        </h1>
      </div>
      <div className='flex justify-center'>
        <form
          onSubmit={handleUpdate}
          className=' bg-hyper-black shadow-sm rounded px-10 pt-10 pb-8'
        >
          <div className='mb-4'>
            <div className='mb-4'>
              <label
                className=' font-medium mb-2 text-white'
                htmlFor='username'
              >
                {dictionary.username}
              </label>
              <input
                type='text'
                id='username'
                name='username'
                placeholder='Joel'
                className='p-2 mt-1 mb-10  w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.username}
                onChange={handleChange}
                {...initialUsername}
              />
            </div>
            <div className='mb-4'>
              <label
                className=' font-medium mb-2 text-white'
                htmlFor='email'
              >
                {dictionary.email}
              </label>
              <input
                type='email'
                id='email'
                name='email'
                placeholder='pedro.pascal@hotttdaddy.com'
                className='p-2 mt-1 mb-10  w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.email}
                onChange={handleChange}
                {...initialEmail}
              />
            </div>
            <div className='mb-4'>
              <label
                className='  font-medium mb-2 text-white'
                htmlFor='password'
              >
                {dictionary.password}
              </label>
              <input
                type='password'
                name='password'
                placeholder='******************'
                className='p-2 mt-1 mb-10  w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className='mb-4'>
              <label
                className='  font-medium mb-2 text-white'
                htmlFor='password'
              >
                {dictionary.password_repeat}
              </label>
              <input
                type='password'
                id='password-check'
                name='password-check'
                placeholder='******************'
                className='p-2 mt-1 mb-10  w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className='mb-4'>
              <label
                className='  font-medium mb-2 text-white'
                htmlFor='firstname'
              >
                {dictionary.firstname}
              </label>
              <input
                type='text'
                id='first-name'
                name='firstname'
                placeholder='Pedro'
                className='p-2 mt-1 mb-10  w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.firstname}
                onChange={handleChange}
                {...initialFirstname}
              />
            </div>

            <div className='mb-4'>
              <label
                className='  font-medium mb-2 text-white'
                htmlFor='lastname'
              >
                {dictionary.lastname}
              </label>
              <input
                type='text'
                id='last-name'
                name='lastname'
                placeholder='Pascal'
                className='p-2 mt-1 mb-10  w-full h-10 rounded-md border-gray-300 shadow-sm focus:outline-none text-gray-700 focus:border-dark-red focus:ring focus:ring-dark-red focus:ring-opacity-20'
                value={formData.lastname}
                onChange={handleChange}
                {...initialLastname}
              />
            </div>
            <div className='mb-4'>
              <label
                className=' font-medium mb-2 text-white'
                htmlFor='language'
              >
                {dictionary.preferred_lang}
              </label>
              <div className='flex'>
                <LanguageOptions></LanguageOptions>
              </div>
            </div>
            <div className='flex flex-col'>
              <label
                className='  font-medium mb-2 text-white'
                htmlFor='profilepicture'
              >
                {dictionary.profile_picture}
              </label>
              <div className='flex flex-col items-center justify-center gap-12 md:mb-0 mb-10 mt-10'>
                {file ? (
                  <img
                    className='object-cover rounded-full h-60 w-60'
                    src={file}
                    alt=''
                  />
                ) : (
                  <img
                    className='object-cover rounded-full h-60 w-60'
                    src={loggedUser.token ? `http://localhost:3001/uploads/${loggedUser.profilePicture}` : ''}
                    alt=''
                  />
                )}
                <input
                  accept='image/*'
                  type='file'
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <input
              className='text-white bg-dark-red py-3 px-5 mt-5 mb-10 rounded focus:outline-none focus:shadow-outline  font-semibold text-2xl cursor-pointer'
              type='submit'
              value={dictionary.submit_btn}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings
