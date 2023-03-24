import React from 'react'
import { useNavigate } from 'react-router-dom'
import LanguageOptions from '../components/LanguageOptions'
import { useMyLanguage } from '../context/LanguageContext'
import { translate } from '../dictionaries/translate'

const Landing = () => {
  const navigate = useNavigate()
  const { language } = useMyLanguage()
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
      <p className='text-white text-center font-thin mt-16 p-5 text-5xl'>
        {dictionary.m_landing}
      </p>
      <div className='flex flex-row justify-center md:gap-36 gap-3 mt-40'>
        <div>
          <button
            className='w-32 h-16 bg-dark-red font-bold text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline border border-hyper-black md:border-none'
            onClick={navigateLogin}
          >
            {dictionary.logIn}
          </button>
        </div>
        <div className='md:bg-white after:block after:w-[1px] after:h-10 after:mx-auto after:my-2'></div>
        <div>
          <button
            className='w-32 h-16 bg-dark-red font-bold text-white py-2 px-auto rounded focus:outline-none focus:shadow-outline border border-hyper-black md:border-none'
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
