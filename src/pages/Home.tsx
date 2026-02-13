import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Zap,
  Bell,
  BarChart3,
  Upload,
  FileText,
  Share2,
  Shield,
  ArrowRight,
  Sparkles,
  Car,
  Wrench,
  TrendingUp,
  ChevronDown,
  Star,
} from 'lucide-react'
import PricingSection from '../components/PricingSection'

/* ───────── Hooks ───────── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    const els = ref.current?.querySelectorAll('.reveal')
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return ref
}

/* ───────── Animated counter ───────── */

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          setStarted(true)
          obs.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const inc = end / steps
    let cur = 0
    const t = setInterval(() => {
      cur += inc
      if (cur >= end) {
        setCount(end)
        clearInterval(t)
      } else {
        setCount(Math.floor(cur))
      }
    }, duration / steps)
    return () => clearInterval(t)
  }, [started, end])

  return (
    <span ref={ref}>
      {count.toLocaleString('pt-BR')}
      {suffix}
    </span>
  )
}

/* ───────── Data ───────── */

const features = [
  {
    icon: <Bell size={24} />,
    title: 'Lembretes Inteligentes',
    description: 'Nunca mais esqueça de fazer a manutenção do seu veículo',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Dashboards Completos',
    description: 'Visualize todos os seus gastos e histórico em gráficos',
  },
  {
    icon: <Upload size={24} />,
    title: 'Armazenamento em Nuvem',
    description: 'Guarde todas as notas fiscais e comprovantes com segurança',
  },
  {
    icon: <FileText size={24} />,
    title: 'Relatórios Profissionais',
    description: 'Gere PDFs completos para valorizar na revenda',
  },
  {
    icon: <Share2 size={24} />,
    title: 'Compartilhamento',
    description: 'Gerencie veículos em família ou equipe',
  },
  {
    icon: <Shield size={24} />,
    title: 'Segurança Total',
    description: 'Seus dados protegidos com criptografia de ponta',
  },
]

const steps = [
  {
    icon: <Car size={28} />,
    num: '01',
    title: 'Cadastre seu veículo',
    desc: 'Adicione as informações do seu carro em poucos minutos',
  },
  {
    icon: <Wrench size={28} />,
    num: '02',
    title: 'Registre tudo',
    desc: 'Manutenções, abastecimentos, despesas e documentos',
  },
  {
    icon: <TrendingUp size={28} />,
    num: '03',
    title: 'Valorize na revenda',
    desc: 'Gere relatórios profissionais e comprove o histórico',
  },
]

const testimonials = [
  {
    name: 'Carlos M.',
    role: 'Entusiasta automotivo',
    text: 'Vendi meu carro por 15% a mais do que a tabela FIPE graças ao relatório completo do CarStory.',
    stars: 5,
  },
  {
    name: 'Ana P.',
    role: 'Mãe de família',
    text: 'Gerencio os 3 carros da família num só lugar. Os lembretes de manutenção são incríveis!',
    stars: 5,
  },
  {
    name: 'Roberto S.',
    role: 'MEI — Entregas',
    text: 'O controle de custo por km me ajudou a precificar melhor os meus fretes. Recomendo!',
    stars: 5,
  },
]

/* ───────── Component ───────── */

