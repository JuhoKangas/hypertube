import React from 'react'
import { useNavigate } from 'react-router-dom'
import LanguageButton from '../components/LanguageButton'
import { useMyLanguage } from '../context/LanguageContext'

const Landing = () => {
  const navigate = useNavigate()
  const { language } = useMyLanguage()

  const navigateLogin = () => {
    navigate('/login')
  }

  const navigateSignup = () => {
    navigate('/signup')
  }

  return (
    <div className="flex flex-col h-screen bg-cover bg-landing-bg">
      {/* Language testing Components/buttons div: */}
      <div className="text-white text-right font-montserrat font-thin m-2">
        <LanguageButton>en</LanguageButton>
        <LanguageButton>fi</LanguageButton>
        <LanguageButton>es</LanguageButton>
      </div>
      {/* Language testing preview div:  */}
      <div className="text-white">Your language is {language}</div>
      <p className="text-white font-montserrat text-center font-thin mt-16 p-5 text-5xl">
        WATCH THE LATEST MOVIES ON HYPERTUBE
      </p>
      <div className="flex flex-row justify-center md:gap-36 gap-3 mt-40">
        <div>
          <button
            className="w-32 h-12 bg-dark-red font-bold text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline font-montserrat border border-hyper-black md:border-none"
            onClick={navigateLogin}
          >
            Log in
          </button>
        </div>
        <div className="md:bg-white after:block after:w-[1px] after:h-10 after:mx-auto after:my-2"></div>
        <div>
          <button
            className="w-32 h-12 bg-dark-red font-bold text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline font-montserrat border border-hyper-black md:border-none"
            onClick={navigateSignup}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing
