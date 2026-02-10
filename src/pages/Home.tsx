import { useNavigate } from 'react-router-dom'
import { CheckCircle2, X, Zap, Users, FileText, Bell, BarChart3, Upload, Share2, Shield, TrendingUp, ArrowRight, Sparkles, Clock, DollarSign } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  const plans = [
    {
      name: 'Free',
      subtitle: 'O "Test Drive"',
      price: 'R$ 0',
      period: '/mês',
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
      price: 'R$ 19,90',
      period: '/mês',
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
      price: 'R$ 39,90',
      period: '/mês',
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
      price: 'R$ 99,90',
      period: '/mês',
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

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header/Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-lg border-b border-base-300/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CarStory
              </span>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#recursos" className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors">
                Recursos
              </a>
              <a href="#planos" className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors">
                Planos
              </a>
              <a href="#sobre" className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors">
                Sobre
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors px-4 py-2"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20"
              >
                Começar grátis
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Controle total do seu veículo</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Histórico completo,
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                revenda valorizada
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-base-content/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Registre manutenções, controle despesas e gere relatórios profissionais.
              Valorize seu veículo na revenda com histórico organizado.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-lg gap-2 shadow-2xl shadow-primary/30 group"
              >
                Começar grátis agora
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#planos" className="btn btn-ghost btn-lg gap-2">
                Ver planos
              </a>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-base-300/50">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">5.2K+</div>
                <div className="text-sm text-base-content/60">Usuários ativos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-1">12.8K+</div>
                <div className="text-sm text-base-content/60">Veículos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-1">48K+</div>
                <div className="text-sm text-base-content/60">Manutenções</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-24 bg-base-200/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Ferramentas profissionais para controle total do seu veículo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-base-100 border border-base-300/50 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-base-content/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Escolha seu Plano</h2>
            <p className="text-xl text-base-content/70">
              Do casual ao profissional, temos o plano ideal para você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`card bg-base-100 shadow-xl ${
                  plan.highlight
                    ? 'border-2 border-primary ring-4 ring-primary/20 scale-105'
                    : 'border border-base-300'
                } hover:shadow-2xl transition-all`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="badge badge-primary badge-lg">{plan.badge}</div>
                  </div>
                )}

                <div className="card-body">
                  <h3 className="card-title text-2xl">{plan.name}</h3>
                  <p className="text-sm text-base-content/60 mb-2">{plan.subtitle}</p>

                  <div className="my-4">
                    <div className="text-4xl font-bold">
                      {plan.price}
                      <span className="text-base font-normal text-base-content/60">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/70 mt-2">
                      {plan.description}
                    </p>
                  </div>

                  <div className="divider my-2"></div>

                  <div className="flex items-center gap-2 mb-4 text-sm font-medium text-primary">
                    <Zap size={16} />
                    <span>{plan.vehicles}</span>
                  </div>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        {feature.included ? (
                          <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
                        ) : (
                          <X size={18} className="text-base-content/30 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included
                              ? 'text-sm'
                              : 'text-sm text-base-content/40 line-through'
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate('/login')}
                    className={`btn w-full ${
                      plan.highlight ? 'btn-primary' : 'btn-outline btn-primary'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Extra Option */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="alert bg-primary/10 border-primary/30">
              <FileText className="text-primary" size={24} />
              <div className="flex-1">
                <h3 className="font-bold">Plano de Revenda Avulso</h3>
                <div className="text-sm">
                  Não quer assinar? Gere um relatório completo do histórico do veículo
                  por apenas <strong>R$ 29,90</strong> para valorizar na venda!
                </div>
              </div>
              <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm">
                Saber Mais
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para organizar seus veículos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de motoristas que já economizam tempo e dinheiro
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 gap-2"
          >
            <Zap size={20} />
            Começar Agora - É Grátis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="sobre" className="bg-base-200 border-t border-base-300/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CarStory
              </span>
              <p className="text-sm text-base-content/60 mt-3 leading-relaxed">
                Gestão inteligente de veículos para valorizar seu patrimônio.
              </p>
            </div>

            {/* Produto */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Produto</h4>
              <ul className="space-y-2 text-sm text-base-content/70">
                <li><a href="#recursos" className="hover:text-primary transition-colors">Recursos</a></li>
                <li><a href="#planos" className="hover:text-primary transition-colors">Planos</a></li>
                <li><a onClick={() => navigate('/login')} className="hover:text-primary transition-colors cursor-pointer">Começar</a></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Empresa</h4>
              <ul className="space-y-2 text-sm text-base-content/70">
                <li><a href="#sobre" className="hover:text-primary transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm text-base-content/70">
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-base-300/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-base-content/50">
              © 2026 CarStory. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-base-content/50 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-base-content/50 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-base-content/50 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
