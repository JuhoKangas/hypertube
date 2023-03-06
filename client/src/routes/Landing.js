import React from 'react'
import { useNavigate } from 'react-router-dom'
import LanguageOptions from '../components/LanguageOptions'
import { useMyLanguage } from '../context/LanguageContext'
import { useLoggedUser } from '../context/UserContext'
import { translate } from '../dictionaries/translate'

const Landing = () => {
  const navigate = useNavigate()
  const { language } = useMyLanguage()
  const { loggedUser } = useLoggedUser()
  console.log('LANDING loggedUser: ', loggedUser)
  const dictionary = translate(language)

  const navigateLogin = () => {
    navigate('/login')
  }

  const navigateSignup = () => {
    navigate('/signup')
  }
  return (
    <div className='flex flex-col h-screen bg-cover bg-landing-bg'>
      <LanguageOptions></LanguageOptions>
      {/* div for testing state: */}
      <div className='text-white'>
        Your language is {language}, so email is {dictionary.email}.
        <br />
        LoggedUser language is {loggedUser.language}.
      </div>
      {/* end of div for testing state */}
      <p className='text-white font-montserrat text-center font-thin mt-16 p-5 text-5xl'>
        {dictionary.m_landing}
      </p>
      <div className='flex flex-row justify-center md:gap-36 gap-3 mt-40'>
        <div>
          <button
            className='w-32 h-12 bg-dark-red font-bold text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline font-montserrat border border-hyper-black md:border-none'
            onClick={navigateLogin}
          >
            {dictionary.logIn}
          </button>
        </div>
        <div className='md:bg-white after:block after:w-[1px] after:h-10 after:mx-auto after:my-2'></div>
        <div>
          <button
            className='w-32 h-12 bg-dark-red font-bold text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline font-montserrat border border-hyper-black md:border-none'
            onClick={navigateSignup}
          >
            {dictionary.signUp}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing
