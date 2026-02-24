import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requirePlan?: boolean
}

export default function ProtectedRoute({ children, requirePlan = true }: ProtectedRouteProps) {
  const { user, hasPlan, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requirePlan && !hasPlan) {
    return <Navigate to="/onboarding/plan" replace />
  }

  return <>{children}</>
}
