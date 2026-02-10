import { useState, useEffect } from 'react'
import type { VehicleExpense, EnumOption, ExpenseCategoryWithTypes } from '../services/api'
import { handleCurrencyChange } from '../utils/currency'
import DateInput from './DateInput'

interface ExpenseFormData {
  expense_category: number | ''
  expense_type: number | ''
  value: number | ''
  payment_method: number | ''
  expense_date: string
  odometer_mileage: number | ''
  invoice_number: string
  is_recurring: boolean
  receipt_attached: boolean
  notes: string
}

interface ExpenseFormDisplayData {
  value: string
}

interface ExpenseFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (expense: ExpenseFormData) => void
  expense: VehicleExpense | null
  expenseCategoriesWithTypes: ExpenseCategoryWithTypes[]
  paymentMethods: EnumOption[]
}

export default function ExpenseFormModal({
  isOpen,
  onClose,
  onSave,
  expense,
  expenseCategoriesWithTypes,
  paymentMethods,
}: ExpenseFormModalProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    expense_category: '',
    expense_type: '',
    value: '',
    payment_method: '',
    expense_date: new Date().toISOString().split('T')[0],
    odometer_mileage: '',
    invoice_number: '',
    is_recurring: false,
    receipt_attached: false,
    notes: '',
  })

  const [displayData, setDisplayData] = useState<ExpenseFormDisplayData>({
    value: '',
  })

  useEffect(() => {
    if (expense) {
      const isoDate = expense.expense_date.split(' ')[0]
      setFormData({
        expense_category: expense.expense_category,
        expense_type: expense.expense_type,
        value: expense.value,
        payment_method: expense.payment_method,
        expense_date: isoDate,
        odometer_mileage: expense.odometer_mileage || '',
        invoice_number: expense.invoice_number || '',
        is_recurring: expense.is_recurring,
        receipt_attached: expense.receipt_attached,
        notes: expense.notes || '',
      })
      setDisplayData({
        value: expense.value.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      })
    } else {
      setFormData({
        expense_category: '',
        expense_type: '',
        value: '',
        payment_method: '',
        expense_date: new Date().toISOString().split('T')[0],
        odometer_mileage: '',
        invoice_number: '',
        is_recurring: false,
        receipt_attached: false,
        notes: '',
      })
      setDisplayData({
        value: '',
      })
    }
  }, [expense])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : parseInt(value) }))
    } else if (e.target.tagName === 'SELECT') {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : parseInt(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = handleCurrencyChange(e.target.value, (numValue) => {
      setFormData((prev) => ({ ...prev, value: numValue }))
    })
    setDisplayData((prev) => ({ ...prev, value: formatted }))
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value === '' ? '' : parseInt(e.target.value)
    setFormData((prev) => ({
      ...prev,
      expense_category: categoryId,
      expense_type: '', // Reseta o tipo quando muda a categoria
    }))
  }

  // Busca os tipos da categoria selecionada
  const selectedCategory = expenseCategoriesWithTypes.find(
    (cat) => cat.id === formData.expense_category
  )
  const availableTypes = selectedCategory ? selectedCategory.types : []

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      ></div>
      <div className="relative bg-base-200 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border border-base-300">
        <div className="sticky top-0 bg-base-200 px-4 py-3 md:px-6 md:py-4 border-b border-base-300 rounded-t-lg">
          <h3 className="text-lg md:text-xl font-bold text-base-content">
            {expense ? 'Editar Despesa' : 'Adicionar Despesa'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {/* Categoria */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Categoria *</span>
              </label>
              <select
                name="expense_category"
                value={formData.expense_category}
                onChange={handleCategoryChange}
                className="select select-bordered select-sm md:select-md w-full"
                required
              >
                <option value="">Selecione</option>
                {expenseCategoriesWithTypes.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Tipo *</span>
              </label>
              <select
                name="expense_type"
                value={formData.expense_type}
                onChange={handleChange}
                className="select select-bordered select-sm md:select-md w-full"
                required
              >
                <option value="">
                  {formData.expense_category ? 'Selecione' : 'Primeiro selecione uma categoria'}
                </option>
                {availableTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Valor */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Valor *</span>
              </label>
              <input
                type="text"
                name="value"
                value={displayData.value}
                onChange={handleValueChange}
                placeholder="0,00"
                className="input input-bordered input-sm md:input-md w-full"
                required
              />
            </div>

            {/* Método de Pagamento */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Método de Pagamento *</span>
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="select select-bordered select-sm md:select-md w-full"
                required
              >
                <option value="">Selecione</option>
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Data da Despesa *</span>
              </label>
              <DateInput
                value={formData.expense_date}
                onChange={(isoDate) => setFormData((prev) => ({ ...prev, expense_date: isoDate }))}
                placeholder="DD/MM/AAAA"
                required
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            {/* Quilometragem */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Quilometragem</span>
              </label>
              <input
                type="number"
                name="odometer_mileage"
                value={formData.odometer_mileage}
                onChange={handleChange}
                min="0"
                placeholder="Ex: 50000"
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            {/* Número da Nota */}
            <div className="form-control sm:col-span-2">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Número da Nota Fiscal</span>
              </label>
              <input
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, invoice_number: e.target.value }))}
                placeholder="Ex: NF-12345"
                maxLength={50}
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            {/* Checkboxes */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2 py-1">
                <input
                  type="checkbox"
                  name="is_recurring"
                  checked={formData.is_recurring}
                  onChange={handleChange}
                  className="checkbox checkbox-xs md:checkbox-sm"
                />
                <span className="label-text text-xs md:text-sm">Despesa recorrente</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2 py-1">
                <input
                  type="checkbox"
                  name="receipt_attached"
                  checked={formData.receipt_attached}
                  onChange={handleChange}
                  className="checkbox checkbox-xs md:checkbox-sm"
                />
                <span className="label-text text-xs md:text-sm">Recibo anexado</span>
              </label>
            </div>

            {/* Observações */}
            <div className="form-control sm:col-span-2">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Observações</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Observações adicionais"
                rows={3}
                maxLength={1000}
                className="textarea textarea-bordered textarea-sm md:textarea-md w-full"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm md:btn-md"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-sm md:btn-md">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
