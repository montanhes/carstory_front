import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, initiateGoogleAuth, user, loading: authLoading } = useAuth()
  const [googleLoading, setGoogleLoading] = useState(false)
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
          <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-base-content mb-2">Moviu</h1>
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

          <div className="divider text-xs text-base-content/40">ou</div>

          <button
            type="button"
            disabled={googleLoading}
            onClick={async () => {
              setGoogleLoading(true)
              try { await initiateGoogleAuth() } catch { setGoogleLoading(false) }
            }}
            className="btn btn-outline w-full btn-sm md:btn-md gap-2"
          >
            {googleLoading
              ? <span className="loading loading-spinner loading-xs md:loading-sm"></span>
              : <GoogleIcon />}
            Entrar com Google
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-base-content/70 text-xs md:text-sm">
            Não tem uma conta?{' '}
            <Link to="/register" className="link link-primary font-medium">
              Criar conta
            </Link>
          </p>
          <Link to="/" className="link link-hover text-base-content/70 text-xs md:text-sm block">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}
