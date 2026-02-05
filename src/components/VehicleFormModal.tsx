import { useState } from 'react'
import type { EnumOption } from '../services/api'

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

interface VehicleFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vehicle: VehicleFormData) => void
  bodyTypes: EnumOption[]
  fuelTypes: EnumOption[]
  transmissionTypes: EnumOption[]
}

export default function VehicleFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  bodyTypes, 
  fuelTypes, 
  transmissionTypes 
}: VehicleFormModalProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
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
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSave = {
      ...formData,
      acquisition_date: convertDateToISO(formData.acquisition_date),
    }
    onSave(dataToSave)
    setFormData({
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
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseInt(value)) : value,
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    
    if (value.length >= 5) {
      value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{2})/, '$1/$2')
    }
    
    setFormData((prev) => ({
      ...prev,
      acquisition_date: value,
    }))
  }

  const convertDateToISO = (dateStr: string): string => {
    if (!dateStr) return ''
    const parts = dateStr.split('/')
    if (parts.length !== 3) return dateStr
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      ></div>
      <div className="relative bg-base-200 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto border border-base-300">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 text-base-content">Adicionar Veículo</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nome do Veículo *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Meu Carro"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Marca *</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="Ex: Toyota"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Modelo *</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Ex: Corolla"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ano de Fabricação *</span>
                </label>
                <input
                  type="number"
                  name="manufacturing_year"
                  value={formData.manufacturing_year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ano do Modelo *</span>
                </label>
                <input
                  type="number"
                  name="model_year"
                  value={formData.model_year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 2}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cor *</span>
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ex: Prata"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Placa</span>
                </label>
                <input
                  type="text"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  placeholder="Ex: ABC-1234"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">VIN (Chassi)</span>
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  placeholder="Ex: 1HGBH41JXMN109186"
                  maxLength={17}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">RENAVAM</span>
                </label>
                <input
                  type="text"
                  name="renavam"
                  value={formData.renavam}
                  onChange={handleChange}
                  placeholder="Ex: 12345678901"
                  maxLength={11}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Motor</span>
                </label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  placeholder="Ex: 2.0"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Transmissão</span>
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="select select-bordered w-full"
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
                <label className="label">
                  <span className="label-text">Combustível</span>
                </label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="select select-bordered w-full"
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
                <label className="label">
                  <span className="label-text">Potência (cv)</span>
                </label>
                <input
                  type="number"
                  name="horsepower"
                  value={formData.horsepower}
                  onChange={handleChange}
                  placeholder="Ex: 150"
                  min="0"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tipo de Carroceria</span>
                </label>
                <select
                  name="body_type"
                  value={formData.body_type}
                  onChange={handleChange}
                  className="select select-bordered w-full"
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
                <label className="label">
                  <span className="label-text">Portas</span>
                </label>
                <input
                  type="number"
                  name="doors"
                  value={formData.doors}
                  onChange={handleChange}
                  placeholder="Ex: 4"
                  min="1"
                  max="10"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Data de Aquisição (DD/MM/AAAA)</span>
                </label>
                <input
                  type="text"
                  name="acquisition_date"
                  value={formData.acquisition_date}
                  onChange={handleDateChange}
                  placeholder="Ex: 15/03/2024"
                  maxLength={10}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Preço de Aquisição (R$)</span>
                </label>
                <input
                  type="number"
                  name="acquisition_price"
                  value={formData.acquisition_price}
                  onChange={handleChange}
                  placeholder="Ex: 50000"
                  min="0"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Quilometragem Inicial *</span>
                </label>
                <input
                  type="number"
                  name="initial_mileage"
                  value={formData.initial_mileage}
                  onChange={handleChange}
                  placeholder="Ex: 0"
                  min="0"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control md:col-span-2 lg:col-span-3">
                <label className="label">
                  <span className="label-text">Acessórios (JSON)</span>
                </label>
                <textarea
                  name="accessories"
                  value={formData.accessories}
                  onChange={handleChange}
                  placeholder='Ex: {&quot;ar_condicionado&quot;: true, &quot;vidros_eletricos&quot;: true}'
                  rows={2}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              <div className="form-control md:col-span-2 lg:col-span-3">
                <label className="label">
                  <span className="label-text">Observações</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Observações adicionais sobre o veículo"
                  rows={3}
                  className="textarea textarea-bordered w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-base-300">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}