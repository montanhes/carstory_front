import { useState, useEffect } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { Download, Share, X } from 'lucide-react'

const DISMISSED_KEY = 'moviu_pwa_install_dismissed'
const DISMISS_DAYS = 30

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isMobile() {
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isDismissed() {
  const ts = localStorage.getItem(DISMISSED_KEY)
  if (!ts) return false
  return Date.now() - Number(ts) < DISMISS_DAYS * 24 * 60 * 60 * 1000
}

export default function PWAInstallBanner() {
  const { canInstall, isInstalled, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(true) // começa oculto
  const [ios, setIos] = useState(false)

  useEffect(() => {
    if (isInstalled || isDismissed() || !isMobile()) return
    setIos(isIOS())
    setDismissed(false)
  }, [isInstalled])

  // Android: só mostra quando o evento beforeinstallprompt disparou
  if (!ios && !canInstall) return null
  if (dismissed || isInstalled) return null

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem(DISMISSED_KEY, String(Date.now()))
  }

  const handleInstall = async () => {
    const accepted = await install()
    if (!accepted) dismiss()
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="alert bg-base-200 border border-base-300 shadow-xl gap-3 flex-col items-start">
        <div className="flex items-start gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
            <span className="text-lg font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              M
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Instalar o Moviu</p>
            <p className="text-xs text-base-content/60 mt-0.5">
              {ios
                ? 'Adicione à tela inicial para acesso rápido'
                : 'Acesse rapidamente sem abrir o navegador'}
            </p>
          </div>
          <button onClick={dismiss} className="btn btn-ghost btn-xs btn-circle shrink-0">
            <X size={14} />
          </button>
        </div>

        {ios ? (
          <div className="text-xs text-base-content/70 bg-base-300/50 rounded-xl p-3 w-full space-y-1">
            <p>1. Toque em <Share size={12} className="inline mb-0.5" /> <strong>Compartilhar</strong> no Safari</p>
            <p>2. Role e toque em <strong>"Adicionar à Tela de Início"</strong></p>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="btn btn-primary btn-sm w-full gap-2"
          >
            <Download size={16} />
            Instalar agora
          </button>
        )}
      </div>
    </div>
  )
}
