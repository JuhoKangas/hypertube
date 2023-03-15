import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'

const LanguageButton = ({ children }) => {
  const { changeLanguage } = useContext(LanguageContext)

  const handleLanguageButton = (e) => {
    changeLanguage(e.target.innerHTML)
  }

  return (
    <div
      className="m-2 rounded-lg border border-red-900 p-1 cursor-pointer"
      onClick={handleLanguageButton}
    >
      {children}
    </div>
  )
}

export default LanguageButton
