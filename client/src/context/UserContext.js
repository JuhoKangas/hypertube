import { createContext, useContext, useState } from 'react'

const loggedUserJSON = localStorage.getItem('loggedUser')
const user = loggedUserJSON ? JSON.parse(loggedUserJSON) : {}

export const UserContext = createContext({
  loggedUser: user,
  changeLoggedUser: () => {},
})

export function UserProvider({ children }) {

  const [loggedUser, setLoggedUser] = useState(user)

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
