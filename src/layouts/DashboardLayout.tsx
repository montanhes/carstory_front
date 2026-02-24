import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FileText, CircleUserRound } from 'lucide-react'
import { transferService } from '../services/api'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, logout } = useAuth()
  const [pendingTransferCount, setPendingTransferCount] = useState(0)

  useEffect(() => {
    transferService.getReceivedTransfers()
      .then((transfers) => setPendingTransferCount(transfers.length))
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', label: 'Início', end: true },
    { to: 'vehicles', label: 'Veículos', end: false },
  ]

  const reportSections = {
    essentials: [
      { to: 'reports/by-category', label: 'Por Categoria' },
      { to: 'reports/by-vehicle', label: 'Por Veículo' },
      { to: 'reports/extract', label: 'Extrato Detalhado' },
    ],
    analysis: [
      { to: 'reports/temporal-analysis', label: 'Análise Temporal' },
      { to: 'reports/fuel-analysis', label: 'Análise de Combustível' },
      { to: 'reports/vehicle-comparison', label: 'Comparação de Veículos' },
      { to: 'reports/maintenance', label: 'Manutenção' },
    ],
    advanced: [
      { to: 'reports/depreciation', label: 'Depreciação' },
      { to: 'reports/fleet-benchmark', label: 'Benchmark de Frota' },
      { to: 'reports/alerts', label: 'Alertas e Lembretes' },
      { to: 'reports/budget', label: 'Orçamento' },
    ],
  }

  const NavLink_ = ({ to, label, end }: any) => (
    <li>
      <NavLink
        to={to}
        end={end}
        onClick={() => setDrawerOpen(false)}
        className={({ isActive }) =>
          `block px-4 py-2.5 rounded-lg transition-all duration-200 ${
            isActive
              ? 'bg-primary text-primary-content font-medium'
              : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  )

  return (
    <div className="flex flex-col h-screen">
      {/* Header — largura total */}
      <header className="h-16 flex-shrink-0 bg-base-200 border-b border-base-300 flex items-center px-4 md:px-6 shadow-sm z-50 relative">
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="btn btn-ghost btn-circle lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="text-xl font-bold text-base-content ml-2 lg:ml-0">CarStory</span>

        {/* User menu — extremo direito */}
        <div className="ml-auto dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <CircleUserRound size={28} className="text-base-content/70" />
            )}
            {pendingTransferCount > 0 && (
              <span className="badge badge-error badge-xs absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] p-0 flex items-center justify-center text-[10px]">
                {pendingTransferCount}
              </span>
            )}
          </div>
          <div
            tabIndex={0}
            className="dropdown-content bg-base-200 border border-base-300 rounded-box shadow-lg z-50 w-60 p-2 mt-1"
          >
            {/* Info do usuário */}
            <div className="px-3 py-2 mb-1 border-b border-base-300">
              <p className="text-xs text-base-content/60">Olá,</p>
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-base-content/60 truncate">{user?.email}</p>
            </div>

            {/* Perfil */}
            <ul className="menu menu-sm p-0 mb-1 w-full">
              <li>
                <NavLink to="profile" className={({ isActive }) => isActive ? 'active' : ''}>
                  Perfil
                </NavLink>
              </li>
            </ul>

            {/* Logout */}
            <div className="border-t border-base-300 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error btn-sm w-full"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Área abaixo do header: sidebar + conteúdo */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay mobile */}
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            style={{ top: '4rem' }}
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            w-64 flex-shrink-0 bg-base-200 border-r border-base-300 flex flex-col overflow-y-auto
            fixed top-16 bottom-0 left-0 z-40 transition-transform duration-300
            lg:static lg:top-auto lg:bottom-auto lg:translate-x-0
            ${drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-4 flex flex-col flex-1">
          <ul className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavLink_ key={item.to} {...item} />
            ))}

            {/* Menu de Relatórios */}
            <li>
              <details className="group" open>
                <summary className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-base-content/70 hover:bg-base-300 hover:text-base-content cursor-pointer list-none">
                  <FileText size={18} />
                  <span>Relatórios</span>
                  <svg className="ml-auto h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <ul className="mt-1 ml-6 space-y-2">
                  {/* Essenciais */}
                  <li>
                    <div className="text-xs font-semibold text-base-content/50 px-4 py-1">ESSENCIAIS</div>
                    <ul className="space-y-1">
                      {reportSections.essentials.map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            onClick={() => setDrawerOpen(false)}
                            className={({ isActive }) =>
                              `block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActive
                                  ? 'bg-primary text-primary-content font-medium'
                                  : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                              }`
                            }
                          >
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* Análise */}
                  <li>
                    <div className="text-xs font-semibold text-base-content/50 px-4 py-1 mt-2">ANÁLISE</div>
                    <ul className="space-y-1">
                      {reportSections.analysis.map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            onClick={() => setDrawerOpen(false)}
                            className={({ isActive }) =>
                              `block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActive
                                  ? 'bg-primary text-primary-content font-medium'
                                  : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                              }`
                            }
                          >
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* Avançados */}
                  <li>
                    <div className="text-xs font-semibold text-base-content/50 px-4 py-1 mt-2">AVANÇADOS</div>
                    <ul className="space-y-1">
                      {reportSections.advanced.map((item) => (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            onClick={() => setDrawerOpen(false)}
                            className={({ isActive }) =>
                              `block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActive
                                  ? 'bg-primary text-primary-content font-medium'
                                  : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                              }`
                            }
                          >
                            {item.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </details>
            </li>
          </ul>

          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-base-100">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
