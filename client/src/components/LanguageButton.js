import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'

const LanguageButton = ({ children }) => {
  const { changeLanguage } = useContext(LanguageContext)

  const handleLanguageButton = (e) => {
    changeLanguage(e.target.innerHTML)
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
