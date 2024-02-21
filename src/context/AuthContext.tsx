import { getCurrentUser } from '@/lib/appwrite/api'
import { IContextType } from '@/types'
import { createContext, useContext, useEffect, useState } from 'react'
// hook
import { useNavigate } from 'react-router-dom'
export const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: ''
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // hook
  const navigate = useNavigate()

  const checkAuthUser = async () => {
    // try {
    //   const { $id, name, username, email, imageUrl, bio } =
    //     await getCurrentUser()

    //   // as we don't have currentUser variable, we directly use id to do the judge
    //   if ($id) {
    //     setUser({
    //       id: $id,
    //       name: name,
    //       username: username,
    //       email: email,
    //       imageUrl: imageUrl,
    //       bio: bio
    //     })
    //   }
    // }
    try {
      const currentAccount = await getCurrentUser()
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio
        })
        setIsAuthenticated(true)
        return true
      }
      // if outside the block
      return false
    } catch (err) {
      console.log(err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // back the user to login-in page
  useEffect(() => {
    // localStorage.getItem('cookieFallback') === null
    if (localStorage.getItem('cookieFallback') === '[]')
      // hook
      navigate('/sign-in')
    // check user auth
    checkAuthUser()
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext)
