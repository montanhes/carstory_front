import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { logout } = useAuth()
  const { theme, setTheme, themes } = useTheme()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', label: 'Início', end: true },
    { to: 'vehicles', label: 'Veículos', end: false },
    { to: 'profile', label: 'Perfil', end: false },
  ]

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
    <div className="drawer lg:drawer-open">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle hidden"
        checked={drawerOpen}
        onChange={(e) => setDrawerOpen(e.target.checked)}
      />

      {/* Main Content */}
      <div className="drawer-content flex flex-col h-screen bg-base-100">
        {/* Header */}
        <header className="h-16 bg-base-200 border-b border-base-300 flex items-center px-4 md:px-6 shadow-sm z-30">
          <label
            htmlFor="sidebar-drawer"
            className="btn btn-ghost btn-circle drawer-button lg:hidden"
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
              ></path>
            </svg>
          </label>
          <span className="text-xl font-bold text-base-content ml-2 lg:ml-0">CarStory</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-base-100">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side z-50">
        <label
          htmlFor="sidebar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside className="bg-base-200 border-r border-base-300 p-4 overflow-y-auto w-64 min-h-full flex flex-col">
          <ul className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavLink_ key={item.to} {...item} />
            ))}
          </ul>

          {/* Divider */}
          <div className="divider my-2"></div>

          {/* Theme Selector */}
          <div className="form-control mb-3">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">Tema</span>
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="select select-bordered select-sm w-full"
            >
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error btn-sm w-full"
          >
            Sair
          </button>
        </aside>
      </div>
    </div>
  )
}
