import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import confetti from 'canvas-confetti'
import { CheckCircle2, X, Zap, FileText } from 'lucide-react'
import { useMediaQuery } from '../hooks/useMediaQuery'

/* ───────── Plan data ───────── */

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  name: string
  subtitle: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  vehicles: string
  features: PlanFeature[]
  cta: string
  highlight: boolean
  badge: string | null
}

const plans: Plan[] = [
  {
    name: 'Free',
    subtitle: 'O "Test Drive"',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Para quem quer começar a organizar',
    vehicles: '1 veículo',
    features: [
      { text: 'Registro básico de manutenções', included: true },
      { text: 'Histórico de abastecimento', included: true },
      { text: 'Cálculo de consumo médio', included: true },
      { text: 'Lembretes básicos por e-mail', included: true },
      { text: 'Upload de Notas Fiscais', included: false },
      { text: 'Exportação PDF', included: false },
      { text: 'Gráficos de gastos', included: false },
      { text: 'Previsão de manutenção IA', included: false },
    ],
    cta: 'Começar Grátis',
    highlight: false,
    badge: null,
  },
  {
    name: 'Premium',
    subtitle: 'O "Dono Cuidadoso"',
    monthlyPrice: 19.9,
    yearlyPrice: 15.9,
    description: 'Para entusiastas e profissionais',
    vehicles: 'Até 3 veículos',
    features: [
      { text: 'Tudo do plano Free', included: true },
      { text: 'Upload de Notas Fiscais (ilimitado)', included: true },
      { text: 'Exportação PDF profissional', included: true },
      { text: 'Gráficos e dashboards detalhados', included: true },
      { text: 'Previsão de manutenção com IA', included: true },
      { text: 'Sem anúncios', included: true },
      { text: 'Múltiplos perfis', included: false },
      { text: 'Suporte prioritário', included: false },
    ],
    cta: 'Assinar Premium',
    highlight: true,
    badge: 'Mais Popular',
  },
  {
    name: 'Family',
    subtitle: 'A "Garagem Compartilhada"',
    monthlyPrice: 39.9,
    yearlyPrice: 31.9,
    description: 'Para famílias e colecionadores',
    vehicles: 'Até 10 veículos',
    features: [
      { text: 'Tudo do plano Premium', included: true },
      { text: 'Múltiplos perfis compartilhados', included: true },
      { text: 'Gestão de condutores', included: true },
      { text: 'Suporte prioritário', included: true },
      { text: 'Relatórios por condutor', included: true },
      { text: 'Notificações personalizadas', included: true },
      { text: 'API de integração', included: false },
      { text: 'Gestão de documentação', included: false },
    ],
    cta: 'Assinar Family',
    highlight: false,
    badge: null,
  },
  {
    name: 'Business',
    subtitle: 'Frotas Leves',
    monthlyPrice: 99.9,
    yearlyPrice: 79.9,
    description: 'Para MEIs e pequenas empresas',
    vehicles: 'Veículos ilimitados',
    features: [
      { text: 'Tudo do plano Family', included: true },
      { text: 'Veículos ilimitados', included: true },
      { text: 'Gestão de documentação (CNH, seguros)', included: true },
      { text: 'Relatórios de custo por KM', included: true },
      { text: 'API de integração', included: true },
      { text: 'Múltiplos usuários', included: true },
      { text: 'Suporte dedicado', included: true },
      { text: 'SLA garantido', included: true },
    ],
    cta: 'Falar com Vendas',
    highlight: false,
    badge: 'Empresarial',
  },
]

/* ───────── Component ───────── */

