import { createContext, useContext, useState } from 'react'

export const UserContext = createContext({
  loggedUser: {},
  changeLoggedUser: () => {},
})

export function UserProvider({ children }) {
  const [loggedUser, setLoggedUser] = useState({})

  return (
    <UserContext.Provider
      value={{
        loggedUser,
        changeLoggedUser: (newUser) => setLoggedUser(newUser),
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useLoggedUser = () => useContext(UserContext)
