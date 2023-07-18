import { useRouter } from 'next/router'
import { useState, useEffect, createContext } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', {})
  const [loggedInUserName, setLoggedInUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const loggedInUserData = JSON.parse(localStorage.getItem('loggedInUserData'))
    if (loggedInUserData && loggedInUserData.username) {
      setLoggedInUserName(loggedInUserData.username)
    }
    if (loggedInUserData) {
      const { token, isAdmin } = loggedInUserData
      console.log({ token, isAdmin })
      Cookies.set('isAdmin', isAdmin)
      Cookies.set('token', token)
    }
  }, [setLoggedInUserName])

  const handleSignOut = () => {
    setUser({})
    setLoggedInUserName('')
    localStorage.removeItem('loggedInUserData')
    Cookies.remove('token')
    Cookies.remove('isAdmin')
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        loggedInUserName,
        setLoggedInUserName,
        user,
        setUser,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