export default function PricingSection() {
  const navigate = useNavigate()
  const [isYearly, setIsYearly] = useState(false)
  const toggleRef = useRef<HTMLLabelElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const handleToggle = () => {
    const next = !isYearly
    setIsYearly(next)

    if (next && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect()
      confetti({
        particleCount: 60,
        spread: 50,
        startVelocity: 20,
        gravity: 0.8,
        scalar: 0.8,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      })
    }
  }

  return (
    <>
      {/* Toggle Mensal / Anual */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span
          className={`text-sm font-semibold transition-colors ${!isYearly ? 'text-base-content' : 'text-base-content/50'}`}
        >
          Mensal
        </span>

        <label ref={toggleRef} className="swap swap-rotate">
          <input
            type="checkbox"
            checked={isYearly}
            onChange={handleToggle}
            className="toggle toggle-primary toggle-md"
          />
        </label>

        <span
          className={`text-sm font-semibold transition-colors ${isYearly ? 'text-base-content' : 'text-base-content/50'}`}
        >
          Anual{' '}
          <span className="text-primary text-xs font-bold">(Economize 20%)</span>
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
          const isFree = plan.monthlyPrice === 0

          const CardWrapper = isDesktop ? motion.div : 'div'

          const motionProps = isDesktop
            ? {
                initial: { opacity: 0, y: 30 },
                whileInView: plan.highlight
                  ? { opacity: 1, y: -16, scale: 1.03 }
                  : { opacity: 1, y: 0 },
                viewport: { once: true, margin: '-40px' },
                transition: {
                  type: 'spring' as const,
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.1,
                },
              }
            : {}

          return (
            <CardWrapper
              key={plan.name}
              {...motionProps}
              className={`relative rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-primary/10 to-base-100 border-2 border-primary shadow-xl shadow-primary/10'
                  : 'bg-base-100 border border-base-300/50 hover:border-primary/20 hover:shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <div
                    className={`px-4 py-1 rounded-full text-xs font-bold shadow-lg ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-primary to-secondary text-primary-content shadow-primary/30'
                        : 'bg-base-content/90 text-base-100'
                    }`}
                  >
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-6 flex flex-col h-full">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-base-content/60 mb-4">{plan.subtitle}</p>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    {isFree ? (
                      <span className="text-4xl font-black">Grátis</span>
                    ) : (
                      <>
                        <span className="text-4xl font-black">
                          <NumberFlow
                            value={price}
                            locales="pt-BR"
                            format={{
                              style: 'currency',
                              currency: 'BRL',
                              minimumFractionDigits: 2,
                            }}
                          />
                        </span>
                        <span className="text-base font-normal text-base-content/50">
                          /mês
                        </span>
                      </>
                    )}
                  </div>

                  {!isFree && isYearly && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge badge-primary badge-sm font-bold">-20%</span>
                      <span className="text-xs text-base-content/50 line-through">
                        R$ {plan.monthlyPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-base-content/60 mt-1">{plan.description}</p>
                </div>

                <div className="divider my-2" />

                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-primary">
                  <Zap size={16} />
                  <span>{plan.vehicles}</span>
                </div>

                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5">
                      {f.included ? (
                        <CheckCircle2 size={17} className="text-success shrink-0 mt-0.5" />
                      ) : (
                        <X size={17} className="text-base-content/25 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          f.included ? 'text-sm' : 'text-sm text-base-content/35 line-through'
                        }
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/login')}
                  className={`btn w-full transition-all duration-200 ${
                    plan.highlight
                      ? 'btn-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
                      : 'btn-outline btn-primary hover:shadow-lg'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </CardWrapper>
          )
        })}
      </div>

      {/* Revenda Avulso */}
      <div className="max-w-4xl mx-auto mt-14">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-primary/20 p-6 sm:p-8">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="text-primary" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg">Plano de Revenda Avulso</h3>
              <p className="text-sm text-base-content/70 mt-1">
                Não quer assinar? Gere um relatório completo do histórico do veículo por
                apenas <strong className="text-primary">R$ 29,90</strong> para valorizar na
                venda!
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary btn-sm shadow-lg shadow-primary/20 shrink-0"
            >
              Saber Mais
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
