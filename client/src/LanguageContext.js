import { createContext, useContext, useState } from 'react'

export const LanguageContext = createContext({
  language: 'en',
  changeLanguage: () => {},
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage: (newLang) => setLanguage(newLang),
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
export const useMyLanguage = () => useContext(LanguageContext)
