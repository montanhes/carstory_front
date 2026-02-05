import { useState, useEffect } from 'react'
import VehicleFormModal from '../components/VehicleFormModal'
import { vehicleService, enumService, type Vehicle, type EnumOption } from '../services/api'

export default function Vehicles() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bodyTypes, setBodyTypes] = useState<EnumOption[]>([])
  const [fuelTypes, setFuelTypes] = useState<EnumOption[]>([])
  const [transmissionTypes, setTransmissionTypes] = useState<EnumOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [vehiclesData, bodyTypesData, fuelTypesData, transmissionTypesData] = await Promise.all([
          vehicleService.getVehicles(),
          enumService.getBodyTypes(),
          enumService.getFuelTypes(),
          enumService.getTransmissionTypes(),
        ])
        setVehicles(vehiclesData)
        setBodyTypes(bodyTypesData)
        setFuelTypes(fuelTypesData)
        setTransmissionTypes(transmissionTypesData)
      } catch (err) {
        setError('Erro ao carregar dados. Tente novamente.')
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddVehicle = async (vehicle: any) => {
    try {
      const newVehicle = await vehicleService.createVehicle(vehicle)
      setVehicles([...vehicles, newVehicle])
      setIsModalOpen(false)
    } catch (err) {
      console.error('Erro ao criar veículo:', err)
      alert('Erro ao criar veículo. Tente novamente.')
    }
  }

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return
    
    try {
      await vehicleService.deleteVehicle(id)
      setVehicles(vehicles.filter(v => v.id !== id))
    } catch (err) {
      console.error('Erro ao excluir veículo:', err)
      alert('Erro ao excluir veículo. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-base-content">Veículos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Adicionar Veículo
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-base-content/30 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <p className="text-base-content/60 text-lg">Nenhum veículo cadastrado</p>
          <p className="text-base-content/40 text-sm mt-2">
            Clique no botão acima para adicionar seu primeiro veículo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-200 border border-base-300 hover:border-primary/50 group">
              <div className="card-body p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-base-content leading-tight">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-base-content/60 mt-0.5">
                      {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                  <div className="badge badge-primary badge-sm">
                    {vehicle.manufacturing_year}/{vehicle.model_year}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
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
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-base-300">
                  <div className="text-sm">
                    <span className="text-base-content/50">KM:</span>
                    <span className="text-base-content ml-1 font-medium">{vehicle.formatted_initial_mileage}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-xs btn-outline btn-primary">
                      Editar
                    </button>
                    <button 
                      className="btn btn-xs btn-outline btn-error"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddVehicle}
        bodyTypes={bodyTypes}
        fuelTypes={fuelTypes}
        transmissionTypes={transmissionTypes}
      />
    </div>
  )
}