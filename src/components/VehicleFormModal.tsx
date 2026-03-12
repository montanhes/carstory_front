import { useState } from 'react'
import type { EnumOption } from '../services/api'
import { handleCurrencyChange } from '../utils/currency'
import DateInput from './DateInput'
import Modal from './Modal'

interface VehicleFormData {
  name: string
  make: string
  model: string
  manufacturing_year: number
  model_year: number
  color: string
  license_plate: string
  vin: string
  renavam: string
  engine: string
  transmission: number | ''
  fuel: number | ''
  horsepower: number | ''
  body_type: number | ''
  doors: number | ''
  acquisition_date: string
  acquisition_price: number | ''
  initial_mileage: number
  accessories: string
  notes: string
}

interface VehicleFormDisplayData {
  acquisition_price: string
}

interface VehicleFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vehicle: VehicleFormData) => void
  bodyTypes: EnumOption[]
  fuelTypes: EnumOption[]
  transmissionTypes: EnumOption[]
}

const emptyForm: VehicleFormData = {
  name: '',
  make: '',
  model: '',
  manufacturing_year: new Date().getFullYear(),
  model_year: new Date().getFullYear(),
  color: '',
  license_plate: '',
  vin: '',
  renavam: '',
  engine: '',
  transmission: '',
  fuel: '',
  horsepower: '',
  body_type: '',
  doors: '',
  acquisition_date: '',
  acquisition_price: '',
  initial_mileage: 0,
  accessories: '',
  notes: '',
}

export default function VehicleFormModal({
  isOpen,
  onClose,
  onSave,
  bodyTypes,
  fuelTypes,
  transmissionTypes
}: VehicleFormModalProps) {
  const [activeTab, setActiveTab] = useState<'essential' | 'optional'>('essential')
  const [formData, setFormData] = useState<VehicleFormData>({ ...emptyForm })
  const [displayData, setDisplayData] = useState<VehicleFormDisplayData>({
    acquisition_price: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({ ...emptyForm })
    setDisplayData({ acquisition_price: '' })
    setActiveTab('essential')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseInt(value)) : value,
    }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = handleCurrencyChange(e.target.value, (numValue) => {
      setFormData((prev) => ({ ...prev, acquisition_price: numValue }))
    })
    setDisplayData((prev) => ({ ...prev, acquisition_price: formatted }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar Veículo"
      subtitle="Preencha os dados principais e complemente depois se quiser"
      size="lg"
      footer={
        <>
          <button type="submit" form="vehicle-form" className="btn btn-primary btn-sm md:btn-md">
            Salvar
          </button>
          {activeTab === 'essential' ? (
            <button
              type="button"
              onClick={() => setActiveTab('optional')}
              className="btn btn-outline btn-primary btn-sm md:btn-md"
            >
              Complementar dados
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('essential')}
              className="btn btn-outline btn-primary btn-sm md:btn-md"
            >
              Voltar
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm md:btn-md"
          >
            Cancelar
          </button>
        </>
      }
    >
      {/* Tabs */}
      <div className="px-5 md:px-6 pt-4">
        <div role="tablist" className="tabs tabs-bordered">
          <button
            type="button"
            role="tab"
            className={`tab tab-sm md:tab-md font-semibold ${activeTab === 'essential' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('essential')}
          >
            Dados Principais
          </button>
          <button
            type="button"
            role="tab"
            className={`tab tab-sm md:tab-md font-semibold ${activeTab === 'optional' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('optional')}
          >
            Dados Complementares
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="vehicle-form" onSubmit={handleSubmit} className="p-5 md:p-6">
        {/* === Aba: Dados Principais === */}
        {activeTab === 'essential' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Nome do Veículo *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Meu Carro"
                className="input input-bordered input-sm md:input-md w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Marca *</span>
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="Ex: Toyota"
                className="input input-bordered input-sm md:input-md w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Modelo *</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Ex: Corolla"
                className="input input-bordered input-sm md:input-md w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Cor *</span>
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Ex: Prata"
                className="input input-bordered input-sm md:input-md w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Ano de Fabricação *</span>
              </label>
              <input
                type="number"
                name="manufacturing_year"
                value={formData.manufacturing_year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="input input-bordered input-sm md:input-md w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Ano do Modelo *</span>
              </label>
              <input
                type="number"
                name="model_year"
                value={formData.model_year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 2}
                className="input input-bordered input-sm md:input-md w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Quilometragem Inicial *</span>
              </label>
              <input
                type="number"
                name="initial_mileage"
                value={formData.initial_mileage}
                onChange={handleChange}
                placeholder="Ex: 0"
                min="0"
                className="input input-bordered input-sm md:input-md w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Placa</span>
              </label>
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                placeholder="Ex: ABC-1234"
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>
          </div>
        )}

        {/* === Aba: Dados Complementares === */}
        {activeTab === 'optional' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Combustível</span>
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="select select-bordered select-sm md:select-md w-full"
              >
                <option value="">Selecione</option>
                {fuelTypes.map((opt: EnumOption) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Transmissão</span>
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="select select-bordered select-sm md:select-md w-full"
              >
                <option value="">Selecione</option>
                {transmissionTypes.map((opt: EnumOption) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Tipo de Carroceria</span>
              </label>
              <select
                name="body_type"
                value={formData.body_type}
                onChange={handleChange}
                className="select select-bordered select-sm md:select-md w-full"
              >
                <option value="">Selecione</option>
                {bodyTypes.map((opt: EnumOption) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Motor</span>
              </label>
              <input
                type="text"
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                placeholder="Ex: 2.0"
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Potência (cv)</span>
              </label>
              <input
                type="number"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleChange}
                placeholder="Ex: 150"
                min="0"
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Portas</span>
              </label>
              <input
                type="number"
                name="doors"
                value={formData.doors}
                onChange={handleChange}
                placeholder="Ex: 4"
                min="1"
                max="10"
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">VIN (Chassi)</span>
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="Ex: 1HGBH41JXMN109186"
                maxLength={17}
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">RENAVAM</span>
              </label>
              <input
                type="text"
                name="renavam"
                value={formData.renavam}
                onChange={handleChange}
                placeholder="Ex: 12345678901"
                maxLength={11}
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Data de Aquisição</span>
              </label>
              <DateInput
                value={formData.acquisition_date}
                onChange={(isoDate) => setFormData((prev) => ({ ...prev, acquisition_date: isoDate }))}
                placeholder="DD/MM/AAAA"
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Preço de Aquisição</span>
              </label>
              <input
                type="text"
                name="acquisition_price"
                value={displayData.acquisition_price}
                onChange={handlePriceChange}
                placeholder="Ex: 50.000,00"
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            <div className="form-control sm:col-span-2">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Acessórios (JSON)</span>
              </label>
              <textarea
                name="accessories"
                value={formData.accessories}
                onChange={handleChange}
                placeholder='Ex: {"ar_condicionado": true, "vidros_eletricos": true}'
                rows={2}
                className="textarea textarea-bordered textarea-sm md:textarea-md w-full"
              />
            </div>

            <div className="form-control sm:col-span-2">
              <label className="label py-1">
                <span className="label-text text-xs md:text-sm">Observações</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Observações adicionais sobre o veículo"
                rows={3}
                className="textarea textarea-bordered textarea-sm md:textarea-md w-full"
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}
