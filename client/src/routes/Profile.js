import React, { useEffect, useState } from 'react'
import userServices from '../services/users'
import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'
import { useNavigate } from 'react-router-dom'
import { useLoggedUser } from '../context/UserContext'

const UserProfile = ({ selectedUser }) => {
  const [userData, setUserData] = useState({})
  const { language } = useMyLanguage()
  const dictionary = translate(language)

	const navigate = useNavigate()
	const { loggedUser } = useLoggedUser()

	useEffect(() => {
	if (!loggedUser.token) {
		navigate('/')
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

  useEffect(() => {
    const getUserData = async (selectedUser) => {
      const foundUserData = await userServices.getUserData(selectedUser)
      setUserData(foundUserData.data)
    }
    getUserData(selectedUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser])

  return (
    <div className='bg-hyper-black flex flex-col h-screen p-20 font-montserrat'>
      <div className='flex flex-col items-center justify-center'>
        {userData.profilePicture ? (
          <img
            src={`http://localhost:3001/uploads/${userData.profilePicture}`}
            className='object-cover rounded-full h-60 w-60 border border-white mb-10'
            alt='profile-pic'
          ></img>
        ) : (
          <></>
        )}
        <div className='flex mb-3 w-auto'>
          <p className='text-dark-red md:text-3xl text-2xl'>
            {userData.username}
          </p>
        </div>
        <div className='mb-3 flex text-xl mt-10 flex-col'>
          <div className='text-dark-red flex w-80 pl-12'>
            {dictionary.name}
            <div className='text-white pl-5'>
              {userData.firstname} {userData.lastname}
            </div>
          </div>
          <div className='mb-3 flex text-xl mt-10 flex-col'>
            <div className='text-dark-red flex pl-12 md:w-auto w-5/6'>
              {dictionary.movies_watched}
              <div className='text-white pl-5 flex items-center'>
                {userData.moviesWatched}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
