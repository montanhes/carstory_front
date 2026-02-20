import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import VehicleDetails from './pages/VehicleDetails'
import Profile from './pages/Profile'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ExpensesByCategory } from './pages/reports/ExpensesByCategory'
import { ExpensesByVehicle } from './pages/reports/ExpensesByVehicle'
import { ExpensesExtract } from './pages/reports/ExpensesExtract'
import { TemporalAnalysis } from './pages/reports/TemporalAnalysis'
import { FuelAnalysis } from './pages/reports/FuelAnalysis'
import { VehicleComparison } from './pages/reports/VehicleComparison'
import { MaintenanceReport } from './pages/reports/MaintenanceReport'
import { DepreciationReport } from './pages/reports/DepreciationReport'
import { FleetBenchmark } from './pages/reports/FleetBenchmark'
import { AlertsReport } from './pages/reports/AlertsReport'
import { BudgetReport } from './pages/reports/BudgetReport'
import './config/chartConfig'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
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
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
