import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { authService, planService, type UserPlan } from '../services/api'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  plan: UserPlan | null
  hasPlan: boolean
  loading: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  initiateGoogleAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [plan, setPlan] = useState<UserPlan | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const userData = await authService.me()
      setUser(userData)
      try {
        const planData = await planService.getUserPlan()
        setPlan(planData)
      } catch {
        setPlan(null)
      }
    } catch {
      setUser(null)
      setPlan(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string, remember: boolean = false) => {
    await authService.login(email, password, remember)
    await checkAuth()
  }

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    await authService.register(name, email, password, passwordConfirmation)
    await checkAuth()
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setPlan(null)
  }

  const initiateGoogleAuth = async () => {
    const { url } = await authService.googleRedirect()
    window.location.href = url
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const hasPlan = plan?.subscription?.is_active === true

  return (
    <AuthContext.Provider value={{ user, plan, hasPlan, loading, login, register, logout, checkAuth, initiateGoogleAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
