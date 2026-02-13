import { useRef, useEffect } from 'react'

type AlertType = 'error' | 'success' | 'info' | 'warning'

interface AlertDialogProps {
  isOpen: boolean
  type: AlertType
  title: string
  message: string
  onClose: () => void
}

export default function AlertDialog({
  isOpen,
  type,
  title,
  message,
  onClose,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
      // Auto-close após 3 segundos
      const timer = setTimeout(() => {
        dialogRef.current?.close()
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  const getAlertClass = (alertType: AlertType) => {
    const baseClass = 'alert'
    switch (alertType) {
      case 'error':
        return `${baseClass} alert-error`
      case 'success':
        return `${baseClass} alert-success`
      case 'warning':
        return `${baseClass} alert-warning`
      case 'info':
      default:
        return `${baseClass} alert-info`
    }
  }

  const handleClose = () => {
    dialogRef.current?.close()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={handleClose}
    >
      <div className="modal-box bg-base-200 border border-base-300 p-0 overflow-hidden">
        <div className={getAlertClass(type)}>
          <div>
            <h3 className="font-bold">{title}</h3>
            <div className="text-sm">{message}</div>
          </div>
        </div>
        <div className="modal-action p-4">
          <button
            onClick={handleClose}
            className="btn btn-sm btn-ghost"
          >
            Fechar
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>Fechar</button>
      </form>
    </dialog>
  )
}
