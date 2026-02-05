import { Outlet, NavLink } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen bg-base-100">
      <header className="h-16 bg-base-200 border-b border-base-300 flex items-center px-6 shadow-sm">
        <span className="text-xl font-bold text-base-content">CarStory</span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-base-200 border-r border-base-300 p-4 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-content font-medium'
                      : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                  }`
                }
              >
                Início
              </NavLink>
            </li>
            <li>
              <NavLink
                to="vehicles"
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-content font-medium'
                      : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                  }`
                }
              >
                Veículos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-content font-medium'
                      : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                  }`
                }
              >
                Perfil
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-content font-medium'
                      : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                  }`
                }
              >
                Configurações
              </NavLink>
            </li>
          </ul>
        </aside>
        <main className="flex-1 overflow-y-auto p-6 bg-base-100">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
