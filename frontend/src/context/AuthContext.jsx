import { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Set token in axios headers
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      authService.setAuthToken(token)
      fetchUser()
    } else {
      localStorage.removeItem('token')
      authService.setAuthToken(null)
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await authService.getMe()
      setUser(response.data.user)
    } catch (error) {
      console.error('Error fetching user:', error)
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      setToken(response.data.token)
      setUser(response.data.user)
      toast.success('Login successful!')
      return response
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password)
      setToken(response.data.token)
      setUser(response.data.user)
      toast.success('Registration successful!')
      return response
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
  }

  const updateUser = (userData) => {
    setUser({ ...user, ...userData })
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
