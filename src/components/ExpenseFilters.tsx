import { useState, useEffect } from 'react'
import type { ExpenseFilters, ExpenseCategoryWithTypes, EnumOption } from '../services/api'
import DateInput from './DateInput'
import Modal from './Modal'

interface ExpenseFiltersProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: ExpenseFilters) => void
  currentFilters: ExpenseFilters
  expenseCategoriesWithTypes: ExpenseCategoryWithTypes[]
  paymentMethods: EnumOption[]
}

export default function ExpenseFiltersModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  expenseCategoriesWithTypes,
  paymentMethods,
}: ExpenseFiltersProps) {
  const [filters, setFilters] = useState<ExpenseFilters>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters, isOpen])

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleClear = () => {
    const clearedFilters: ExpenseFilters = {
      sort_by: 'expense_date',
      sort_direction: 'desc',
    }
    setFilters(clearedFilters)
    onApply(clearedFilters)
    onClose()
  }

  const selectedCategory = expenseCategoriesWithTypes.find(
    (cat) => cat.id === filters.category
  )
  const availableTypes = selectedCategory ? selectedCategory.types : []

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filtrar Despesas"
      size="md"
      footer={
        <>
          <button onClick={handleApply} className="btn btn-primary btn-sm md:btn-md">
            Aplicar Filtros
          </button>
          <button onClick={handleClear} className="btn btn-ghost btn-sm md:btn-md">
            Limpar Filtros
          </button>
        </>
      }
    >
      <div className="p-5 md:p-6 space-y-4">
        {/* Categoria e Tipo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Categoria</span>
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : undefined
                setFilters({ ...filters, category: value, type: undefined })
              }}
              className="select select-bordered select-sm md:select-md w-full"
            >
              <option value="">Todas</option>
              {expenseCategoriesWithTypes.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Tipo</span>
            </label>
            <select
              value={filters.type || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : undefined
                setFilters({ ...filters, type: value })
              }}
              className="select select-bordered select-sm md:select-md w-full"
              disabled={!filters.category}
            >
              <option value="">
                {filters.category ? 'Todos' : 'Selecione uma categoria'}
              </option>
              {availableTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text text-sm font-medium">Método de Pagamento</span>
          </label>
          <select
            value={filters.payment_method || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : undefined
              setFilters({ ...filters, payment_method: value })
            }}
            className="select select-bordered select-sm md:select-md w-full"
          >
            <option value="">Todos</option>
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        {/* Intervalo de Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Data Inicial</span>
            </label>
            <DateInput
              value={filters.date_from || ''}
              onChange={(date) => setFilters({ ...filters, date_from: date })}
              className="input input-bordered input-sm md:input-md w-full"
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Data Final</span>
            </label>
            <DateInput
              value={filters.date_to || ''}
              onChange={(date) => setFilters({ ...filters, date_to: date })}
              className="input input-bordered input-sm md:input-md w-full"
            />
          </div>
        </div>

        {/* Intervalo de Valor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Valor Mínimo (R$)</span>
            </label>
            <input
              type="number"
              value={filters.value_from || ''}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : undefined
                setFilters({ ...filters, value_from: value })
              }}
              placeholder="0,00"
              step="0.01"
              min="0"
              className="input input-bordered input-sm md:input-md w-full"
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Valor Máximo (R$)</span>
            </label>
            <input
              type="number"
              value={filters.value_to || ''}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : undefined
                setFilters({ ...filters, value_to: value })
              }}
              placeholder="0,00"
              step="0.01"
              min="0"
              className="input input-bordered input-sm md:input-md w-full"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                checked={filters.is_recurring || false}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    is_recurring: e.target.checked ? true : undefined,
                  })
                }
                className="checkbox checkbox-primary"
              />
              <span className="label-text">Apenas Recorrentes</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                checked={filters.receipt_attached || false}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    receipt_attached: e.target.checked ? true : undefined,
                  })
                }
                className="checkbox checkbox-primary"
              />
              <span className="label-text">Apenas com Recibo</span>
            </label>
          </div>
        </div>

        {/* Ordenação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Ordenar por</span>
            </label>
            <select
              value={filters.sort_by || 'expense_date'}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sort_by: e.target.value as ExpenseFilters['sort_by'],
                })
              }
              className="select select-bordered select-sm md:select-md w-full"
            >
              <option value="expense_date">Data da Despesa</option>
              <option value="value">Valor</option>
              <option value="odometer_mileage">Quilometragem</option>
              <option value="created_at">Data de Criação</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Direção</span>
            </label>
            <select
              value={filters.sort_direction || 'desc'}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sort_direction: e.target.value as ExpenseFilters['sort_direction'],
                })
              }
              className="select select-bordered select-sm md:select-md w-full"
            >
              <option value="desc">Decrescente (Mais recente primeiro)</option>
              <option value="asc">Crescente (Mais antigo primeiro)</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  )
}
