import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
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

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, initiateGoogleAuth, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== passwordConfirmation) {
      setError('As senhas não coincidem')
      return
    }
    setLoading(true)
    setError('')
    try {
      await register(name, email, password, passwordConfirmation)
      navigate('/onboarding/plan', { replace: true })
    } catch (err: any) {
      const errors = err?.response?.data?.errors as Record<string, string[]> | undefined
      const msg: string = err?.response?.data?.message
        ?? (errors ? Object.values(errors)[0]?.[0] : null)
        ?? 'Erro ao criar conta. Tente novamente.'
      setError(msg as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">CarStory</h1>
          <p className="text-base-content/70 text-sm md:text-base">Crie sua conta gratuitamente</p>
        </div>

        <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-4 sm:p-6 md:p-8 space-y-4 md:space-y-5">
          {error && (
            <div className="alert alert-error py-2 text-sm">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs md:text-sm">Nome completo</span>
            </label>
            <input
              type="text"
              placeholder="Seu nome"
              className="input input-bordered input-sm md:input-md w-full"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Mínimo 8 caracteres"
              className="input input-bordered input-sm md:input-md w-full"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs md:text-sm">Confirmar senha</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered input-sm md:input-md w-full"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-sm md:btn-md w-full mt-2"
          >
            {loading ? <span className="loading loading-spinner loading-xs md:loading-sm"></span> : 'Criar conta'}
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
            Cadastrar com Google
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-base-content/70 text-xs md:text-sm">
            Já tem uma conta?{' '}
            <Link to="/login" className="link link-primary font-medium">
              Entrar
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
