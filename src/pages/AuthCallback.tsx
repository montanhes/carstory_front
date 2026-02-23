import { useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallback() {
  const { user, hasPlan, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const success = searchParams.get('success')
  const error = searchParams.get('error')

  useEffect(() => {
    if (loading) return
    if (error || success !== 'true') return

    if (!user) return

    if (hasPlan) {
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/onboarding/plan', { replace: true })
    }
  }, [loading, user, hasPlan, error, success, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70 text-sm">Autenticando com Google...</p>
        </div>
      </div>
    )
  }

  if (error || success !== 'true') {
    const errorMessage = error === 'cancelled'
      ? 'A autenticação foi cancelada.'
      : 'Não foi possível autenticar com o Google. Tente novamente.'

    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-error text-2xl font-bold">✕</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Falha na autenticação</h2>
          <p className="text-base-content/60 text-sm mb-6">{errorMessage}</p>
          <Link to="/login" className="btn btn-primary w-full">
            Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/70 text-sm">Redirecionando...</p>
      </div>
    </div>
  )
}
