import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService, apiService, type User } from '../services/api'
import ConfirmDialog from '../components/ConfirmDialog'
import AlertDialog from '../components/AlertDialog'

type AlertType = 'error' | 'success' | 'info' | 'warning'

interface ProfileFormData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export default function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

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
    const loadUser = async () => {
      try {
        setLoading(true)
        // Usar a rota /api/user que retorna o usuário autenticado
        const response = await authService.me()
        const userData = response.user || response
        setUser(userData)
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          password_confirmation: '',
        })
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
        setAlertDialog({
          isOpen: true,
          type: 'error',
          title: 'Erro',
          message: 'Erro ao carregar perfil. Tente novamente.',
        })
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'password' || name === 'password_confirmation') {
      setPasswordChanged(true)
    }
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      const dataToSend: any = {
        name: formData.name,
        email: formData.email,
      }

      // Só enviar senha se foi alterada
      if (passwordChanged && formData.password) {
        if (formData.password !== formData.password_confirmation) {
          setAlertDialog({
            isOpen: true,
            type: 'error',
            title: 'Erro',
            message: 'As senhas não conferem.',
          })
          return
        }
        dataToSend.password = formData.password
        dataToSend.password_confirmation = formData.password_confirmation
      }

      const updated = await apiService.put(`/api/users/${user.id}`, dataToSend)
      setUser(updated)
      setFormData((prev) => ({
        ...prev,
        password: '',
        password_confirmation: '',
      }))
      setPasswordChanged(false)

      setAlertDialog({
        isOpen: true,
        type: 'success',
        title: 'Sucesso',
        message: 'Perfil atualizado com sucesso.',
      })
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err)
      setAlertDialog({
        isOpen: true,
        type: 'error',
        title: 'Erro',
        message: err.response?.data?.message || 'Erro ao salvar perfil. Tente novamente.',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDisableAccount = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Desativar Conta',
      message: 'Tem certeza que deseja desativar sua conta? Esta ação pode ser irreversível.',
      onConfirm: async () => {
        if (!user) return

        try {
          await apiService.post(`/api/users/${user.id}/disable`, {})
          setAlertDialog({
            isOpen: true,
            type: 'success',
            title: 'Conta Desativada',
            message: 'Sua conta foi desativada com sucesso. Você será desconectado.',
          })
          // Aguardar um pouco antes de fazer logout
          setTimeout(() => {
            logout()
            navigate('/login')
          }, 2000)
        } catch (err: any) {
          console.error('Erro ao desativar conta:', err)
          setAlertDialog({
            isOpen: true,
            type: 'error',
            title: 'Erro',
            message: err.response?.data?.message || 'Erro ao desativar conta. Tente novamente.',
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

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-6">Meu Perfil</h2>

      {/* Formulário de Edição */}
      <div className="card bg-base-200 shadow-md border border-base-300 max-w-2xl">
        <div className="card-body p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>

          <div className="space-y-4">
            {/* Nome */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text">Nome *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                className="input input-bordered input-sm md:input-md w-full"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="input input-bordered input-sm md:input-md w-full"
                required
                readOnly
              />
            </div>

            {/* Divider */}
            <div className="divider my-2">Alterar Senha (Opcional)</div>

            {/* Nova Senha */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text">Nova Senha</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Deixe em branco para não alterar"
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            {/* Confirmar Senha */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text">Confirmar Senha</span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Confirme a nova senha"
                className="input input-bordered input-sm md:input-md w-full"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-4 border-t border-base-300">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary btn-sm md:btn-md flex-1"
              >
                {saving ? <span className="loading loading-spinner loading-xs"></span> : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="card bg-error/10 border-2 border-error shadow-md max-w-2xl mt-6">
        <div className="card-body p-4 md:p-6">
          <h3 className="text-lg font-semibold text-error mb-2">Zona de Perigo</h3>
          <p className="text-sm text-base-content/70 mb-4">
            Desativar sua conta é uma ação irreversível. Todos os seus dados serão mantidos mas você não poderá mais acessar o sistema.
          </p>
          <button
            onClick={handleDisableAccount}
            className="btn btn-outline btn-error btn-sm md:btn-md w-full sm:w-auto"
          >
            Desativar Conta
          </button>
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmar"
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
