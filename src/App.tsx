import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import PWAInstallBanner from './components/PWAInstallBanner'

// Eager — páginas críticas de primeiro acesso
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Lazy — tudo que só carrega após interação do usuário
const AuthCallback   = lazy(() => import('./pages/AuthCallback'))
const PlanSelection  = lazy(() => import('./pages/PlanSelection'))
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))

const Dashboard     = lazy(() => import('./pages/Dashboard'))
const Vehicles      = lazy(() => import('./pages/Vehicles'))
const VehicleDetails = lazy(() => import('./pages/VehicleDetails'))
const Profile       = lazy(() => import('./pages/Profile'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))

// Relatórios (named exports → default wrapper)
const ExpensesByCategory  = lazy(() => import('./pages/reports/ExpensesByCategory').then(m => ({ default: m.ExpensesByCategory })))
const ExpensesByVehicle   = lazy(() => import('./pages/reports/ExpensesByVehicle').then(m => ({ default: m.ExpensesByVehicle })))
const ExpensesExtract     = lazy(() => import('./pages/reports/ExpensesExtract').then(m => ({ default: m.ExpensesExtract })))
const TemporalAnalysis    = lazy(() => import('./pages/reports/TemporalAnalysis').then(m => ({ default: m.TemporalAnalysis })))
const FuelAnalysis        = lazy(() => import('./pages/reports/FuelAnalysis').then(m => ({ default: m.FuelAnalysis })))
const VehicleComparison   = lazy(() => import('./pages/reports/VehicleComparison').then(m => ({ default: m.VehicleComparison })))
const MaintenanceReport   = lazy(() => import('./pages/reports/MaintenanceReport').then(m => ({ default: m.MaintenanceReport })))
const DepreciationReport  = lazy(() => import('./pages/reports/DepreciationReport').then(m => ({ default: m.DepreciationReport })))
const FleetBenchmark      = lazy(() => import('./pages/reports/FleetBenchmark').then(m => ({ default: m.FleetBenchmark })))
const AlertsReport        = lazy(() => import('./pages/reports/AlertsReport').then(m => ({ default: m.AlertsReport })))
const BudgetReport        = lazy(() => import('./pages/reports/BudgetReport').then(m => ({ default: m.BudgetReport })))

import ProtectedRoute from './components/ProtectedRoute'

function PageLoader() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  )
}

function PlanSelectionRoute({ children }: { children: React.ReactNode }) {
  const { user, hasPlan, loading } = useAuth()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (hasPlan) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider>
      <PWAUpdatePrompt />
      <PWAInstallBanner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/onboarding/plan"
                element={
                  <PlanSelectionRoute>
                    <PlanSelection />
                  </PlanSelectionRoute>
                }
              />
              <Route
                path="/dashboard/payment/success"
                element={
                  <ProtectedRoute requirePlan={false}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<PaymentSuccess />} />
              </Route>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="vehicles/:id" element={<VehicleDetails />} />
                <Route path="profile" element={<Profile />} />
                {/* Fase 1 - Relatórios Essenciais */}
                <Route path="reports/by-category" element={<ExpensesByCategory />} />
                <Route path="reports/by-vehicle" element={<ExpensesByVehicle />} />
                <Route path="reports/extract" element={<ExpensesExtract />} />
                {/* Fase 2 - Análise */}
                <Route path="reports/temporal-analysis" element={<TemporalAnalysis />} />
                <Route path="reports/fuel-analysis" element={<FuelAnalysis />} />
                <Route path="reports/vehicle-comparison" element={<VehicleComparison />} />
                <Route path="reports/maintenance" element={<MaintenanceReport />} />
                {/* Fase 3 - Avançados */}
                <Route path="reports/depreciation" element={<DepreciationReport />} />
                <Route path="reports/fleet-benchmark" element={<FleetBenchmark />} />
                <Route path="reports/alerts" element={<AlertsReport />} />
                <Route path="reports/budget" element={<BudgetReport />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
