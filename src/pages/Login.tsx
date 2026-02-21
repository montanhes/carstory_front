import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password, remember)
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Erro ao fazer login:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-base-content mb-2">CarStory</h1>
          <p className="text-base-content/70 text-sm md:text-base">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-4 sm:p-6 md:p-8 space-y-4 md:space-y-6">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs md:text-sm">E-mail</span>
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="input input-bordered input-sm md:input-md w-full"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs md:text-sm">Senha</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered input-sm md:input-md w-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2 py-1">
              <input
                type="checkbox"
                className="checkbox checkbox-xs md:checkbox-sm"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="label-text text-xs md:text-sm">Lembrar de mim</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-sm md:btn-md w-full mt-2"
          >
            {loading ? <span className="loading loading-spinner loading-xs md:loading-sm"></span> : 'Entrar'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="link link-hover text-base-content/70 text-xs md:text-sm">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}
