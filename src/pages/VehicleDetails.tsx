import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehicleService, expenseService, enumService, type Vehicle, type VehicleExpense, type EnumOption, type ExpenseCategoryWithTypes, type ExpenseFilters as ExpenseFiltersType } from '../services/api'
import ExpenseFormModal from '../components/ExpenseFormModal'
import ExpenseFilters from '../components/ExpenseFilters'
import ConfirmDialog from '../components/ConfirmDialog'
import AlertDialog from '../components/AlertDialog'
import { CreditCard, Gauge, FileText, Paperclip, MessageSquare, Edit2, Trash2, ArrowLeft, Filter, X } from 'lucide-react'

type AlertType = 'error' | 'success' | 'info' | 'warning'

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [expenses, setExpenses] = useState<VehicleExpense[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<VehicleExpense | null>(null)
  const [expenseCategoriesWithTypes, setExpenseCategoriesWithTypes] = useState<ExpenseCategoryWithTypes[]>([])
  const [paymentMethods, setPaymentMethods] = useState<EnumOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ExpenseFiltersType>({
    sort_by: 'expense_date',
    sort_direction: 'desc',
  })
  const [totalExpenses, setTotalExpenses] = useState(0)

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean
    type: AlertType
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  })

  useEffect(() => {
    const loadData = async () => {
      if (!id) return

      try {
        setLoading(true)
        const [vehicleData, categoriesWithTypesData, methodsData] = await Promise.all([
          vehicleService.showVehicle(parseInt(id)),
          enumService.getExpenseCategoriesWithTypes(),
          enumService.getPaymentMethods(),
        ])
        setVehicle(vehicleData)
        setExpenseCategoriesWithTypes(categoriesWithTypesData)
        setPaymentMethods(methodsData)
      } catch (err) {
        setError('Erro ao carregar dados. Tente novamente.')
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  useEffect(() => {
    const loadExpenses = async () => {
      if (!id) return

      try {
        const response = await expenseService.getExpenses(parseInt(id), filters)
        setExpenses(response.data)
        setTotalExpenses(response.total)
      } catch (err) {
        console.error('Erro ao carregar despesas:', err)
      }
    }

    loadExpenses()
  }, [id, filters])

  const handleAddExpense = () => {
    setEditingExpense(null)
    setIsModalOpen(true)
  }

  const handleEditExpense = (expense: VehicleExpense) => {
    setEditingExpense(expense)
    setIsModalOpen(true)
  }

  const handleSaveExpense = async (data: any) => {
    if (!id) return

    try {
      if (editingExpense) {
        await expenseService.updateExpense(parseInt(id), editingExpense.id, data)
      } else {
        await expenseService.createExpense(parseInt(id), data)
      }
      setIsModalOpen(false)
      setEditingExpense(null)
      // Recarrega as despesas com os filtros atuais
      const response = await expenseService.getExpenses(parseInt(id), filters)
      setExpenses(response.data)
      setTotalExpenses(response.total)
    } catch (err) {
      console.error('Erro ao salvar despesa:', err)
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: 'Erro ao salvar despesa. Tente novamente.',
      })
    }
  }

  const handleDeleteExpense = (expenseId: number) => {
    if (!id) return

    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Despesa',
      message: 'Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        try {
          await expenseService.deleteExpense(parseInt(id), expenseId)
          // Recarrega as despesas com os filtros atuais
          const response = await expenseService.getExpenses(parseInt(id), filters)
          setExpenses(response.data)
          setTotalExpenses(response.total)
        } catch (err) {
          console.error('Erro ao excluir despesa:', err)
          setAlertDialog({
            isOpen: true,
            type: 'error',
            title: 'Erro',
            message: 'Erro ao excluir despesa. Tente novamente.',
          })
        }
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="alert alert-error">
        <span>{error || 'Veículo não encontrado'}</span>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate('/dashboard/vehicles')}
            className="btn btn-ghost btn-sm mb-2 gap-1"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-base-content">{vehicle.name}</h2>
          <p className="text-sm text-base-content/60 mt-1">
            {vehicle.make} {vehicle.model} • {vehicle.manufacturing_year}/{vehicle.model_year}
          </p>
        </div>
        <button
          onClick={handleAddExpense}
          className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
        >
          Adicionar Despesa
        </button>
      </div>

      {/* Vehicle Info */}
      <div className="card bg-base-200 shadow-md mb-6 border border-base-300">
        <div className="card-body p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-3">Informações do Veículo</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
            {vehicle.license_plate && (
              <div>
                <span className="text-base-content/50">Placa:</span>
                <span className="text-base-content ml-1 font-medium">{vehicle.license_plate}</span>
              </div>
            )}
            <div>
              <span className="text-base-content/50">Cor:</span>
              <span className="text-base-content ml-1">{vehicle.color}</span>
            </div>
            {vehicle.fuel_label && (
              <div>
                <span className="text-base-content/50">Combustível:</span>
                <span className="text-base-content ml-1">{vehicle.fuel_label}</span>
              </div>
            )}
            {vehicle.transmission_label && (
              <div>
                <span className="text-base-content/50">Câmbio:</span>
                <span className="text-base-content ml-1">{vehicle.transmission_label}</span>
              </div>
            )}
            <div>
              <span className="text-base-content/50">KM Inicial:</span>
              <span className="text-base-content ml-1 font-medium">{vehicle.formatted_initial_mileage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List - Timeline */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">Histórico de Despesas</h3>
              <div className="badge badge-neutral">{totalExpenses} registros</div>
            </div>
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="btn btn-outline btn-sm gap-2"
            >
              <Filter size={16} />
              Filtros
              {Object.keys(filters).filter(k => k !== 'sort_by' && k !== 'sort_direction').length > 0 && (
                <span className="badge badge-primary badge-xs">
                  {Object.keys(filters).filter(k => k !== 'sort_by' && k !== 'sort_direction').length}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Chips */}
          {Object.keys(filters).filter(k => k !== 'sort_by' && k !== 'sort_direction').length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-base-300">
              {filters.category && (
                <div className="badge badge-lg gap-2">
                  Categoria: {expenseCategoriesWithTypes.find(c => c.id === filters.category)?.label}
                  <button
                    onClick={() => setFilters({ ...filters, category: undefined, type: undefined })}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {filters.type && (
                <div className="badge badge-lg gap-2">
                  Tipo: {expenseCategoriesWithTypes
                    .flatMap(c => c.types)
                    .find(t => t.id === filters.type)?.label}
                  <button
                    onClick={() => setFilters({ ...filters, type: undefined })}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {filters.payment_method && (
                <div className="badge badge-lg gap-2">
                  Pagamento: {paymentMethods.find(p => p.value === filters.payment_method)?.label}
                  <button
                    onClick={() => setFilters({ ...filters, payment_method: undefined })}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {(filters.date_from || filters.date_to) && (
                <div className="badge badge-lg gap-2">
                  Período: {filters.date_from && new Date(filters.date_from).toLocaleDateString('pt-BR')}
                  {filters.date_from && filters.date_to && ' - '}
                  {filters.date_to && new Date(filters.date_to).toLocaleDateString('pt-BR')}
                  <button
                    onClick={() => setFilters({ ...filters, date_from: undefined, date_to: undefined })}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {(filters.value_from !== undefined || filters.value_to !== undefined) && (
                <div className="badge badge-lg gap-2">
                  Valor: {filters.value_from && `R$ ${filters.value_from.toFixed(2)}`}
                  {filters.value_from && filters.value_to && ' - '}
                  {filters.value_to && `R$ ${filters.value_to.toFixed(2)}`}
                  <button
                    onClick={() => setFilters({ ...filters, value_from: undefined, value_to: undefined })}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {filters.is_recurring && (
                <div className="badge badge-lg gap-2">
                  Recorrentes
                  <button
                    onClick={() => setFilters({ ...filters, is_recurring: undefined })}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {filters.receipt_attached && (
                <div className="badge badge-lg gap-2">
                  Com Recibo
                  <button
                    onClick={() => setFilters({ ...filters, receipt_attached: undefined })}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <button
                onClick={() => setFilters({ sort_by: 'expense_date', sort_direction: 'desc' })}
                className="btn btn-ghost btn-xs"
              >
                Limpar todos
              </button>
            </div>
          )}

          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base-content/60 text-lg">Nenhuma despesa registrada</p>
              <p className="text-base-content/40 text-sm mt-2">
                Clique em "Adicionar Despesa" para começar a controlar seus gastos
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense, index) => {
                // Agrupa por mês
                const currentDate = new Date(expense.expense_date)
                const prevDate = index > 0 ? new Date(expenses[index - 1].expense_date) : null
                const showMonthHeader = !prevDate ||
                  currentDate.getMonth() !== prevDate.getMonth() ||
                  currentDate.getFullYear() !== prevDate.getFullYear()

                return (
                  <div key={expense.id}>
                    {showMonthHeader && (
                      <div className="flex items-center gap-3 mb-4 mt-6 first:mt-0">
                        <div className="text-sm font-bold text-base-content/70 uppercase tracking-wider">
                          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex-1 h-px bg-base-300"></div>
                      </div>
                    )}

                    <div className="collapse collapse-arrow bg-base-100 border border-base-300 hover:border-primary/40 transition-colors">
                      <input type="checkbox" />

                      {/* Header (sempre visível) */}
                      <div className="collapse-title px-4 py-3 pr-12">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-base-content/60">
                                {expense.formatted_expense_date}
                              </span>
                              <span className="text-base-content/40">•</span>
                              <span className="font-semibold text-base-content">
                                {expense.expense_category_label}
                              </span>
                              <span className="text-base-content/60">-</span>
                              <span className="text-base-content/80">
                                {expense.expense_type_label}
                              </span>
                              {expense.is_recurring && (
                                <span className="badge badge-primary badge-xs">Recorrente</span>
                              )}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-primary shrink-0 mr-2">
                            {expense.formatted_value}
                          </div>
                        </div>
                      </div>

                      {/* Detalhes (expandido) */}
                      <div className="collapse-content px-4 pb-4">
                        <div className="border-t border-base-300 pt-3 space-y-2">
                          {/* Informações */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <CreditCard size={16} className="text-primary shrink-0" />
                              <span className="text-base-content/60">Pagamento:</span>
                              <span className="text-base-content font-medium">
                                {expense.payment_method_label}
                              </span>
                            </div>

                            {expense.formatted_odometer_mileage && (
                              <div className="flex items-center gap-2">
                                <Gauge size={16} className="text-primary shrink-0" />
                                <span className="text-base-content/60">Quilometragem:</span>
                                <span className="text-base-content font-medium">
                                  {expense.formatted_odometer_mileage}
                                </span>
                              </div>
                            )}

                            {expense.invoice_number && (
                              <div className="flex items-center gap-2">
                                <FileText size={16} className="text-primary shrink-0" />
                                <span className="text-base-content/60">Nota Fiscal:</span>
                                <span className="text-base-content">
                                  {expense.invoice_number}
                                </span>
                              </div>
                            )}

                            {expense.receipt_attached && (
                              <div className="flex items-center gap-2">
                                <Paperclip size={16} className="text-success shrink-0" />
                                <span className="badge badge-success badge-sm">Recibo Anexado</span>
                              </div>
                            )}
                          </div>

                          {expense.notes && (
                            <div className="pt-2">
                              <div className="flex items-center gap-2 text-xs text-base-content/60 mb-1">
                                <MessageSquare size={14} className="text-primary" />
                                Observações:
                              </div>
                              <div className="text-sm text-base-content bg-base-200 rounded p-2">
                                {expense.notes}
                              </div>
                            </div>
                          )}

                          {/* Ações */}
                          <div className="flex gap-2 pt-3">
                            <button
                              onClick={() => handleEditExpense(expense)}
                              className="btn btn-outline btn-primary btn-sm gap-1"
                            >
                              <Edit2 size={14} />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="btn btn-outline btn-error btn-sm gap-1"
                            >
                              <Trash2 size={14} />
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingExpense(null)
        }}
        onSave={handleSaveExpense}
        expense={editingExpense}
        expenseCategoriesWithTypes={expenseCategoriesWithTypes}
        paymentMethods={paymentMethods}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDangerous
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <AlertDialog
        isOpen={alertDialog.isOpen}
        type={alertDialog.type}
        title={alertDialog.title}
        message={alertDialog.message}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
      />

      <ExpenseFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={(newFilters: ExpenseFiltersType) => setFilters(newFilters)}
        currentFilters={filters}
        expenseCategoriesWithTypes={expenseCategoriesWithTypes}
        paymentMethods={paymentMethods}
      />
    </div>
  )
}
