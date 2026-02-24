import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { planService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

type Status = 'processing' | 'confirmed' | 'timeout'

const POLL_INTERVAL = 3000
const POLL_TIMEOUT = 30000

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()
  const [status, setStatus] = useState<Status>('processing')
  const [planName, setPlanName] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef(Date.now())

  useEffect(() => {
    startRef.current = Date.now()

    const poll = async () => {
      try {
        const plan = await planService.getUserPlan()
        if (plan.subscription?.is_active) {
          setPlanName(plan.current_plan.name)
          setStatus('confirmed')
          await checkAuth()
          if (timerRef.current) clearInterval(timerRef.current)
          return
        }
      } catch {
        // continua tentando
      }

      if (Date.now() - startRef.current >= POLL_TIMEOUT) {
        setStatus('timeout')
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }

    // Primeira verificação imediata
    poll()
    timerRef.current = setInterval(poll, POLL_INTERVAL)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [checkAuth])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-4">
        {status === 'processing' && (
          <>
            <div className="flex justify-center mb-6">
              <Clock size={64} className="text-warning animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Confirmando seu pagamento...</h1>
            <p className="text-base-content/60 mb-6">
              Estamos verificando seu pagamento. Isso pode levar alguns segundos.
            </p>
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </>
        )}

        {status === 'confirmed' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="animate-bounce">
                <CheckCircle2 size={80} className="text-success drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Pagamento Confirmado!</h1>
            <p className="text-base-content/60 mb-2">
              Seu plano <strong className="text-primary">{planName}</strong> foi ativado com sucesso.
            </p>
            <p className="text-base-content/40 text-sm mb-8">
              Aproveite todos os recursos do seu novo plano.
            </p>
            <button
              onClick={() => navigate('/dashboard', { replace: true })}
              className="btn btn-primary btn-md md:btn-lg shadow-xl shadow-primary/25"
            >
              Ir para o Dashboard
            </button>
          </>
        )}

        {status === 'timeout' && (
          <>
            <div className="flex justify-center mb-6">
              <AlertTriangle size={64} className="text-warning" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Pagamento em Processamento</h1>
            <p className="text-base-content/60 mb-2">
              Seu pagamento ainda está sendo processado.
            </p>
            <p className="text-base-content/40 text-sm mb-8">
              Assim que a confirmação for recebida, seu plano será ativado automaticamente. Você pode verificar o status no seu perfil.
            </p>
            <button
              onClick={() => navigate('/dashboard', { replace: true })}
              className="btn btn-outline btn-primary btn-md md:btn-lg"
            >
              Voltar ao Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  )
}
