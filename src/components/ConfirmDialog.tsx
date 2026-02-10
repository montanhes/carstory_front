import { useRef, useEffect } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

  const handleConfirm = () => {
    onConfirm()
    dialogRef.current?.close()
  }

  const handleCancel = () => {
    onCancel()
    dialogRef.current?.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={handleCancel}
    >
      <div className="modal-box bg-base-200 border border-base-300">
        <h3 className="font-bold text-lg text-base-content">{title}</h3>
        <p className="py-4 text-base-content/70">{message}</p>
        <div className="modal-action gap-2">
          <button
            onClick={handleCancel}
            className="btn btn-ghost"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={isDangerous ? 'btn btn-error' : 'btn btn-primary'}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleCancel}>Fechar</button>
      </form>
    </dialog>
  )
}
