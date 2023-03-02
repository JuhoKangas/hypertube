import { useContext } from 'react'
import { LanguageContext } from '../LanguageContext'

const LanguageButton = ({ children }) => {
  const { changeLanguage: whateverLanguage } = useContext(LanguageContext)

  const handleLanguageButton = (e) => {
    console.log(e.target.innerHTML)
    whateverLanguage(e.target.innerHTML)
  }

  return (
    <button
      className="m-2 rounded-lg border border-red-900 p-1"
      onClick={handleLanguageButton}
    >
      {children}
    </button>
  )
}

export default LanguageButton
