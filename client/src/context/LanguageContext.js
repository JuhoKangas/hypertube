import { createContext, useContext, useState } from 'react'

const loggedUserJSON = localStorage.getItem('loggedUser')
const user = loggedUserJSON ? JSON.parse(loggedUserJSON) : {}

let defaultLanguage = 'en'
if (user.language?.length > 0) {
  defaultLanguage = user.language
}
export const LanguageContext = createContext({
  language: defaultLanguage,
  changeLanguage: () => {},
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(defaultLanguage)

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage: (newLanguage) => setLanguage(newLanguage),
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
export const useMyLanguage = () => useContext(LanguageContext)
