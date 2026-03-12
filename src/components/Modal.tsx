import type { ReactNode } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  size?: ModalSize
  children: ReactNode
  footer?: ReactNode
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  footer,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-base-100 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col border border-base-300`}>
        {/* Header */}
        <div className="px-5 py-4 md:px-6 md:py-5 border-b border-base-300 bg-primary/5 rounded-t-2xl">
          <h3 className="text-lg md:text-xl font-bold text-base-content">{title}</h3>
          {subtitle && (
            <p className="text-xs text-base-content/50 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 md:px-6 md:py-5 border-t border-base-300 flex flex-col-reverse sm:flex-row justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
