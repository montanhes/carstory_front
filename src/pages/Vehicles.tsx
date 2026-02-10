import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import VehicleFormModal from '../components/VehicleFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import AlertDialog from '../components/AlertDialog'
import { vehicleService, enumService, type Vehicle, type EnumOption } from '../services/api'

type AlertType = 'error' | 'success' | 'info' | 'warning'

export default function Vehicles() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bodyTypes, setBodyTypes] = useState<EnumOption[]>([])
  const [fuelTypes, setFuelTypes] = useState<EnumOption[]>([])
  const [transmissionTypes, setTransmissionTypes] = useState<EnumOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: 'Erro ao criar veículo. Tente novamente.',
      })
    }
  }

  const handleDeleteVehicle = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Veículo',
      message: 'Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        try {
          await vehicleService.deleteVehicle(id)
          setVehicles(vehicles.filter(v => v.id !== id))
        } catch (err) {
          console.error('Erro ao excluir veículo:', err)
          setAlertDialog({
            isOpen: true,
            type: 'error',
            title: 'Erro',
            message: 'Erro ao excluir veículo. Tente novamente.',
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

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-base-content">Veículos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
        >
          <span className="sm:inline">Adicionar Veículo</span>
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-base-content/30 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 sm:h-16 w-12 sm:w-16 mx-auto"
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
          <p className="text-base-content/60 text-base sm:text-lg">Nenhum veículo cadastrado</p>
          <p className="text-base-content/40 text-sm mt-2">
            Clique no botão acima para adicionar seu primeiro veículo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-200 border border-base-300 hover:border-primary/50 group">
              <div className="card-body p-4 sm:p-5">
                {/* Header */}
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-base-content leading-tight break-words">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-base-content/60 mt-0.5 truncate">
                      {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                  <div className="badge badge-primary badge-xs sm:badge-sm whitespace-nowrap">
                    {vehicle.manufacturing_year}/{vehicle.model_year}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs sm:text-sm mb-4">
                  {vehicle.license_plate && (
                    <div className="truncate">
                      <span className="text-base-content/50">Placa:</span>
                      <span className="text-base-content ml-1 font-medium block truncate">{vehicle.license_plate}</span>
                    </div>
                  )}
                  <div className="truncate">
                    <span className="text-base-content/50">Cor:</span>
                    <span className="text-base-content ml-1 block truncate">{vehicle.color}</span>
                  </div>
                  {vehicle.fuel_label && (
                    <div className="truncate">
                      <span className="text-base-content/50">Combustível:</span>
                      <span className="text-base-content ml-1 block truncate">{vehicle.fuel_label}</span>
                    </div>
                  )}
                  {vehicle.transmission_label && (
                    <div className="truncate">
                      <span className="text-base-content/50">Câmbio:</span>
                      <span className="text-base-content ml-1 block truncate">{vehicle.transmission_label}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 pt-3 border-t border-base-300">
                  <div className="text-xs sm:text-sm">
                    <span className="text-base-content/50">KM:</span>
                    <span className="text-base-content ml-1 font-medium">{vehicle.formatted_initial_mileage}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-xs flex-1 btn-outline btn-primary"
                      onClick={() => navigate(`/dashboard/vehicles/${vehicle.id}`)}
                    >
                      Detalhes
                    </button>
                    <button
                      className="btn btn-xs flex-1 btn-outline btn-error"
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
    </div>
  )
}