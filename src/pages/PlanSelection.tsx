import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Zap, ArrowRight } from 'lucide-react'
import { planService, type PlanTypeOption } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const PLAN_FEATURES: Record<number, string[]> = {
  1: [
    '1 veículo',
    'Registro de manutenções',
    'Histórico de abastecimento',
    'Cálculo de consumo médio',
    'Lembretes básicos por e-mail',
  ],
  2: [
    'Até 3 veículos',
    'Tudo do Básico',
    'Upload de Notas Fiscais',
    'Exportação PDF profissional',
    'Gráficos e dashboards detalhados',
    'Previsão de manutenção com IA',
  ],
  3: [
    'Até 10 veículos',
    'Tudo do Premium',
    'Múltiplos perfis compartilhados',
    'Gestão de condutores',
    'Relatórios por condutor',
    'Suporte prioritário',
  ],
  4: [
    'Veículos ilimitados',
    'Tudo do Família',
    'API de integração',
    'Múltiplos usuários',
    'Gestão de documentação',
    'Suporte dedicado e SLA',
  ],
}

const PLAN_HIGHLIGHT: Record<number, boolean> = {
  1: false,
  2: true,
  3: false,
  4: false,
}

export default function PlanSelection() {
  const { checkAuth, user } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState<PlanTypeOption[]>([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [isYearly, setIsYearly] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    planService.getPlanTypes()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any)?.data ?? []
        setPlans(list)
      })
      .catch(() => setFetchError('Não foi possível carregar os planos. Tente recarregar a página.'))
      .finally(() => setFetchLoading(false))
  }, [])

  const handleConfirm = async () => {
    if (!selectedPlan) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await planService.assignPlan(selectedPlan)
      await checkAuth()
      navigate('/dashboard', { replace: true })
    } catch {
      setSubmitError('Erro ao ativar o plano. Tente novamente.')
      setSubmitting(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  const selectedPlanData = plans.find((p) => p.value === selectedPlan)

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-base-300/50 bg-base-100/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CarStory
          </span>
          {user && (
            <span className="text-sm text-base-content/50">
              Olá, {user.name?.split(' ')[0]}
            </span>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
            <Zap size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Quase lá! Só mais um passo</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Escolha seu plano</h1>
          <p className="text-base-content/60 text-lg max-w-xl mx-auto">
            Selecione o plano ideal para você. Cancele quando quiser, sem compromisso.
          </p>
        </div>

        {/* Toggle mensal/anual */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm font-semibold transition-colors ${!isYearly ? 'text-base-content' : 'text-base-content/50'}`}>
            Mensal
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-md"
            checked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
          />
          <span className={`text-sm font-semibold transition-colors ${isYearly ? 'text-base-content' : 'text-base-content/50'}`}>
            Anual{' '}
            <span className="text-primary text-xs font-bold">(Economize 20%)</span>
          </span>
        </div>

        {/* Erro de fetch */}
        {fetchError && (
          <div className="alert alert-error max-w-xl mx-auto mb-8">
            <span>{fetchError}</span>
          </div>
        )}

        {/* Cards de plano */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const monthlyPrice = plan.monthly_price
            const yearlyPrice = monthlyPrice * 0.8
            const price = isYearly ? yearlyPrice : monthlyPrice
            const isSelected = selectedPlan === plan.value
            const isHighlighted = PLAN_HIGHLIGHT[plan.value] ?? false
            const features = PLAN_FEATURES[plan.value] ?? []
            const vehicleLabel =
              plan.vehicle_limit <= 0
                ? 'Veículos ilimitados'
                : plan.vehicle_limit === 1
                ? '1 veículo'
                : `Até ${plan.vehicle_limit} veículos`

            return (
              <div
                key={plan.value}
                onClick={() => setSelectedPlan(plan.value)}
                className={`relative rounded-2xl cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-2xl shadow-primary/20 scale-[1.02] bg-base-100'
                    : isHighlighted
                    ? 'bg-gradient-to-b from-primary/10 to-base-100 border-2 border-primary/30 hover:border-primary/50 hover:shadow-lg'
                    : 'bg-base-100 border border-base-300/50 hover:border-primary/20 hover:shadow-lg'
                }`}
              >
                {/* Badge */}
                {(isSelected || isHighlighted) && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    {isSelected ? (
                      <div className="px-4 py-1 rounded-full text-xs font-bold bg-success text-success-content shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                        <CheckCircle2 size={12} />
                        Selecionado
                      </div>
                    ) : (
                      <div className="px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg whitespace-nowrap">
                        Mais Popular
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{plan.label}</h3>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-black">
                      {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-sm text-base-content/50">/mês</span>
                  </div>

                  {isYearly && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="badge badge-primary badge-sm font-bold">-20%</span>
                      <span className="text-xs text-base-content/50 line-through">
                        {monthlyPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  )}

                  <div className={`flex items-center gap-1.5 mb-4 text-sm font-semibold text-primary ${isYearly ? '' : 'mt-4'}`}>
                    <Zap size={14} />
                    <span>{vehicleLabel}</span>
                  </div>

                  <div className="divider my-3" />

                  <ul className="space-y-2.5">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 size={15} className="text-success shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Erro de submissão */}
        {submitError && (
          <div className="alert alert-error max-w-xl mx-auto mt-8">
            <span>{submitError}</span>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            onClick={handleConfirm}
            disabled={!selectedPlan || submitting}
            className="btn btn-primary btn-lg gap-2 shadow-xl shadow-primary/25 min-w-[240px] disabled:opacity-50"
          >
            {submitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                {selectedPlanData
                  ? `Assinar ${selectedPlanData.label}`
                  : 'Selecione um plano'}
                {!submitting && selectedPlan && <ArrowRight size={18} />}
              </>
            )}
          </button>
          <p className="text-xs text-base-content/40 mt-3">
            Cancele quando quiser · Sem compromisso
          </p>
        </div>
      </div>
    </div>
  )
}