export default function Home() {
  const navigate = useNavigate()
  const pageRef = useScrollReveal()
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* ── Navbar ─────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navSolid
            ? 'bg-base-100/80 backdrop-blur-xl border-b border-base-300/50 shadow-lg shadow-black/5'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CarStory
            </span>

            <div className="hidden md:flex items-center gap-8">
              <a href="#recursos" className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors">
                Recursos
              </a>
              <a href="#como-funciona" className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors">
                Como Funciona
              </a>
              <a href="#planos" className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors">
                Planos
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors px-4 py-2"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Começar grátis
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden min-h-[92vh] flex items-center">
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] lp-float" />
          <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[120px] lp-float-slow" />
          <div className="absolute -bottom-20 right-1/4 w-[350px] h-[350px] rounded-full bg-accent/8 blur-[120px] lp-float-alt" />
        </div>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="hero-enter hero-enter-d1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm">
              <Sparkles size={16} className="text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Controle total do seu veículo</span>
            </div>

            {/* Heading */}
            <h1 className="hero-enter hero-enter-d2 text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.1]">
              Histórico completo,
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent lp-gradient-text bg-[length:200%_auto]">
                revenda valorizada
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-enter hero-enter-d3 text-lg sm:text-xl text-base-content/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Registre manutenções, controle despesas e gere relatórios profissionais.
              Valorize seu veículo na revenda com histórico completo e organizado.
            </p>

            {/* CTA */}
            <div className="hero-enter hero-enter-d4 flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-lg gap-2 shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              >
                Começar grátis agora
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#planos" className="btn btn-ghost btn-lg gap-2 hover:bg-base-content/5">
                Ver planos
                <ChevronDown size={18} />
              </a>
            </div>

            {/* Stats */}
            <div className="hero-enter hero-enter-d5 grid grid-cols-3 gap-6 sm:gap-12 max-w-2xl mx-auto pt-10 border-t border-base-content/10">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-primary mb-1">
                  <Counter end={5200} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-base-content/50 font-medium">Usuários ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-secondary mb-1">
                  <Counter end={12800} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-base-content/50 font-medium">Veículos cadastrados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-accent mb-1">
                  <Counter end={48000} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-base-content/50 font-medium">Manutenções registradas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section id="recursos" className="py-24 relative">
        <div className="absolute inset-0 bg-base-200/40 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold mb-4 uppercase tracking-wider">
              Recursos
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Tudo que você precisa</h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Ferramentas profissionais para controle total do seu veículo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className={`reveal stagger-${i + 1} group p-6 rounded-2xl bg-base-100 border border-base-300/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 lp-shimmer-overlay`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                    {feat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
                    <p className="text-sm text-base-content/60 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────── */}
      <section id="como-funciona" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4 uppercase tracking-wider">
              Simples e rápido
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Como funciona</h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Três passos simples para ter controle total
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />

            {steps.map((step, i) => (
              <div key={i} className={`reveal stagger-${i + 1} text-center relative`}>
                <div className="relative inline-flex items-center justify-center w-[104px] h-[104px] rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/15 mb-6 mx-auto group">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-primary relative">{step.icon}</div>
                  <span className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-base-content/60 text-sm max-w-[260px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-base-200/40 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4 uppercase tracking-wider">
              Depoimentos
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">O que nossos usuários dizem</h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Milhares de motoristas já confiam no CarStory
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`reveal stagger-${i + 1} p-6 rounded-2xl bg-base-100 border border-base-300/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={16} className="fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-base-content/80 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-base-content/50">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────── */}
      <section id="planos" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold mb-4 uppercase tracking-wider">
              Planos
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Escolha seu Plano</h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Do casual ao profissional, temos o plano ideal para você
            </p>
          </div>

          <PricingSection />
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl lp-float" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl lp-float-slow" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="reveal max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-primary-content">
              Pronto para organizar seus veículos?
            </h2>
            <p className="text-xl mb-10 text-primary-content/80">
              Junte-se a milhares de motoristas que já economizam tempo e dinheiro
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 gap-2 shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Zap size={20} />
              Começar Agora — É Grátis
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer id="sobre" className="bg-base-200 border-t border-base-300/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CarStory
              </span>
              <p className="text-sm text-base-content/50 mt-3 leading-relaxed max-w-[240px]">
                Gestão inteligente de veículos para valorizar seu patrimônio.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-base-content/40">Produto</h4>
              <ul className="space-y-2.5 text-sm text-base-content/60">
                <li><a href="#recursos" className="hover:text-primary transition-colors">Recursos</a></li>
                <li><a href="#planos" className="hover:text-primary transition-colors">Planos</a></li>
                <li><a onClick={() => navigate('/login')} className="hover:text-primary transition-colors cursor-pointer">Começar</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-base-content/40">Empresa</h4>
              <ul className="space-y-2.5 text-sm text-base-content/60">
                <li><a href="#sobre" className="hover:text-primary transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-base-content/40">Legal</h4>
              <ul className="space-y-2.5 text-sm text-base-content/60">
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-base-300/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-base-content/40">
              © 2026 CarStory. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-base-content/40 hover:text-primary transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-base-content/40 hover:text-primary transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-base-content/40 hover:text-primary transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
