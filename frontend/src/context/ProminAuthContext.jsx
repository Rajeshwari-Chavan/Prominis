import { createContext, useContext, useReducer, useEffect } from 'react'
import { prominApi } from '../api/prominApi'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

export const ProminAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('prominis_token')
    if (token) {
      // Verify token with backend
      verifyToken(token)
    } else {
      dispatch({ type: 'LOGOUT' })
    }
  }, [])

  const verifyToken = async (token) => {
    try {
      const response = await prominApi.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: token,
        },
      })
    } catch (error) {
      localStorage.removeItem('prominis_token')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' })
    
    try {
      const response = await prominApi.post('/auth/login', {
        email,
        password,
      })

      const { user, token } = response.data
      
      localStorage.setItem('prominis_token', token)
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      })

      toast.success(`Welcome back, ${user.firstName}!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' })
    
    try {
      const response = await prominApi.post('/auth/register', userData)
      
      const { user, token } = response.data
      
      localStorage.setItem('prominis_token', token)
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      })

      toast.success(`Welcome to Prominis, ${user.firstName}!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('prominis_token')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  const demoLogin = async (role) => {
    const demoCredentials = {
      REQUESTER: { email: 'requester@promin.com', password: 'requester123' },
      TASKER: { email: 'tasker@promin.com', password: 'tasker123' },
      ADMIN: { email: 'admin@promin.com', password: 'admin123' },
    }

    const credentials = demoCredentials[role]
    if (!credentials) {
      toast.error('Invalid demo role')
      return { success: false }
    }

    return await login(credentials.email, credentials.password)
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    demoLogin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a ProminAuthProvider')
  }
  return context
}

